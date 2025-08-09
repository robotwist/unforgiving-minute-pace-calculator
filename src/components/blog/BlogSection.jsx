import React from 'react';
import * as blogStyles from '../../styles/blog.css';
import { ArticleCard } from './ArticleCard';

// Enhanced Blog Section with Vanilla Extract Styles
const BlogSection = ({ colors, onReadArticle }) => {
  // Sample featured articles - replace with your actual data source
  const featuredArticles = [
    {
      id: 1,
      title: "The Science Behind VDOT: Why Traditional Training Zones Fall Short",
      excerpt: "Discover why VDOT provides a more accurate training framework than traditional heart rate zones, and how it can revolutionize your running performance.",
      category: "TRAINING SCIENCE",
      readTime: "8 min read",
      author: "Dr. Sarah Mitchell",
      publishDate: "2025-08-09"
    },
    {
      id: 2,
      title: "Personalized Training Plans: Moving Beyond One-Size-Fits-All",
      excerpt: "Learn how personalized training plans based on your unique VDOT level can accelerate your progress and reduce injury risk.",
      category: "PERSONALIZATION", 
      readTime: "6 min read",
      author: "Coach Mike Roberts",
      publishDate: "2025-08-08"
    },
    {
      id: 3,
      title: "Marathon Success: How Sarah Broke 3:00 Using VDOT Training",
      excerpt: "Follow Sarah's journey from a 3:45 marathoner to breaking the 3-hour barrier using scientifically-based VDOT training methods.",
      category: "SUCCESS STORIES",
      readTime: "12 min read", 
      author: "Coach Mike Roberts",
      publishDate: "2025-08-07"
    }
  ];

  return (
    <section className={blogStyles.blogContainer}>
      {/* Section Header */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className={blogStyles.heading1}>
          Running Insights & Training Articles
        </h1>
        <p className={blogStyles.paragraph} style={{ fontSize: '1.25rem', color: colors?.darkGreen || '#059669' }}>
          Evidence-based training articles, race strategies, and VDOT insights from professional coaches
        </p>
      </header>

      {/* Featured Articles Grid */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 className={blogStyles.heading2} style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Featured Articles
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {featuredArticles.map((article, index) => (
            <div key={article.id} className={blogStyles.articleCard} style={{ '--card-index': index }}>
              {/* Category Badge */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.5rem 1rem',
                  backgroundColor: colors?.lightBlue || '#4A90E2',
                  color: 'white',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {article.category}
                </span>
              </div>
              
              {/* Article Title */}
              <h3 className={blogStyles.cardTitle} style={{ marginBottom: '1rem' }}>
                <a 
                  href="#" 
                  className={blogStyles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    onReadArticle && onReadArticle(article);
                  }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {article.title}
                </a>
              </h3>
              
              {/* Article Excerpt */}
              <p className={blogStyles.cardExcerpt} style={{ marginBottom: '1.5rem' }}>
                {article.excerpt}
              </p>
              
              {/* Article Meta */}
              <div className={blogStyles.cardMeta}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>By {article.author}</span>
                  <span style={{ color: '#ccc' }}>•</span>
                  <time>{article.publishDate}</time>
                </div>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup Section */}
      <div style={{
        background: `linear-gradient(135deg, ${colors?.lightBlue || '#4A90E2'}15, ${colors?.lightGreen || '#7ED321'}15)`,
        padding: '3rem 2rem',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #e1e8ed'
      }}>
        <h3 className={blogStyles.heading3} style={{ marginBottom: '1rem' }}>
          Get Weekly Training Insights
        </h3>
        <p className={blogStyles.paragraph} style={{ 
          fontSize: '1.125rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          Join 5,000+ runners receiving evidence-based training tips, race strategies, and VDOT insights delivered to your inbox.
        </p>
        
        <div style={{ 
          maxWidth: '400px', 
          margin: '0 auto',
          display: 'flex',
          gap: '0.75rem',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row'
        }}>
          <input
            type="email"
            placeholder="Enter your email address"
            style={{
              flex: 1,
              padding: '0.875rem 1rem',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = colors?.lightBlue || '#4A90E2'}
            onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
          />
          <button
            style={{
              padding: '0.875rem 2rem',
              backgroundColor: colors?.lightBlue || '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = colors?.accentHover || '#357ABD';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = colors?.lightBlue || '#4A90E2';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
