import React, { useState, useEffect } from 'react';
import './RunningDesignApp.css';

const RunningDesignApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Featured Training Plans with beautiful design elements
  const trainingPlans = [
    {
      name: "Marathon Mastery",
      duration: "16 weeks",
      focus: "Endurance Building",
      colors: ["#1E6B96", "#89CDF1", "#F5F5F5"],
      description: "Comprehensive marathon training with periodized buildup and strategic recovery phases"
    },
    {
      name: "Speed Development", 
      duration: "12 weeks",
      focus: "VO2 Max & Speed",
      colors: ["#FF6B35", "#F7931E", "#1E6B96"],
      description: "High-intensity interval training and speed work to unlock your fastest running potential"
    },
    {
      name: "Base Building",
      duration: "8 weeks",
      focus: "Aerobic Foundation",
      colors: ["#FF6B35", "#1E6B96", "#2E8B57", "#F7931E"],
      description: "Build your aerobic engine with progressive mileage and sustainable training loads"
    },
    {
      name: "5K Breakthrough",
      duration: "10 weeks",
      focus: "Lactate Threshold",
      colors: ["#2E8B57", "#FF6B35", "#000000"],
      description: "Targeted 5K training focusing on tempo runs and lactate threshold development"
    },
    {
      name: "Ultra Preparation",
      duration: "20 weeks",
      focus: "Ultra Distance",
      colors: ["#000000", "#F5F5F5", "#89CDF1"],
      description: "Long-distance preparation with back-to-back runs and nutrition strategy training"
    },
    {
      name: "Recovery & Rebuilding",
      duration: "6 weeks",
      focus: "Active Recovery",
      colors: ["#F7931E", "#2E8B57", "#FF6B35", "#1E6B96"],
      description: "Gentle return to training with mobility work and gradual load progression"
    }
  ];

  const runningFeatures = [
    { feature: 'Pace Calculator', symbol: '⏱️', description: 'Calculate splits for any distance and goal time' },
    { feature: 'VDOT Analysis', symbol: '📊', description: 'Jack Daniels training zones and equivalencies' },
    { feature: 'Training Plans', symbol: '📋', description: 'Structured programs for every goal and level' },
    { feature: 'Workout Builder', symbol: '�️', description: 'Create custom interval and tempo sessions' },
    { feature: 'Progress Tracking', symbol: '�', description: 'Monitor your improvements over time' },
    { feature: 'Race Predictions', symbol: '�', description: 'Predict times across all distances' }
  ];

  useEffect(() => {
    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % trainingPlans.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle keyboard navigation for accessibility
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') setSelectedPlan(null);
      if (e.key === 'ArrowLeft') setCurrentFeature(prev => prev > 0 ? prev - 1 : trainingPlans.length - 1);
      if (e.key === 'ArrowRight') setCurrentFeature(prev => (prev + 1) % trainingPlans.length);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const currentPlan = trainingPlans[currentFeature];

  return (
    <div className={`running-design-app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header with Mode Toggle */}
      <header className="design-header" role="banner">
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-year">Pace</span>
            <span className="title-main">Perfect</span>
            <span className="title-subtitle">Training Plans & Pace Calculator</span>
          </h1>
          
          <button 
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            <span className="toggle-icon">
              {darkMode ? '☀️' : '🌙'}
            </span>
            <span className="toggle-text">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
        
        {/* Geometric Logo Recreation */}
        <div className="spiral-logo" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="spiral-svg">
            <defs>
              <linearGradient id="runningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={darkMode ? '#0D2B3E' : '#1E6B96'} />
                <stop offset="25%" stopColor={darkMode ? '#1A4D35' : '#2E8B57'} />
                <stop offset="50%" stopColor={darkMode ? '#B8471F' : '#FF6B35'} />
                <stop offset="75%" stopColor={darkMode ? '#B8671F' : '#F7931E'} />
                <stop offset="100%" stopColor={darkMode ? '#0D2B3E' : '#1E6B96'} />
              </linearGradient>
            </defs>
            <path
              d="M50 10 Q 80 20, 90 50 Q 80 80, 50 90 Q 20 80, 10 50 Q 20 20, 50 10"
              fill="none"
              stroke="url(#runningGradient)"
              strokeWidth="3"
              className="spiral-path"
            />
          </svg>
        </div>
      </header>

      {/* Hero Section - Featured Training Plan Carousel */}
      <section className="hero-section" role="main">
        <div className="poster-carousel">
          <div className="poster-container">
            <div 
              className="featured-poster"
              style={{
                background: `linear-gradient(135deg, ${currentPlan.colors.join(', ')})`
              }}
            >
              <div className="poster-content">
                <div className="poster-artwork">
                  {/* Abstract geometric representation */}
                  <div className="artwork-shapes">
                    {currentPlan.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`shape shape-${index}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="poster-text">
                  <h2 className="artist-name">{currentPlan.name}</h2>
                  <p className="artist-origin">{currentPlan.duration} • {currentPlan.focus}</p>
                  <p className="poster-title">Professional Training System</p>
                  <div className="pace-indicators">
                    <div className="pace-ring pace-easy"></div>
                    <div className="pace-ring pace-tempo"></div>
                    <div className="pace-ring pace-threshold"></div>
                    <div className="pace-ring pace-interval"></div>
                    <div className="pace-ring pace-repetition"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="carousel-controls" role="group" aria-label="Training plan navigation">
            <button 
              className="carousel-btn prev"
              onClick={() => setCurrentFeature(prev => prev > 0 ? prev - 1 : trainingPlans.length - 1)}
              aria-label="Previous training plan"
            >
              ‹
            </button>
            <button 
              className="carousel-btn next"
              onClick={() => setCurrentFeature(prev => (prev + 1) % trainingPlans.length)}
              aria-label="Next training plan"
            >
              ›
            </button>
          </div>

          {/* Plan Indicators */}
          <div className="carousel-indicators" role="tablist" aria-label="Training plan selection">
            {trainingPlans.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentFeature ? 'active' : ''}`}
                onClick={() => setCurrentFeature(index)}
                role="tab"
                aria-selected={index === currentFeature}
                aria-label={`View ${trainingPlans[index].name} plan`}
              />
            ))}
          </div>
        </div>

        {/* Featured Plan Info */}
        <div className="artist-info">
          <h3>Featured Plan: {currentPlan.name}</h3>
          <p className="artist-style">{currentPlan.focus}</p>
          <p className="artist-description">{currentPlan.description}</p>
          <button 
            className="learn-more-btn"
            onClick={() => setSelectedPlan(currentPlan)}
            aria-label={`Learn more about ${currentPlan.name}`}
          >
            Explore Training Plan
          </button>
        </div>
      </section>

      {/* Training Plans Grid */}
      <section className="artists-section" aria-labelledby="plans-heading">
        <h2 id="plans-heading">Training Plans</h2>
        <div className="artists-grid">
          {trainingPlans.map((plan, index) => (
            <article 
              key={plan.name}
              className="artist-card"
              tabIndex="0"
              onClick={() => setSelectedPlan(plan)}
              onKeyPress={(e) => e.key === 'Enter' && setSelectedPlan(plan)}
              role="button"
              aria-label={`View details for ${plan.name}`}
            >
              <div 
                className="artist-preview"
                style={{
                  background: `linear-gradient(45deg, ${plan.colors.slice(0, 3).join(', ')})`
                }}
              >
                <div className="preview-shapes">
                  {plan.colors.slice(0, 3).map((color, shapeIndex) => (
                    <div
                      key={shapeIndex}
                      className={`preview-shape preview-shape-${shapeIndex}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="artist-details">
                <h3 className="artist-card-name">{plan.name}</h3>
                <p className="artist-card-info">{plan.duration} • {plan.focus}</p>
                <p className="artist-card-style">Professional Training System</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="pictograms-section" aria-labelledby="features-heading">
        <h2 id="features-heading">Training Features</h2>
        <p className="section-description">
          Comprehensive tools for runners at every level - from beginner joggers to elite marathoners. 
          Built with precision and designed for performance.
        </p>
        <div className="pictograms-grid">
          {runningFeatures.map((item, index) => (
            <div key={item.feature} className="pictogram-item" tabIndex="0">
              <div className="pictogram-icon">
                <span className="feature-icon">{item.symbol}</span>
              </div>
              <span className="pictogram-label">{item.feature}</span>
              <p className="feature-description">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Training Zones Section */}
      <section className="palette-section" aria-labelledby="zones-heading">
        <h2 id="zones-heading">Training Zones</h2>
        <p className="section-description">
          Five scientifically-based training zones designed to optimize your running performance 
          and guide your workout intensity for maximum results.
        </p>
        <div className="color-palette">
          <div className="palette-row">
            <h3>Intensity Zones</h3>
            <div className="color-swatches">
              <div className="color-swatch" style={{ backgroundColor: '#1E6B96' }}>
                <span className="color-name">Easy</span>
                <span className="color-hex">65-78% HRmax</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: '#2E8B57' }}>
                <span className="color-name">Marathon</span>
                <span className="color-hex">79-84% HRmax</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: '#F7931E' }}>
                <span className="color-name">Threshold</span>
                <span className="color-hex">85-88% HRmax</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: '#FF6B35' }}>
                <span className="color-name">Interval</span>
                <span className="color-hex">89-94% HRmax</span>
              </div>
            </div>
          </div>
          
          <div className="palette-row">
            <h3>Power Zones</h3>
            <div className="color-swatches">
              <div className="color-swatch" style={{ backgroundColor: '#89CDF1' }}>
                <span className="color-name">Recovery</span>
                <span className="color-hex">{'< 60% FTP'}</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: '#1E6B96' }}>
                <span className="color-name">Aerobic</span>
                <span className="color-hex">60-75% FTP</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: '#2E8B57' }}>
                <span className="color-name">Tempo</span>
                <span className="color-hex">76-90% FTP</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: '#FF6B35' }}>
                <span className="color-name">VO2 Max</span>
                <span className="color-hex">91-105% FTP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section" aria-labelledby="philosophy-heading">
        <h2 id="philosophy-heading">Training Philosophy</h2>
        <div className="philosophy-content">
          <blockquote className="philosophy-quote">
            <p>
              "The key to running success is consistency, patience, and intelligent progression. 
              Every runner is unique, and every training plan should reflect that individuality."
            </p>
            <cite>— Our Coaching Philosophy</cite>
          </blockquote>
          
          <div className="philosophy-principles">
            <div className="principle">
              <h4>Science-Based</h4>
              <p>Training plans built on proven physiological principles and research</p>
            </div>
            <div className="principle">
              <h4>Personalized</h4>
              <p>Customized approach based on your current fitness and goals</p>
            </div>
            <div className="principle">
              <h4>Progressive</h4>
              <p>Gradual advancement that builds fitness while preventing injury</p>
            </div>
            <div className="principle">
              <h4>Sustainable</h4>
              <p>Long-term approach that fits your lifestyle and schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Plan Detail Modal */}
      {selectedPlan && (
        <div 
          className="artist-modal-overlay" 
          onClick={() => setSelectedPlan(null)}
          role="dialog" 
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="artist-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedPlan(null)}
              aria-label="Close plan details"
            >
              ×
            </button>
            
            <div className="modal-content">
              <div 
                className="modal-artwork"
                style={{
                  background: `linear-gradient(135deg, ${selectedPlan.colors.join(', ')})`
                }}
              >
                <div className="modal-shapes">
                  {selectedPlan.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`modal-shape modal-shape-${index}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="modal-info">
                <h2 id="modal-title">{selectedPlan.name}</h2>
                <p className="modal-origin">{selectedPlan.duration} • {selectedPlan.focus}</p>
                <p className="modal-style">Professional Training System</p>
                <p className="modal-description">{selectedPlan.description}</p>
                
                <div className="modal-colors">
                  <h4>Training Intensities:</h4>
                  <div className="modal-color-swatches">
                    {selectedPlan.colors.map((color, index) => (
                      <div 
                        key={index}
                        className="modal-color-swatch"
                        style={{ backgroundColor: color }}
                        title={`Intensity Zone ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="design-footer" role="contentinfo">
        <div className="footer-content">
          <p className="footer-text">
            Pace Perfect • Professional Running Training & Pace Calculation
          </p>
          <p className="footer-copyright">
            Training Plans • Pace Calculators • Performance Analytics • Built for Runners, by Runners
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RunningDesignApp;
