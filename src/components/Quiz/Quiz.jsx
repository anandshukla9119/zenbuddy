
import React, { useState, useEffect } from 'react';
import { QuizData } from '../../Data/QuizData';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import './Quiz_app.css';
import { useAuth } from '../../auth/AuthDetails'; // Corrected import for useAuth

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(Array(QuizData.length).fill(0));
  const [outputMessage, setOutputMessage] = useState("");
  const [quizHistory, setQuizHistory] = useState([]);
  const { currentUser } = useAuth(); // ✅ useAuth for getting the currentUser

  // Load the quiz history when the component mounts
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      loadQuizHistory();
    }
  }, [currentUser]);

  // Fetch quiz history from Firestore
  const loadQuizHistory = async () => {
    try {
      const quizRef = collection(db, 'quizResults');
      const q = query(quizRef, where('userId', '==', currentUser.uid)); 
      const querySnapshot = await getDocs(q);
      const quizzes = [];
      querySnapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() });
      });
      setQuizHistory(quizzes.sort((a, b) => b.timestamp - a.timestamp)); // Sort by timestamp
    } catch (error) {
      console.error('Error loading quiz history:', error);
    }
  };

  // Handle answer selection and score update
  const handleAnswerOptionClick = (isCorrect, index) => {
    if (isCorrect) {
      const newScore = [...score];
      newScore[index] += 1;
      setScore(newScore);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < QuizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      evaluateResults();
    }
  };

  // Evaluate the quiz results and save them
  const evaluateResults = async () => {
    const totalScore = score.reduce((acc, curr) => acc + curr, 0); // Sum up the total score
    let message = "";

    // Score-based message logic
    if (totalScore <= 7) {
      message = `🟢 Low Risk (Score: ${totalScore}) — No need for doctor; suggest self-care like journaling, meditation, and regular sleep.`;
    } else if (totalScore <= 14) {
      message = `🟡 Moderate Risk (Score: ${totalScore}) — Monitor your mental health closely. Use tools like the AI chatbot and mood tracking features.`;
    } else if (totalScore <= 22) {
      message = `🟠 High Risk (Score: ${totalScore}) — It's advisable to consult a mental health professional (online/in-person).`;
    } else {
      message = `🔴 Critical Risk (Score: ${totalScore}) — Immediate help needed! Please contact a psychiatrist or emergency services urgently.`;
    }

    setOutputMessage(message);

    // Save quiz result to Firestore
    if (currentUser && currentUser.uid) {
      const quizResultData = {
        userId: currentUser.uid,
        score: totalScore, // Store total score instead of array
        resultMessage: message,
        timestamp: Date.now(),
      };

      try {
        await addDoc(collection(db, 'quizResults'), quizResultData);
        loadQuizHistory(); // Reload quiz history after saving new result
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
  };

  // Reset quiz for reattempt
  const reattemptQuiz = () => {
    setCurrentQuestion(0);
    setScore(Array(QuizData.length).fill(0));
    setOutputMessage("");
  };

  return (
    <div className="quiz">
      {outputMessage ? (
        <div className="result-card">
          <h3>Quiz Results</h3>
          <p>{outputMessage}</p>
          {/* Reattempt button */}
          <button className="reattempt-btn" onClick={reattemptQuiz}>Reattempt the Quiz</button>
        </div>
      ) : (
        <div className="question-section">
          <h2>{QuizData[currentQuestion].question}</h2>
          <div className="answer-section">
            {QuizData[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() =>
                  handleAnswerOptionClick(
                    QuizData[currentQuestion].answer.includes(index),
                    currentQuestion
                  )
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <h2 className="quiz-history-title">Previous Quiz Results</h2>

      <div className="quiz-history">
        {quizHistory.slice(0, 5).map((entry) => (
          <div key={entry.id} className="history-card">
            <div className="history-score">
              Score: {entry.score} {/* Displaying total score */}
            </div>
            <div className="history-message">{entry.resultMessage}</div>
            <div className="history-timestamp">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
