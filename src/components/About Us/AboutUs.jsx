import React from "react";
import "./AboutUs.css";
import { FaInstagram, FaLinkedin, FaTelegram, FaTwitter, FaEnvelope, FaGithub } from "react-icons/fa"; // Importing Icons

const teamMembers = [
  {
    name: "Anand Prakash Shukla",
    role: "Project Lead",
    description: "A passionate developer leading the ZenBuddy project, ensuring a smooth and impactful final product.",
    github: "#",
    linkedin: "#",
    photo: "/profile1.0/Anand.png",  // ✅ Updated Path
  },
  {
    name: "Abhay Patel",
    role: "UI/UX Designer",
    description: "Focused on creating a seamless user experience and aesthetic design for ZenBuddy.",
    github: "#",
    linkedin: "#",
    photo: "/profile1.0/Abhay.png",  // ✅ Updated Path
  },
  {
    name: "Priyanshi Saxena",
    role: "Frontend Engineer",
    description: "Bringing the designs to life with clean and efficient code.",
    github: "#",
    linkedin: "#",
    photo: "/profile1.0/Priyanshi.png",  // ✅ Updated Path
  },
  {
    name: "Anjali Rawat",
    role: "Frontend Engineer",
    description: "Building interactive and responsive features to enhance the user experience.",
    github: "#",
    linkedin: "#",
    photo: "/profile1.0/Anjali.png",  // ✅ Updated Path
  },
];

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-section">
        <h1 className="about-title">About ZenBuddy</h1>
        
        {/* Why We Created ZenBuddy */}
        <h2 className="why-title">Why ZenBuddy?</h2>
        <p className="about-description">
          In today's fast-paced world, mental health challenges have become more prevalent than ever. Students, working professionals, and even homemakers are struggling with stress, anxiety, and depression, yet there is still a lack of accessible mental health support. Many people hesitate to seek help due to stigma, cost, or unavailability of resources.
        </p>
        
        <p className="about-description">
          That's where ZenBuddy comes in! 🌿 <strong>"Zen" means peace and calm, while "Buddy" represents a friend who is always there for you.</strong> Our goal is to create an AI-powered mental health companion that provides chat-based support, self-care tools, and mental well-being tracking – all in a **safe, private, and judgment-free space**.
        </p>

        <p className="about-description">
          With ZenBuddy, users can talk to an AI-driven assistant, access self-help resources, and keep track of their mental health progress in a way that is simple, effective, and most importantly – confidential.
        </p>

        <h2 className="team-title">Meet Our Team</h2>
        <div className="team-container">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.photo} alt={member.name} className="team-photo" />
              <h3>{member.name}</h3>
              <p className="role">{member.role}</p>
              <p className="description">{member.description}</p>
              <div className="social-links">
                <a href={member.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="social-icon" />
                </a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="social-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 📞 Contact Us Section */}
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-container">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaInstagram className="contact-icon" /> Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaLinkedin className="contact-icon" /> LinkedIn
          </a>
          <a href="https://telegram.me" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaTelegram className="contact-icon" /> Telegram
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="contact-link">
            <FaTwitter className="contact-icon" /> Twitter
          </a>
          <a href="mailto:contact@zenbuddy.com" className="contact-link">
            <FaEnvelope className="contact-icon" /> Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
