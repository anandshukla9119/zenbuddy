// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './auth/AuthDetails';
// import Header from './components/Header/Header';
// import Explore from './components/ExploreSec/ExploreSec';
// import Login from './auth/Login';
// import Signup from './auth/Signup';
// import AboutUs from './components/About Us/AboutUs';
// import Profile from './components/Profile/profile';
// import ProfileUpdate from './components/Profile/ProfileUpdate';
// import Resources from './components/Resources/Resources';
// import MoodTracker from './components/MoodTracker/MoodTracker';
// import Meditation from './components/Meditation/Meditation';
// import Quiz from './components/Quiz/Quiz';
// import Community from './components/Community/Community';
// import DailyCheckin from './components/DailyCheckin/DailyCheckin'; // ✅ Import DailyCheckin

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <div className="App">
//           <Header />
//           <Routes>
//             <Route path="/" element={<Explore />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/about" element={<AboutUs />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/resources" element={<Resources />} />
//             <Route path="/moodTracker" element={<MoodTracker />} />
//             <Route path="/update-profile" element={<ProfileUpdate />} />
//             <Route path="/meditation" element={<Meditation />} />
//             <Route path="/quiz" element={<Quiz />} />
//             <Route path="/community" element={<Community />} />
//             <Route path="/dailyCheckin" element={<DailyCheckin />} />
//           </Routes>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthDetails';
import Header from './components/Header/Header';
// import Explore from './components/ExploreSec/ExploreSec';
import Home from './components/Home/Home';
import Login from './auth/Login';
import Signup from './auth/Signup';
import AboutUs from './components/About Us/AboutUs';
import Profile from './components/Profile/profile';
import ProfileUpdate from './components/Profile/ProfileUpdate';
import Resources from './components/Resources/Resources';
import MoodTracker from './components/MoodTracker/MoodTracker';
import Meditation from './components/Meditation/Meditation';
import Quiz from './components/Quiz/Quiz';
import Community from './components/Community/Community';
import DailyCheckin from './components/DailyCheckin/DailyCheckin';
import Tools from './components/Tools/Tools';

// ✅ Import ChatBot
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/moodTracker" element={<MoodTracker />} />
            <Route path="/update-profile" element={<ProfileUpdate />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/community" element={<Community />} />
            <Route path="/dailyCheckin" element={<DailyCheckin />} />
            <Route path="/chatBot" element={<ChatBot />} />
            <Route path="/tools" element={<Tools />} />
            </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
