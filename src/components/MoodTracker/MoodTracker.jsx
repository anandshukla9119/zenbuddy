import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthDetails';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import './MoodTracker.css';

const emotions = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Anxious', emoji: '😰' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Angry', emoji: '😠' },
  { label: 'Energetic', emoji: '⚡' },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const { currentUser } = useAuth(); // ✅ Replace 'user' with 'currentUser'

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      loadMoodHistory();
    }
  }, [currentUser]);

  const loadMoodHistory = async () => {
    try {
      const moodsRef = collection(db, 'moods');
      const q = query(moodsRef, where('userId', '==', currentUser.uid)); // use currentUser here
      const querySnapshot = await getDocs(q);
      const moods = [];
      querySnapshot.forEach((doc) => {
        moods.push({ id: doc.id, ...doc.data() });
      });
      setMoodHistory(moods.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  const handleMoodSubmit = async () => {
    if (!currentUser || !currentUser.uid) {
      alert('Please login to submit your mood.');
      return;
    }

    if (!selectedMood) {
      alert('Please select a mood before submitting.');
      return;
    }

    try {
      const moodData = {
        userId: currentUser.uid, // use currentUser here
        mood: selectedMood,
        intensity,
        note,
        timestamp: Date.now(),
      };

      await addDoc(collection(db, 'moods'), moodData);
      await loadMoodHistory();

      // Reset the form
      setSelectedMood(null);
      setIntensity(5);
      setNote('');
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  // Reset the mood tracker form when the user decides to cancel
  const handleCancel = () => {
    setSelectedMood(null);
    setIntensity(5);
    setNote('');
  };

  return (
    <div className="mood-container">
      <h1 className="mood-title">Mood Tracker</h1>

      <div className="mood-paper">
        <h2 className="mood-subtitle">How are you feeling today?</h2>

        <div className="mood-buttons">
          {emotions.map((emotion) => (
            <button
              key={emotion.label}
              className={`mood-button ${selectedMood === emotion.label ? 'selected' : ''}`}
              onClick={() => setSelectedMood(emotion.label)}
            >
              <span className="emoji">{emotion.emoji}</span>
              <span className="mood-label">{emotion.label}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="mood-details">
            <label>Intensity</label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="intensity-slider"
            />
            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="note-field"
            />
            <button
              onClick={handleMoodSubmit}
              className="save-button"
              disabled={!selectedMood}
            >
              Save Mood
            </button>
            {/* Cancel Button */}
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        )}
      </div>

      <h2 className="mood-history-title">Recent Mood History</h2>

      <div className="mood-history">
        {moodHistory.slice(0, 5).map((entry) => (
          <div key={entry.id} className="history-card">
            <div className="history-mood">
              {emotions.find((e) => e.label === entry.mood)?.emoji} {entry.mood}
            </div>
            <div className="history-intensity">Intensity: {entry.intensity}/10</div>
            {entry.note && <div className="history-note">{entry.note}</div>}
            <div className="history-timestamp">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
