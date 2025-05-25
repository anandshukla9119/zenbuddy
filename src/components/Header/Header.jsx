import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../auth/AuthDetails";

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleNavigation = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="glass-navbar">
      <div className="brand" onClick={() => navigate("/")}>ZenBuddy</div>

      {/* Right side container for back button and hamburger */}
      <div className="right-container">
        {location.pathname !== "/" && (
          <button className="back-btn" onClick={() => navigate(-1)}>🔙</button>
        )}

        {isMobile && (
          <button 
            className="hamburger" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Navigation links - shown normally on desktop, conditionally on mobile */}
      {(isMenuOpen || !isMobile) && (
        <div className={`nav-content ${isMobile ? "mobile-menu" : ""}`}>
          {currentUser ? (
            <div className="nav-links">
              <span className="user">{currentUser.email}</span>
              <button onClick={() => handleNavigation("/profile")}>👤 Profile</button>
              <button onClick={() => handleNavigation("/tools")}>🧰 Tools</button>
              <button onClick={() => handleNavigation("/community")}>💬 Community</button>
              <button onClick={() => handleNavigation("/resources")}>📚 Resources</button>
              <button onClick={() => handleNavigation("/dailyCheckin")}>📅 Checkin</button>
              <button onClick={() => handleNavigation("/about")}>ℹ️ About</button>
              <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <button onClick={() => handleNavigation("/login")}>Login</button>
              <button onClick={() => handleNavigation("/signup")} className="signup">Sign Up</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;