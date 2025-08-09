import React from 'react';
import { FullBlogPost } from './FullBlogPost';
import { ShareButton, InlineShareButtons, FloatingShareButton } from './ShareButton';
import * as blogStyles from '../../styles/blog.css';

// Demo data
const demoArticles = [
  {
    title: "5K to Marathon: Your Complete Training Progression Guide",
    excerpt: "Learn how to safely progress from 5K races to marathon distance with our evidence-based training plan progression.",
    author: { name: "Coach Elena Rodriguez", avatar: "/api/placeholder/32/32" },
    publishDate: "August 8, 2025",
    readingTime: "12 min read",
    url: "https://unforgivingminute.netlify.app/articles/5k-to-marathon"
  },
  {
    title: "The Science Behind VDOT Training Zones",
    excerpt: "Discover why VDOT provides more accurate training intensities than traditional heart rate zones.",
    author: { name: "Dr. Michael Chen", avatar: "/api/placeholder/32/32" },
    publishDate: "August 7, 2025",
    readingTime: "8 min read",
    url: "https://unforgivingminute.netlify.app/articles/vdot-science"
  },
  {
    title: "Injury Prevention: The Runner's Guide to Staying Healthy",
    excerpt: "Essential strategies and exercises to prevent common running injuries and maintain consistent training.",
    author: { name: "Dr. Sarah Mitchell", avatar: "/api/placeholder/32/32" },
    publishDate: "August 6, 2025",
    readingTime: "15 min read",
    url: "https://unforgivingminute.netlify.app/articles/injury-prevention"
  }
];

const BlogSharingDemo = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className={blogStyles.blogContainer}>
        <h1 className={blogStyles.heading1}>Blog Sharing System Demo</h1>
        <p className={blogStyles.paragraph}>
          This demo showcases all the sharing components integrated into the blog system.
          Click any share button to see the sharing modal in action.
        </p>
      </div>

      {/* Demo Section 1: Basic Share Buttons */}
      <div className={blogStyles.blogContainer} style={{ marginTop: '3rem' }}>
        <h2 className={blogStyles.heading2}>Share Button Variants</h2>
        <p className={blogStyles.paragraph}>
          Different styles of share buttons for various use cases:
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <ShareButton 
            article={demoArticles[0]}
            variant="primary"
          />
          <ShareButton 
            article={demoArticles[0]}
            variant="secondary"
          />
        </div>
      </div>

      {/* Demo Section 2: Blog Cards with Share */}
      <div className={blogStyles.blogContainer} style={{ marginTop: '3rem' }}>
        <h2 className={blogStyles.heading2}>Blog Cards with Sharing</h2>
        <p className={blogStyles.paragraph}>
          Article cards that include share buttons without interfering with card navigation:
        </p>
        
        <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
          {demoArticles.map((article, index) => (
            <DemoBlogCard key={index} article={article} index={index} />
          ))}
        </div>
      </div>

      {/* Demo Section 3: Inline Share Buttons */}
      <div className={blogStyles.blogContainer} style={{ marginTop: '3rem' }}>
        <h2 className={blogStyles.heading2}>Inline Share Buttons</h2>
        <p className={blogStyles.paragraph}>
          Compact sharing options that appear at the end of articles:
        </p>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
          <p className={blogStyles.paragraph}>
            This is sample article content. The inline share buttons below would typically 
            appear at the end of a full article.
          </p>
          
          <InlineShareButtons 
            article={demoArticles[1]}
            url="https://unforgivingminute.netlify.app/demo"
          />
        </div>
      </div>

      {/* Demo Section 4: Full Blog Post with Floating Button */}
      <div style={{ marginTop: '4rem', position: 'relative' }}>
        <div className={blogStyles.blogContainer}>
          <h2 className={blogStyles.heading2}>Complete Article Example</h2>
          <p className={blogStyles.paragraph}>
            This shows a complete blog post with floating share button (visible on desktop) 
            and inline sharing at the end. Scroll to see the floating button on the right.
          </p>
        </div>
        
        {/* Floating share button for this section */}
        <FloatingShareButton 
          article={demoArticles[2]}
          url="https://unforgivingminute.netlify.app/demo-article"
        />
        
        <FullBlogPost />
      </div>

      {/* Demo Section 5: Usage Tips */}
      <div className={blogStyles.blogContainer} style={{ marginTop: '4rem' }}>
        <h2 className={blogStyles.heading2}>How to Use</h2>
        
        <ol className={blogStyles.orderedList}>
          <li className={blogStyles.listItem}>
            <strong>Article Pages:</strong> Use FloatingShareButton + InlineShareButtons for maximum sharing opportunities
          </li>
          <li className={blogStyles.listItem}>
            <strong>Article Cards:</strong> Add secondary ShareButton to card footer without disrupting navigation
          </li>
          <li className={blogStyles.listItem}>
            <strong>Blog Listings:</strong> Use primary ShareButton for featured articles or call-to-action scenarios
          </li>
          <li className={blogStyles.listItem}>
            <strong>Mobile:</strong> System automatically uses native sharing when available
          </li>
        </ol>

        <blockquote className={blogStyles.blockquote}>
          <strong>Pro Tip:</strong> Always include both article title and excerpt in the article data 
          for optimal social media previews and sharing experience.
        </blockquote>
      </div>
    </div>
  );
};

// Demo Blog Card Component
const DemoBlogCard = ({ article, index }) => {
  const handleCardClick = (slug) => {
    console.log('Navigate to article:', slug);
    alert(`Would navigate to: ${slug}`);
  };

  return (
    <article 
      className={blogStyles.articleCard}
      style={{ '--card-index': index, cursor: 'pointer' }}
      onClick={(e) => {
        // Prevent navigation when share button is clicked
        if (!e.target.closest('button')) {
          handleCardClick(article.url);
        }
      }}
    >
      <h3 className={blogStyles.cardTitle}>{article.title}</h3>
      <p className={blogStyles.cardExcerpt}>{article.excerpt}</p>
      <div className={blogStyles.cardMeta} style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <div>By {article.author.name}</div>
          <div>{article.readingTime} • {article.publishDate}</div>
        </div>
        <ShareButton 
          article={article}
          variant="secondary"
          url={article.url}
        />
      </div>
    </article>
  );
};

export default BlogSharingDemo;
