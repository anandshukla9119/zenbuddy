import React, { useState } from 'react';
import './Resources.css';

const resources = [
  {
    category: 'Crisis Support',
    icon: '🆘',
    items: [
      {
        title: 'National Crisis Helpline',
        description: '24/7 support for mental health emergencies',
        contact: '1-800-273-8255',
        link: 'https://suicidepreventionlifeline.org',
        tags: ['crisis', 'emergency', 'suicide prevention']
      },
      {
        title: 'Crisis Text Line',
        description: 'Text HOME to 741741 to connect with a Crisis Counselor',
        contact: 'Text HOME to 741741',
        link: 'https://www.crisistextline.org',
        tags: ['crisis', 'text support', 'counseling']
      }
    ]
  },
  {
    category: 'Educational Resources',
    icon: '📘',
    items: [
      {
        title: 'Mental Health Basics',
        description: 'Learn about common mental health conditions and treatments',
        link: 'https://www.nimh.nih.gov/health',
        tags: ['education', 'mental health', 'conditions']
      },
      {
        title: 'Mindfulness Guide',
        description: 'Comprehensive guide to mindfulness and meditation',
        link: 'https://www.mindful.org',
        tags: ['mindfulness', 'meditation', 'self-help']
      }
    ]
  },
  {
    category: 'Support Groups',
    icon: '👥',
    items: [
      {
        title: 'Anxiety and Depression Support',
        description: 'Online support groups for anxiety and depression',
        link: 'https://adaa.org',
        tags: ['anxiety', 'depression', 'support group']
      },
      {
        title: 'NAMI Connection',
        description: 'Recovery support groups for adults with mental health conditions',
        link: 'https://nami.org/Support-Education/Support-Groups',
        tags: ['support group', 'recovery', 'community']
      },
      {
        title: 'NAMI Connection',
        description: 'Recovery support groups for adults with mental health conditions',
        link: 'https://nami.org/Support-Education/Support-Groups',
        tags: ['support group', 'recovery', 'community']
      }
    ]
  },
  {
    category: 'Self-Help Tools',
    icon: '📌',
    items: [
      {
        title: 'Anxiety Management Techniques',
        description: 'Practical tools and exercises for managing anxiety',
        link: 'https://www.anxietycanada.com',
        tags: ['anxiety', 'self-help', 'techniques']
      },
      {
        title: 'Sleep Improvement Guide',
        description: 'Evidence-based strategies for better sleep',
        link: 'https://www.sleepfoundation.org',
        tags: ['sleep', 'self-help', 'wellness']
      }
    ]
  }
];

const Resources = () => {
  const [expandedCategory, setExpandedCategory] = useState('');

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? '' : category);
  };

  return (
    <div className="resources-container">
      <section className="resources-header">
        <h2>🧠 Mental Health Resources</h2>
        <p>Find trustworthy crisis support, self-help tools, and learning materials</p>
      </section>

      <section className="resources-list">
        {resources.map((category, index) => (
          <div className="resource-category" key={index}>
            <div
              className="category-header"
              onClick={() => toggleCategory(category.category)}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.category}</h3>
              <span className="arrow">{expandedCategory === category.category ? '▲' : '▼'}</span>
            </div>

            {expandedCategory === category.category && (
              <div className="category-items">
                {category.items.map((item, i) => (
                  <div className="resource-card" key={i}>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    {item.contact && <p className="contact">📞 {item.contact}</p>}
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      Visit Site →
                    </a>
                    <div className="tag-container">
                      {item.tags.map((tag, tIndex) => (
                        <span className="tag" key={tIndex}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
    
  );
};

export default Resources;
