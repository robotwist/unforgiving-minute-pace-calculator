import React from 'react';
import * as blogStyles from '../../styles/blog.css';

const BlogPost = ({
  title,
  content,
  author,
  publishDate,
  readingTime,
  excerpt
}) => {
  // Parse content and apply appropriate styles
  const parseContent = (htmlContent) => {
    // This is a simplified parser - in production, you'd use a proper HTML parser or markdown renderer
    return { __html: htmlContent };
  };

  return (
    <article className={blogStyles.blogContainer}>
      {/* Article Header */}
      <header>
        <h1 className={blogStyles.heading1}>{title}</h1>
        
        <div className={blogStyles.articleMeta}>
          <div className={blogStyles.authorInfo}>
            {author.avatar && (
              <img 
                src={author.avatar} 
                alt={author.name}
                className={blogStyles.authorAvatar}
              />
            )}
            <span>{author.name}</span>
          </div>
          <time className={blogStyles.publishDate}>{publishDate}</time>
          <span className={blogStyles.readingTime}>{readingTime}</span>
        </div>
      </header>

      {/* Article Content */}
      <div 
        className={blogStyles.articleContent}
        dangerouslySetInnerHTML={parseContent(content)}
      />
    </article>
  );
};

// Blog Card Component for article listings
const BlogCard = ({ article, index, onClick }) => {
  return (
    <article 
      className={blogStyles.articleCard}
      style={{ '--card-index': index }}
      onClick={() => onClick(article.slug)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(article.slug);
        }
      }}
    >
      <h2 className={blogStyles.cardTitle}>{article.title}</h2>
      <p className={blogStyles.cardExcerpt}>{article.excerpt}</p>
      <div className={blogStyles.cardMeta}>
        <span>By {article.author}</span>
        <span>{article.readingTime}</span>
      </div>
    </article>
  );
};

// Blog Section Component
const BlogSection = ({ articles, onArticleClick }) => {
  return (
    <section className={blogStyles.blogContainer}>
      <header>
        <h1 className={blogStyles.heading1}>Running Insights & Training Articles</h1>
        <p className={blogStyles.paragraph}>
          Evidence-based training articles, race strategies, and insights from professional coaches.
        </p>
      </header>

      <div>
        {articles.map((article, index) => (
          <BlogCard
            key={article.id}
            article={article}
            index={index}
            onClick={onArticleClick}
          />
        ))}
      </div>
    </section>
  );
};

export { BlogPost, BlogCard, BlogSection };
