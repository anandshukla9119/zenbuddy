import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import './profileUpdate.css';

const ProfileUpdate = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [message, setMessage] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:5000/getUser?uid=${user.uid}`);
          const userData = res.data;

          setName(userData.name || '');
          setAge(userData.age || '');
          setGender(userData.gender || '');

          if (userData.profilePicture?.data) {
            const base64 = btoa(
              new Uint8Array(userData.profilePicture.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            setProfilePictureUrl(`data:image/jpeg;base64,${base64}`);
          }
        } catch (err) {
          console.error('❌ Error fetching profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePictureUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('❌ User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.uid);
    if (name.trim()) formData.append('name', name);
    if (age.trim()) formData.append('age', age);
    if (gender.trim()) formData.append('gender', gender);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const response = await axios.post('http://localhost:5000/updateProfile', formData);
      const updatedUser = response.data.user;

      if (updatedUser.name) setName(updatedUser.name);
      if (updatedUser.age) setAge(updatedUser.age);
      if (updatedUser.gender) setGender(updatedUser.gender);

      if (updatedUser.profilePicture?.data) {
        const base64 = btoa(
          new Uint8Array(updatedUser.profilePicture.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        setProfilePictureUrl(`data:image/jpeg;base64,${base64}`);
      }

      setMessage('✅ Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setMessage('❌ Error updating profile');
    }
  };

  return (
    <div className="profile-update-wrapper">
      <div className="profile-update-container">
        <h2>Update Profile</h2>

        {profilePictureUrl && (
          <img
            src={profilePictureUrl}
            alt="Profile Preview"
            className="profile-image"
          />
        )}

        <form onSubmit={handleUpdate} className="profile-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="file"
            onChange={handleFileChange}
          />
          <button type="submit">Update</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ProfileUpdate;
