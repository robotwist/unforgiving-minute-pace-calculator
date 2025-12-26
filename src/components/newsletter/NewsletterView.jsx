// 1980s Newsletter View Component
// Clean, typeface-focused, chart-organized layout
import React from 'react';

const NewsletterView = ({ 
  goldenPace, 
  trainingPaces, 
  raceTime, 
  raceDistance, 
  trainingPlans = [],
  articles = [],
  colors 
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });

  const formatPace = (pace) => pace || '--:--';

  return (
    <div className="newsletter-view max-w-4xl um-mx-auto um-p-8">
      {/* Masthead */}
      <header className="newsletter-masthead">
        <h1>UNFORGIVING MINUTE</h1>
        <p className="tagline">Distance Running • Training • Performance</p>
        <p className="edition">VOL. I • {currentDate.toUpperCase()}</p>
      </header>

      {/* Table of Contents */}
      <nav className="newsletter-toc">
        <h2 className="newsletter-toc-title">In This Issue</h2>
        <ul className="newsletter-toc-list">
          <li className="newsletter-toc-item">
            <span>Your Training Paces</span>
            <span className="newsletter-toc-page">1</span>
          </li>
          <li className="newsletter-toc-item">
            <span>Pace Reference Charts</span>
            <span className="newsletter-toc-page">2</span>
          </li>
          <li className="newsletter-toc-item">
            <span>Training Plans</span>
            <span className="newsletter-toc-page">3</span>
          </li>
          <li className="newsletter-toc-item">
            <span>Featured Articles</span>
            <span className="newsletter-toc-page">4</span>
          </li>
        </ul>
      </nav>

      <hr className="newsletter-divider-double" />

      {/* Main Content Grid */}
      <div className="newsletter-grid">
        {/* Main Column */}
        <main>
          {/* Optimal Progress Pace Section */}
          <section className="newsletter-section">
            <h2 className="newsletter-section-title">Your Optimal Progress Pace</h2>
            
            {goldenPace ? (
              <>
                <div className="newsletter-pace-display">
                  {goldenPace}
                  <div className="newsletter-pace-label">per mile</div>
                </div>
                
                {raceTime && raceDistance && (
                  <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '1rem' }}>
                    Based on your {raceDistance} time of {raceTime}
                  </p>
                )}
              </>
            ) : (
              <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Enter a race time to calculate your optimal training pace
              </p>
            )}
          </section>

          {/* Training Paces Chart */}
          {trainingPaces && (
            <section className="newsletter-section">
              <h2 className="newsletter-section-title">Training Pace Reference Chart</h2>
              
              <table className="newsletter-table">
                <thead>
                  <tr>
                    <th>Zone</th>
                    <th>Pace/Mile</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Easy</strong></td>
                    <td className="pace-highlight">{formatPace(trainingPaces.easy)}</td>
                    <td>Recovery, base building, long runs</td>
                  </tr>
                  <tr>
                    <td><strong>Threshold</strong></td>
                    <td className="pace-highlight">{formatPace(trainingPaces.threshold)}</td>
                    <td>Lactate threshold, tempo runs</td>
                  </tr>
                  <tr>
                    <td><strong>Interval</strong></td>
                    <td className="pace-highlight">{formatPace(trainingPaces.interval)}</td>
                    <td>VO2max, speed development</td>
                  </tr>
                  <tr>
                    <td><strong>Repetition</strong></td>
                    <td className="pace-highlight">{formatPace(trainingPaces.repetition)}</td>
                    <td>Speed, form, neuromuscular</td>
                  </tr>
                </tbody>
              </table>

              <div className="newsletter-facts">
                <h3 className="newsletter-facts-title">Training Tips</h3>
                <ul>
                  <li>• Easy runs should feel conversational</li>
                  <li>• Threshold pace: "comfortably hard"</li>
                  <li>• Intervals: 3-5 minute repeats</li>
                  <li>• Repetitions: 200-400m with full recovery</li>
                </ul>
              </div>
            </section>
          )}

          {/* Training Plans */}
          {trainingPlans.length > 0 && (
            <section className="newsletter-section">
              <h2 className="newsletter-section-title">Available Training Plans</h2>
              
              <table className="newsletter-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Distance</th>
                    <th>Duration</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingPlans.slice(0, 6).map((plan, index) => (
                    <tr key={index}>
                      <td><strong>{plan.name}</strong></td>
                      <td>{plan.distance}</td>
                      <td>{plan.duration}</td>
                      <td>{plan.level || 'All'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="newsletter-sidebar">
          {/* Quick Reference */}
          <div className="newsletter-section">
            <h3 className="newsletter-section-title">Quick Reference</h3>
            
            <div className="newsletter-sidebar-item">
              <strong>Race Equivalents</strong>
              <table className="newsletter-table" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                <tbody>
                  <tr><td>5K</td><td>3.1 mi</td></tr>
                  <tr><td>10K</td><td>6.2 mi</td></tr>
                  <tr><td>Half</td><td>13.1 mi</td></tr>
                  <tr><td>Marathon</td><td>26.2 mi</td></tr>
                </tbody>
              </table>
            </div>

            <div className="newsletter-sidebar-item">
              <strong>Effort Scale</strong>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                1-3: Easy/Recovery<br/>
                4-5: Moderate<br/>
                6-7: Threshold<br/>
                8-9: Interval<br/>
                10: Race effort
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="newsletter-section">
            <h3 className="newsletter-section-title">Coaching</h3>
            <p style={{ fontSize: '0.875rem' }}>
              For personalized training plans and 1-on-1 coaching, visit:<br/>
              <strong>unforgivingminute.com/apply</strong>
            </p>
          </div>
        </aside>
      </div>

      {/* Articles Section */}
      {articles.length > 0 && (
        <>
          <hr className="newsletter-divider-double" />
          
          <section className="newsletter-section">
            <h2 className="newsletter-section-title">Featured Articles</h2>
            
            {articles.slice(0, 4).map((article, index) => (
              <article key={index} className="newsletter-article">
                <h3 className="newsletter-article-title">{article.title}</h3>
                <p className="newsletter-article-meta">
                  {article.category} • {article.readTime || '5 min read'}
                </p>
                <p className="newsletter-article-excerpt">
                  {article.excerpt || article.description}
                </p>
              </article>
            ))}
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="newsletter-footer">
        <hr className="newsletter-divider-double" />
        <p>
          <strong>UNFORGIVING MINUTE</strong> • Distance Running Newsletter<br/>
          © {new Date().getFullYear()} • All Rights Reserved
        </p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
          "If you can fill the unforgiving minute with sixty seconds' worth of distance run..."
        </p>
      </footer>
    </div>
  );
};

export default NewsletterView;
