import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Meditation.css'; // Import the external CSS

const meditations = [
  {
    title: 'Mindful Breathing',
    duration: '5 min',
    description: 'Mindful breathing during meditation means focusing on each breath, staying present, and calmly observing the inhale and exhale without distraction.',
    image: '/public/meditation/Mindful.png',
    audioUrl: '/public/meditation/relaxing.mp3'
  },
  {
    title: 'Body Scan',
    duration: '10 min',
    description: 'Body scan in meditation involves paying close attention to each part of the body, observing sensations without judgment or distraction.',
    image: '/public/meditation/body.png',
    audioUrl: '/public/meditation/energy.mp3'
  },
  {
    title: 'Loving Kindness',
    duration: '15 min',
    description: 'Loving-kindness meditation involves sending compassion and positive wishes to yourself and others, cultivating warmth, kindness, and connection.',
    image: '/public/meditation/loving.png',
    audioUrl: '/public/meditation/tenderness.mp3'
  },
  {
    title: 'Stress Relief',
    duration: '8 min',
    description: 'Stress relief through meditation involves focusing on your breath, releasing tension, and allowing your mind and body to relax fully.',
    image: '/public/meditation/stress.png',
    audioUrl: '/public/meditation/Stress.mp3'
  },
  {
    title: 'Sleep Well',
    duration: '20 min',
    description: 'Sleep well meditation involves calming the mind, focusing on your breath, and releasing tension to promote deep, restful sleep.',
    image: '/public/meditation/sleep.png',
    audioUrl: '/public/meditation/Sleep.mp3'
  },
  {
    title: 'Morning Energy',
    duration: '7 min',
    description: 'Morning energy meditation involves setting positive intentions, focusing on your breath, and energizing your mind and body for the day ahead.',
    image: '/public/meditation/morning.png',
    audioUrl: '/public/meditation/sunny.mp3'
  }
];

const Meditation = () => {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const audioRef = useRef(new Audio());

  const handlePlay = (meditation) => {
    if (currentTrack === meditation && playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      if (currentTrack !== meditation) {
        audioRef.current.src = meditation.audioUrl;
        setCurrentTrack(meditation);
      }
      audioRef.current.play();
      setPlaying(true);
    }
  };

  // Update progress bar and time
  useEffect(() => {
    const audio = audioRef.current;
    
    // Wait for the audio to load and get the duration
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      setTotalTime(formatTime(duration));
    };

    audio.ontimeupdate = () => {
      const current = audio.currentTime;
      const duration = audio.duration;
      const percentage = (current / duration) * 100;

      setProgress(percentage);
      setCurrentTime(formatTime(current));
    };

    return () => {
      audioRef.current.ontimeupdate = null;
      audioRef.current.onloadedmetadata = null;
    };
  }, [currentTrack]);

  // Format time in mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Guided Meditations</h1>
        <p>Find peace and balance through our collection of guided meditations</p>
      </div>

      <div className="grid-container">
        {meditations.map((meditation, index) => (
          <motion.div
            key={index}
            className="grid-item"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card">
              <img
                className="card-img"
                src={meditation.image}
                alt={meditation.title}
              />
              <div className="card-content">
                <h3>{meditation.title}</h3>
                <p>{meditation.description}</p>
                <div className="card-footer">
                  <span>{meditation.duration}</span>
                  <button
                    className="play-btn"
                    onClick={() => handlePlay(meditation)}
                  >
                    {currentTrack === meditation && playing ? 'Pause' : 'Play'}
                  </button>
                </div>
                {currentTrack === meditation && (
                  <>
                    <div className="time-display">
                      <span>{currentTime}</span> / <span>{totalTime}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Meditation;
