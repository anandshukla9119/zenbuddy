// src/pages/Tools.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Tools.css";

const tools = [
  {
    name: "Mood Tracker",
    path: "/moodTracker",
    icon: "😊",
    description: "Track your daily mood patterns to gain better emotional awareness and identify trends over time."
  },
  {
    name: "Meditation",
    path: "/meditation",
    icon: "🧘‍♀️",
    description: "Access calming guided meditation sessions to help reduce stress, anxiety, and improve focus."
  },
  {
    name: "Quiz",
    path: "/quiz",
    icon: "❓",
    description: "Take mental wellness quizzes designed to help you better understand your emotional state."
  },
  {
    name: "ChatBot",
    path: "/chatBot",
    icon: "🤖",
    description: "Talk to our AI-powered chatbot for a safe space to express your thoughts and feel heard instantly."
  },
];

const Tools = () => {
  return (
    <div className="tools-container">
      <h2>🧰 Explore Tools</h2>
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <Link to={tool.path} key={index} className="tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tools;
