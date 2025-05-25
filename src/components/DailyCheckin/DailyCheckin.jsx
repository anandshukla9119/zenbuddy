import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthDetails';
import { db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './DailyCheckin.css';

const quotes = {
  monday: {
    quote: "Every Monday is a fresh start. Time to set new goals and crush them!",
    author: "Anand Shukla"
  },
  tuesday: {
    quote: "Tuesday is a good day to make it great. Your positive attitude can turn it all around.",
    author: "Unknown"
  },
  wednesday: {
    quote: "Wednesday: Halfway to the weekend! Your determination got you here, keep pushing forward.",
    author: "Unknown"
  },
  thursday: {
    quote: "Thursday is full of potential. You're so close to achieving your weekly goals!",
    author: "Shivam Dubey"
  },
  friday: {
    quote: "It's Friday! Time to reflect on your accomplishments and celebrate your progress.",
    author: "Unknown"
  },
  saturday: {
    quote: "Saturday is for self-care. Take time to recharge and prepare for the week ahead.",
    author: "Unknown"
  },
  sunday: {
    quote: "Sunday is your day to plan, prepare, and set intentions for an amazing week.",
    author: "Pulkit"
  }
};

function DailyCheckin() {
  const [checkins, setCheckins] = useState({});
  const [currentDay, setCurrentDay] = useState('');
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [streak, setStreak] = useState(0); // 🔥 Streak state
  const { currentUser } = useAuth();

  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const dayName = days[today.getDay()].toLowerCase();
    setCurrentDay(dayName);
    setQuote(quotes[dayName]);

    const checkTodayCheckin = async () => {
      if (!currentUser) return;

      const weekStart = getWeekStartDate();
      const docRef = doc(db, 'dailyCheckins', `${currentUser.uid}_${weekStart}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data().days || {};
        setCheckins(data);

        // 🔥 Calculate Streak
        const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        let count = 0;
        for (let i = daysOrder.indexOf(dayName); i >= 0; i--) {
          if (data[daysOrder[i]]) {
            count++;
          } else {
            break;
          }
        }
        setStreak(count);
      }
    };

    checkTodayCheckin();
  }, [currentUser]);

  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const diff = now.getDate() - dayOfWeek;
    const weekStart = new Date(now.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  };

  const handleCheckin = async () => {
    if (!currentUser) return;

    const weekStart = getWeekStartDate();
    const docRef = doc(db, 'dailyCheckins', `${currentUser.uid}_${weekStart}`);

    const updatedCheckins = {
      ...checkins,
      [currentDay]: true
    };

    await setDoc(docRef, {
      userId: currentUser.uid,
      weekStart,
      days: updatedCheckins
    }, { merge: true });

    setCheckins(updatedCheckins);

    // 🔥 Update Streak after check-in
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let count = 0;
    for (let i = daysOrder.indexOf(currentDay); i >= 0; i--) {
      if (updatedCheckins[daysOrder[i]]) {
        count++;
      } else {
        break;
      }
    }
    setStreak(count);
  };

  const renderDayStatus = (day) => {
    const isToday = currentDay === day;
    const isChecked = checkins[day];

    return (
      <div className={`day-status ${isToday ? 'today' : ''} ${isChecked ? 'checked' : ''}`} key={day}>
        <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
        {isChecked && <span className="check-mark">✓</span>}
      </div>
    );
  };

  return (
    <div className="daily-checkin-page">
      <h2>Daily Check-in</h2>
      <p className="welcome-text">Welcome to your daily wellness check-in!</p>

      <div className="quote-container">
        <p className="quote">"{quote.quote}"</p>
        <p className="author">- {quote.author}</p>
      </div>

      {/* 🔥 Streak Counter */}
      <div className="streak-counter">
        🔥 Streak: {streak} day{streak === 1 ? '' : 's'}
      </div>

      <div className="week-progress">
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(renderDayStatus)}
      </div>

      <div className="checkin-actions">
        <button className="checkin-button" onClick={handleCheckin}>
          Check In for Today
        </button>
      </div>
    </div>
  );
}

export default DailyCheckin;
