import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [pictureUrl, setPictureUrl] = useState('/public/default-avatar.png');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`http://localhost:5000/getUser?uid=${user.uid}`);
        const { name, age, gender, profilePicture } = res.data;

        if (name || age || gender) {
          setName(name || '');
          setAge(age || '');
          setGender(gender || '');
          if (profilePicture) {
            setPictureUrl(`data:image/jpeg;base64,${profilePicture}`);
          }
          return;
        }

        throw new Error('MongoDB user not found');
      } catch (mongoErr) {
        console.warn('MongoDB fallback:', mongoErr.message);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || data.usernames || data.username || '');
            setAge(data.age || '');
            setGender(data.gender || '');
          }
        } catch (firestoreErr) {
          console.error('❌ Firestore fetch failed:', firestoreErr);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setPictureUrl(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append('userId', user.uid);
    formData.append('name', name);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('profilePicture', file);

    try {
      const res = await axios.post('http://localhost:5000/updateProfile', formData);
      console.log('✅', res.data.message);
    } catch (err) {
      console.error('❌ Error uploading profile:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="user-info">
          <div className="avatar-and-details">
            <div className="avatar-container">
              <img className="avatar" src={pictureUrl} alt="Profile" />
            </div>
            <div className="details">
              <h3>{name || '—'}</h3>
              <p>Age: {age || '—'}</p>
              <p>Gender: {gender || '—'}</p>
            </div>
          </div>
          <div className="edit-button-container">
            <button
              className="edit-profile-btn"
              onClick={() => navigate('/update-profile')}
            >
              Edit Info
            </button>
          </div>
        </div>

        <div className="motivational-story">
          <h2 className="story-title">Stay Strong, Keep Going!</h2>
          <p className="story-content">
            Life is not always easy, but it’s in these moments of challenge that we grow the most.
            When you face obstacles, remember they are not here to break you, but to build you stronger.
            You have within you an incredible power to overcome anything that comes your way.
            Keep pushing, keep believing in yourself, and know that no matter what, you are capable
            of great things. Every step you take forward, no matter how small, is a victory.
            Stay focused on the journey and embrace the process. You’ve got this!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
