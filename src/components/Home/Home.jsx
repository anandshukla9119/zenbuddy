import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { productData, responsive } from "../../Data/dataCarousel";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const features = [
    {
      title: "Track Your Mood",
      description: "Monitor your daily emotional well-being",
      icon: "😊",
      link: "/moodTracker"
    },
    {
      title: "Meditation",
      description: "Find peace with guided meditation sessions",
      icon: "🧘‍♀️",
      link: "/meditation"
    },
    {
      title: "Community",
      description: "Connect with others on similar journeys",
      icon: "👥",
      link: "/community"
    },
    {
      title: "Resources",
      description: "Access helpful mental wellness resources",
      icon: "📚",
      link: "/resources"
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ZenBuddy</h1>
          <p>Your companion on the journey to mental wellness</p>
          <div className="hero-buttons">
            <Link to="/chatBot" className="primary-button">Chat with AI</Link>
            <Link to="/quiz" className="secondary-button">Take Quiz</Link>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <h2>Explore Wellness</h2>
        <Carousel
          swipeable={true}
          draggable={false}
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {productData.map((item) => (
            <div key={item.id} className="carousel-card">
              <img src={item.imageurl} alt={item.name} className="carousel-image" />
              <div className="carousel-content">
                <h3>{item.name}</h3>
                {/* <p>{item.description}</p> */}
                <Link to={item.link} className="learn-more-link">Learn More</Link>
                <p>{item.data}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Get Started</h2>
        <div className="action-buttons">
          <Link to="/profile" className="action-button">
            <span>📝</span> Create Profile
          </Link>
          <Link to="/resources" className="action-button">
            <span>🎯</span> Explore Resources
          </Link>
          <Link to="/meditation" className="action-button">
            <span>🧘‍♀️</span> Start Meditation
          </Link>
        </div>
      </section>
    </div>
  );
}
