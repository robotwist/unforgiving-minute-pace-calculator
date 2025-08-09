import React from 'react';
import * as blogStyles from '../../styles/blog.css';

// Example blog post data
const sampleArticle = {
  title: "The Science Behind VDOT: Why Traditional Training Zones Fall Short",
  author: {
    name: "Dr. Sarah Mitchell",
    avatar: "/api/placeholder/32/32"
  },
  publishDate: "August 9, 2025",
  readingTime: "8 min read",
  content: `
    <p>For decades, runners have relied on heart rate zones and perceived exertion to guide their training. While these methods have merit, they often fall short of providing the precision needed for optimal performance gains.</p>
    
    <h2>Understanding VDOT: A Scientific Approach</h2>
    
    <p>VDOT, developed by renowned exercise physiologist Jack Daniels, represents a revolutionary approach to training that accounts for running economy—something traditional methods miss entirely.</p>
    
    <blockquote>
      "VDOT gives us a window into a runner's true aerobic capacity when running economy is factored in. It's not just about how much oxygen you can consume, but how efficiently you can use it while running."
    </blockquote>
    
    <p>Unlike VO2 max, which measures maximum oxygen uptake in laboratory conditions, VDOT reflects your actual running performance. This distinction is crucial because two runners with identical VO2 max values can have vastly different racing capabilities due to variations in running economy.</p>
    
    <h3>The Running Economy Factor</h3>
    
    <p>Running economy refers to how efficiently you use oxygen at a given pace. Think of it as your body's "miles per gallon" rating. A runner with superior running economy will:</p>
    
    <ul>
      <li>Require less oxygen at any given pace</li>
      <li>Maintain faster speeds with the same effort</li>
      <li>Preserve energy for stronger finishes</li>
      <li>Experience less fatigue during training</li>
    </ul>
    
    <h2>Practical Applications in Training</h2>
    
    <p>When you base your training on VDOT, you're working with paces that reflect your current fitness reality, not laboratory assumptions. This leads to:</p>
    
    <ol>
      <li><strong>More accurate training zones:</strong> Your easy runs stay truly easy, preventing overtraining</li>
      <li><strong>Optimal interval pacing:</strong> Hard efforts target the right intensity for adaptation</li>
      <li><strong>Realistic race goals:</strong> Predictions based on current performance, not theoretical maximums</li>
    </ol>
    
    <pre><code>// Example VDOT calculation
    const calculateVDOT = (distance, time) => {
      // Simplified version - actual calculation is more complex
      const velocity = distance / time;
      const vo2 = -4.6 + 0.182258 * velocity + 0.000104 * velocity * velocity;
      return Math.round(vo2 * 10) / 10;
    };
    </code></pre>
    
    <h3>Real-World Results</h3>
    
    <p>In a recent study of 1,200 competitive runners, those who trained using VDOT-based paces showed:</p>
    
    <ul>
      <li>23% greater improvement in race times over 12 weeks</li>
      <li>40% reduction in overuse injuries</li>
      <li>Higher training satisfaction and motivation</li>
    </ul>
    
    <figure>
      <img src="/api/placeholder/600/300" alt="VDOT vs Traditional Training Results" />
      <figcaption>Comparison of improvement rates between VDOT-based and traditional heart rate zone training</figcaption>
    </figure>
    
    <h2>Getting Started with VDOT Training</h2>
    
    <p>To begin incorporating VDOT into your training:</p>
    
    <ol>
      <li>Perform a recent time trial or race at 5K-10K distance</li>
      <li>Calculate your current VDOT using our calculator above</li>
      <li>Use the corresponding training paces for all workouts</li>
      <li>Retest every 4-6 weeks to track progress</li>
    </ol>
    
    <blockquote>
      Remember: VDOT is dynamic. As your fitness improves, your VDOT increases, and your training paces should adjust accordingly. This ensures you're always training at the optimal intensity for continued adaptation.
    </blockquote>
    
    <p>The transition from traditional training methods to VDOT-based training represents a shift from guesswork to precision. By accounting for the complex relationship between aerobic capacity and running economy, VDOT provides a more complete picture of your running fitness and, consequently, more effective training prescriptions.</p>
  `
};

// Full Blog Post Component with all styling applied
const FullBlogPost = () => {
  return (
    <article className={blogStyles.blogContainer}>
      {/* Article Header */}
      <header>
        <h1 className={blogStyles.heading1}>{sampleArticle.title}</h1>
        
        <div className={blogStyles.articleMeta}>
          <div className={blogStyles.authorInfo}>
            <img 
              src={sampleArticle.author.avatar} 
              alt={sampleArticle.author.name}
              className={blogStyles.authorAvatar}
            />
            <span>{sampleArticle.author.name}</span>
          </div>
          <time className={blogStyles.publishDate}>{sampleArticle.publishDate}</time>
          <span className={blogStyles.readingTime}>{sampleArticle.readingTime}</span>
        </div>
      </header>

      {/* Article Content with proper styling */}
      <div 
        className={blogStyles.articleContent}
        dangerouslySetInnerHTML={{ __html: sampleArticle.content }}
        style={{
          // Apply styles to dynamic content
        }}
      />
    </article>
  );
};

// Component to demonstrate all typography styles
const TypographyShowcase = () => {
  return (
    <div className={blogStyles.blogContainer}>
      <h1 className={blogStyles.heading1}>Heading 1 - Main Article Title</h1>
      <h2 className={blogStyles.heading2}>Heading 2 - Major Section</h2>
      <h3 className={blogStyles.heading3}>Heading 3 - Subsection</h3>
      <h4 className={blogStyles.heading4}>Heading 4 - Minor Section</h4>
      
      <p className={blogStyles.paragraph}>
        This is a paragraph with <a href="#" className={blogStyles.link}>a beautiful link</a> that demonstrates 
        the Medium-like typography. The line height and spacing create an elegant, readable experience.
      </p>
      
      <p className={blogStyles.paragraph}>
        Here's some <code className={blogStyles.inlineCode}>inline code</code> within a paragraph.
      </p>
      
      <pre className={blogStyles.codeBlock}>{`
// Code block example
const runningPace = (vdot, type) => {
  const paces = {
    easy: vdot * 1.2,
    tempo: vdot * 0.88,
    interval: vdot * 0.76
  };
  return paces[type];
};
      `}</pre>
      
      <blockquote className={blogStyles.blockquote}>
        This is a blockquote that stands out with subtle styling and accent color border. 
        It's perfect for highlighting important insights or quotes.
      </blockquote>
      
      <ul className={blogStyles.unorderedList}>
        <li className={blogStyles.listItem}>First item in unordered list</li>
        <li className={blogStyles.listItem}>Second item with proper spacing</li>
        <li className={blogStyles.listItem}>Third item demonstrates consistency</li>
      </ul>
      
      <ol className={blogStyles.orderedList}>
        <li className={blogStyles.listItem}>First step in ordered list</li>
        <li className={blogStyles.listItem}>Second step maintains rhythm</li>
        <li className={blogStyles.listItem}>Third step completes the sequence</li>
      </ol>
      
      <figure className={blogStyles.figure}>
        <img 
          src="/api/placeholder/600/300" 
          alt="Sample image with responsive styling"
          className={blogStyles.image}
        />
        <figcaption className={blogStyles.caption}>
          This caption demonstrates proper image attribution and styling
        </figcaption>
      </figure>
    </div>
  );
};

export { FullBlogPost, TypographyShowcase };
export default FullBlogPost;
