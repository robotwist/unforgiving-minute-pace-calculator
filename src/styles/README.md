# Blog Styling System - Vanilla Extract CSS

This documentation explains how to use the elegant, Medium-like blog styling system built with Vanilla Extract CSS.

## Overview

The blog styling system provides a clean, readable, professional appearance with:
- ✨ **Typography**: Elegant Inter font with perfect line heights and spacing
- 🎨 **Colors**: Sophisticated color palette with Munich 1972 accents
- 📱 **Responsive**: Mobile-optimized with fluid typography scaling
- ⚡ **Animations**: Subtle, polished animations for smooth interactions
- ♿ **Accessibility**: Full keyboard navigation and focus management

## Quick Start

### 1. Import the styles

```jsx
import * as blogStyles from '../../styles/blog.css';
```

### 2. Apply to your components

```jsx
// Blog container
<article className={blogStyles.blogContainer}>
  <h1 className={blogStyles.heading1}>Your Article Title</h1>
  <p className={blogStyles.paragraph}>Your content...</p>
</article>
```

## Available Style Classes

### Layout & Container

- **`blogContainer`**: Main blog wrapper (700px max-width, centered)
- **`articleContent`**: Content wrapper for blog posts

### Typography

- **`heading1`**: Main titles (34px, bold)
- **`heading2`**: Section headers (28px, bold) 
- **`heading3`**: Subsections (24px, semibold)
- **`heading4`**: Minor sections (20px, semibold)
- **`paragraph`**: Body text (18px, line-height 1.7)
- **`link`**: Styled links with hover effects

### Content Elements

- **`image`**: Responsive images with subtle shadows
- **`figure`**: Image container with proper spacing
- **`caption`**: Image captions (italic, muted)
- **`inlineCode`**: Inline code snippets
- **`codeBlock`**: Multi-line code blocks
- **`blockquote`**: Highlighted quotes with accent border

### Lists

- **`orderedList`**: Numbered lists
- **`unorderedList`**: Bullet point lists  
- **`listItem`**: Individual list items

### Article Components

- **`articleCard`**: Blog post preview cards
- **`cardTitle`**: Card headlines
- **`cardExcerpt`**: Card descriptions
- **`cardMeta`**: Author/date information
- **`articleMeta`**: Full post metadata
- **`authorInfo`**: Author details
- **`authorAvatar`**: Author profile images

### Tables

- **`table`**: Responsive table styling
- **`tableHeader`**: Table header rows
- **`tableCell`**: Table data cells

## Usage Examples

### Basic Blog Post

```jsx
import React from 'react';
import * as blogStyles from '../../styles/blog.css';

const BlogPost = ({ title, content, author, date, readTime }) => (
  <article className={blogStyles.blogContainer}>
    <header>
      <h1 className={blogStyles.heading1}>{title}</h1>
      
      <div className={blogStyles.articleMeta}>
        <div className={blogStyles.authorInfo}>
          <img 
            src={author.avatar} 
            alt={author.name}
            className={blogStyles.authorAvatar}
          />
          <span>{author.name}</span>
        </div>
        <time className={blogStyles.publishDate}>{date}</time>
        <span className={blogStyles.readingTime}>{readTime}</span>
      </div>
    </header>

    <div 
      className={blogStyles.articleContent}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </article>
);
```

### Article Cards for Listings

```jsx
const ArticleCard = ({ article, index, onClick }) => (
  <article 
    className={blogStyles.articleCard}
    style={{ '--card-index': index }}
    onClick={() => onClick(article.slug)}
  >
    <h2 className={blogStyles.cardTitle}>{article.title}</h2>
    <p className={blogStyles.cardExcerpt}>{article.excerpt}</p>
    <div className={blogStyles.cardMeta}>
      <span>By {article.author}</span>
      <span>{article.readingTime}</span>
    </div>
  </article>
);
```

### Rich Content Styling

```jsx
// For dynamically generated content
const RichContent = ({ htmlContent }) => (
  <div className={blogStyles.articleContent}>
    <h2 className={blogStyles.heading2}>Section Title</h2>
    
    <p className={blogStyles.paragraph}>
      Paragraph with <a href="#" className={blogStyles.link}>styled link</a> 
      and <code className={blogStyles.inlineCode}>inline code</code>.
    </p>
    
    <blockquote className={blogStyles.blockquote}>
      Important quote or insight that needs emphasis.
    </blockquote>
    
    <pre className={blogStyles.codeBlock}>{`
      // Code example
      const example = 'formatted code';
    `}</pre>
    
    <figure className={blogStyles.figure}>
      <img 
        src="/image.jpg" 
        alt="Description"
        className={blogStyles.image}
      />
      <figcaption className={blogStyles.caption}>
        Image caption
      </figcaption>
    </figure>
  </div>
);
```

## Design Tokens

The system uses consistent design tokens:

### Colors
- **Primary Text**: `#1a1a1a` (headings)
- **Body Text**: `#333333` (paragraphs)
- **Muted Text**: `#666666` (captions, meta)
- **Accent**: `#4A90E2` (links, highlights)
- **Background**: `#ffffff` (main)
- **Subtle**: `#f8f9fa` (code, quotes)

### Typography
- **Font**: Inter (with system font fallbacks)
- **Body Size**: 18px (16px on mobile)
- **Line Height**: 1.7 (body), 1.2 (headings)
- **Max Width**: 700px (optimal reading width)

### Spacing
- Consistent rem-based spacing scale
- Generous white space for readability
- Proper content hierarchy with visual rhythm

## Responsive Design

All components automatically adapt to mobile:
- Font sizes scale down appropriately
- Padding and margins adjust for smaller screens
- Images remain fully responsive
- Navigation and interactions work on touch devices

## Animations & Polish

Subtle animations enhance the reading experience:
- **Fade-in**: Content loads gracefully
- **Slide-in**: Headings appear with subtle movement  
- **Hover effects**: Links and cards respond to interaction
- **Loading states**: Shimmer placeholders during content load

## Accessibility Features

- Full keyboard navigation support
- Proper focus management and indicators
- Semantic HTML structure
- Screen reader optimized content
- High contrast ratios for readability

## Integration with Existing Code

To integrate with your current BlogSection component:

```jsx
// Replace existing styling classes with blog styles
import * as blogStyles from '../../styles/blog.css';

const YourBlogSection = ({ colors, onReadArticle }) => (
  <section className={blogStyles.blogContainer}>
    <h1 className={blogStyles.heading1}>Blog Title</h1>
    {/* Rest of your existing logic */}
  </section>
);
```

## Performance Notes

- CSS-in-JS with build-time extraction (no runtime overhead)
- Minimal bundle size impact
- Efficient re-renders with static CSS classes
- Optimized animations using CSS transforms

This styling system provides a professional, accessible, and beautiful foundation for all your blog content while maintaining excellent performance and developer experience.
