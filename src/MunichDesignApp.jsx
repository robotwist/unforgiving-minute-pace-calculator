import React, { useState, useEffect } from 'react';
import './RunningDesignApp.css';

const RunningDesignApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentPoster, setCurrentPoster] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Artist/Designer data for Munich 1972 Olympic posters
  const artists = [
    {
      name: "Otl Aicher",
      style: "Geometric Minimalism", 
      description: "Chief designer of Munich 1972 Olympics visual identity, known for clean geometric forms and bold color palettes"
    },
    {
      name: "Munich Design Team",
      style: "Modernist Approach",
      description: "Collaborative team that created the iconic pictogram system and visual language of the 1972 Olympics"
    },
    {
      name: "Contemporary Interpreters", 
      style: "Neo-Munich Style",
      description: "Modern designers inspired by the 1972 aesthetic, bringing Munich design principles to contemporary applications"
    }
  ];

  // Current artist for display
  const currentArtist = artists[currentPoster] || artists[0];

  // Olympic colors from Munich 1972 palette
  const olympicColors = {
    lightBlue: '#1E6B96',
    orange: '#FF6B35', 
    green: '#2E8B57',
    yellow: '#F7931E',
    black: '#000000',
    white: '#F5F5F5',
    silver: '#89CDF1'
  };

  // Munich 1972 pictograms data
  const pictograms = [
    { name: 'Running', icon: '🏃‍♂️', color: olympicColors.lightBlue },
    { name: 'Swimming', icon: '🏊‍♂️', color: olympicColors.orange },
    { name: 'Cycling', icon: '🚴‍♂️', color: olympicColors.green },
    { name: 'Gymnastics', icon: '🤸‍♂️', color: olympicColors.yellow },
    { name: 'Basketball', icon: '⛹️‍♂️', color: olympicColors.lightBlue },
    { name: 'Football', icon: '⚽', color: olympicColors.orange }
  ];

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
          <div className="carousel-controls" role="group" aria-label="Poster navigation">
            <button 
              className="carousel-btn prev"
              onClick={() => setCurrentPoster(prev => prev > 0 ? prev - 1 : artists.length - 1)}
              aria-label="Previous poster"
            >
              ‹
            </button>
            <button 
              className="carousel-btn next"
              onClick={() => setCurrentPoster(prev => (prev + 1) % artists.length)}
              aria-label="Next poster"
            >
              ›
            </button>
          </div>

          {/* Poster Indicators */}
          <div className="carousel-indicators" role="tablist" aria-label="Poster selection">
            {artists.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentPoster ? 'active' : ''}`}
                onClick={() => setCurrentPoster(index)}
                role="tab"
                aria-selected={index === currentPoster}
                aria-label={`View ${artists[index].name} poster`}
              />
            ))}
          </div>
        </div>

        {/* Featured Artist Info */}
        <div className="artist-info">
          <h3>Featured Artist: {currentArtist.name}</h3>
          <p className="artist-style">{currentArtist.style}</p>
          <p className="artist-description">{currentArtist.description}</p>
          <button 
            className="learn-more-btn"
            onClick={() => setSelectedArtist(currentArtist)}
            aria-label={`Learn more about ${currentArtist.name}`}
          >
            Explore Artist Details
          </button>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="artists-section" aria-labelledby="artists-heading">
        <h2 id="artists-heading">Edition Olympia Artists</h2>
        <div className="artists-grid">
          {artists.map((artist, index) => (
            <article 
              key={artist.name}
              className="artist-card"
              tabIndex="0"
              onClick={() => setSelectedArtist(artist)}
              onKeyPress={(e) => e.key === 'Enter' && setSelectedArtist(artist)}
              role="button"
              aria-label={`View details for ${artist.name}`}
            >
              <div 
                className="artist-preview"
                style={{
                  background: `linear-gradient(45deg, ${artist.colors.slice(0, 3).join(', ')})`
                }}
              >
                <div className="preview-shapes">
                  {artist.colors.slice(0, 3).map((color, shapeIndex) => (
                    <div
                      key={shapeIndex}
                      className={`preview-shape preview-shape-${shapeIndex}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="artist-details">
                <h3 className="artist-card-name">{artist.name}</h3>
                <p className="artist-card-info">{artist.nationality} • {artist.year}</p>
                <p className="artist-card-style">{artist.style}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pictogram Section */}
      <section className="pictograms-section" aria-labelledby="pictograms-heading">
        <h2 id="pictograms-heading">Olympic Pictograms</h2>
        <p className="section-description">
          Otl Aicher's revolutionary pictographic system - the first comprehensive Olympic pictogram set, 
          created using simple geometric grids for universal understanding.
        </p>
        <div className="pictograms-grid">
          {pictograms.map((item, index) => (
            <div key={item.sport} className="pictogram-item" tabIndex="0">
              <div className="pictogram-icon">
                <svg viewBox="0 0 24 24" className="pictogram-svg">
                  <path 
                    d={item.grid}
                    fill={darkMode ? olympicColors.offWhite : olympicColors.charcoal}
                    className="pictogram-path"
                  />
                </svg>
              </div>
              <span className="pictogram-label">{item.sport}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="palette-section" aria-labelledby="palette-heading">
        <h2 id="palette-heading">Munich 1972 Color Palette</h2>
        <p className="section-description">
          The "rainbow palette" celebrating diversity, combined with Bavarian silver and blue - 
          a deliberate contrast to the dark nationalism of 1936 Berlin Olympics.
        </p>
        <div className="color-palette">
          <div className="palette-row">
            <h3>Light Mode Palette</h3>
            <div className="color-swatches">
              <div className="color-swatch" style={{ backgroundColor: olympicColors.lightBlue }}>
                <span className="color-name">Light Blue</span>
                <span className="color-hex">{olympicColors.lightBlue}</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: olympicColors.darkGreen }}>
                <span className="color-name">Dark Green</span>
                <span className="color-hex">{olympicColors.darkGreen}</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: olympicColors.orange }}>
                <span className="color-name">Orange</span>
                <span className="color-hex">{olympicColors.orange}</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: olympicColors.yellow }}>
                <span className="color-name">Yellow</span>
                <span className="color-hex">{olympicColors.yellow}</span>
              </div>
            </div>
          </div>
          
          <div className="palette-row">
            <h3>Dark Mode Palette</h3>
            <div className="color-swatches">
              <div className="color-swatch" style={{ backgroundColor: olympicColors.darkBlue }}>
                <span className="color-name">Dark Blue</span>
                <span className="color-hex">{olympicColors.darkBlue}</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: olympicColors.darkForest }}>
                <span className="color-name">Dark Forest</span>
                <span className="color-hex">{olympicColors.darkForest}</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: olympicColors.darkOrange }}>
                <span className="color-name">Dark Orange</span>
                <span className="color-hex">{olympicColors.darkOrange}</span>
              </div>
              <div className="color-swatch" style={{ backgroundColor: olympicColors.darkYellow }}>
                <span className="color-name">Dark Yellow</span>
                <span className="color-hex">{olympicColors.darkYellow}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy Section */}
      <section className="philosophy-section" aria-labelledby="philosophy-heading">
        <h2 id="philosophy-heading">Design Philosophy</h2>
        <div className="philosophy-content">
          <blockquote className="philosophy-quote">
            <p>
              "They were to be cheerful, modern and democratic, without pathos and gigantism, 
              in complete contrast to the 1936 Olympics of the National Socialists in Berlin."
            </p>
            <cite>— Otl Aicher, Lead Designer</cite>
          </blockquote>
          
          <div className="philosophy-principles">
            <div className="principle">
              <h4>Modernism</h4>
              <p>Clean geometric forms and systematic design grids</p>
            </div>
            <div className="principle">
              <h4>Democracy</h4>
              <p>Universal pictographic language accessible to all</p>
            </div>
            <div className="principle">
              <h4>Joy</h4>
              <p>Bright "rainbow palette" celebrating diversity and unity</p>
            </div>
            <div className="principle">
              <h4>Innovation</h4>
              <p>First comprehensive Olympic visual identity system</p>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Detail Modal */}
      {selectedArtist && (
        <div 
          className="artist-modal-overlay" 
          onClick={() => setSelectedArtist(null)}
          role="dialog" 
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="artist-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedArtist(null)}
              aria-label="Close artist details"
            >
              ×
            </button>
            
            <div className="modal-content">
              <div 
                className="modal-artwork"
                style={{
                  background: `linear-gradient(135deg, ${selectedArtist.colors.join(', ')})`
                }}
              >
                <div className="modal-shapes">
                  {selectedArtist.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`modal-shape modal-shape-${index}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="modal-info">
                <h2 id="modal-title">{selectedArtist.name}</h2>
                <p className="modal-origin">{selectedArtist.nationality} • {selectedArtist.year}</p>
                <p className="modal-style">{selectedArtist.style}</p>
                <p className="modal-description">{selectedArtist.description}</p>
                
                <div className="modal-colors">
                  <h4>Artist's Color Palette:</h4>
                  <div className="modal-color-swatches">
                    {selectedArtist.colors.map((color, index) => (
                      <div 
                        key={index}
                        className="modal-color-swatch"
                        style={{ backgroundColor: color }}
                        title={color}
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
            München 1972 Design Showcase • Celebrating Otl Aicher's Revolutionary Olympic Design System
          </p>
          <p className="footer-copyright">
            Design System: Otl Aicher & Team • Edition Olympia: 1969-1972 • Implementation: 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RunningDesignApp;
