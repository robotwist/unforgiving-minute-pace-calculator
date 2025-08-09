# Blog Sharing Integration Guide

The blog sharing system provides comprehensive social media sharing capabilities for your running blog articles. Here's how to integrate and use the sharing components.

## Components Overview

### 1. ShareButton
A primary share button that opens the full sharing modal.

```jsx
import { ShareButton } from './components/blog/ShareButton';

<ShareButton 
  article={{
    title: "Your Article Title",
    excerpt: "Brief description of the article"
  }}
  url="https://your-site.com/article-url"
  variant="primary" // or "secondary"
/>
```

### 2. FloatingShareButton
A floating share button that appears on the right side of the screen (desktop only).

```jsx
import { FloatingShareButton } from './components/blog/ShareButton';

<FloatingShareButton 
  article={articleData}
  url={window.location.href}
/>
```

### 3. InlineShareButtons
Compact sharing buttons that appear inline, typically at the end of articles.

```jsx
import { InlineShareButtons } from './components/blog/ShareButton';

<InlineShareButtons 
  article={articleData}
  url={window.location.href}
/>
```

### 4. ShareModal
The modal that appears when sharing buttons are clicked (automatically included with other components).

## Sharing Platforms Supported

- **Twitter/X**: Creates a tweet with article title and URL
- **Facebook**: Opens Facebook sharing dialog
- **LinkedIn**: Shares to LinkedIn with URL
- **Reddit**: Submits to Reddit with title and URL
- **Email**: Opens email client with subject and message
- **Copy Link**: Copies URL to clipboard with feedback

## Integration Examples

### Basic Article Page
```jsx
import React from 'react';
import { FloatingShareButton, InlineShareButtons } from './components/blog/ShareButton';

const ArticlePage = ({ article }) => {
  return (
    <div>
      {/* Floating share button for desktop */}
      <FloatingShareButton 
        article={article}
        url={window.location.href}
      />
      
      {/* Article content */}
      <article>
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        
        {/* Inline share buttons at the end */}
        <InlineShareButtons 
          article={article}
          url={window.location.href}
        />
      </article>
    </div>
  );
};
```

### Blog Card in Article Listing
```jsx
import React from 'react';
import { ShareButton } from './components/blog/ShareButton';

const BlogCard = ({ article }) => {
  return (
    <div className="blog-card">
      <h2>{article.title}</h2>
      <p>{article.excerpt}</p>
      <div className="card-footer">
        <span>By {article.author}</span>
        <ShareButton 
          article={article}
          variant="secondary"
          url={article.url}
        />
      </div>
    </div>
  );
};
```

## Article Data Structure

The `article` prop should have this structure:

```javascript
const article = {
  title: "Article Title",           // Required
  excerpt: "Brief description",     // Optional but recommended
  author: {                        // Optional
    name: "Author Name",
    avatar: "/path/to/avatar.jpg"
  },
  publishDate: "Date string",      // Optional
  readingTime: "X min read",       // Optional
  url: "https://...",              // Optional - will use current URL if not provided
};
```

## Features

### Native Web Share API Support
On mobile devices, the system will attempt to use the native Web Share API when available, falling back to the custom modal on desktop or unsupported devices.

### Accessibility
- Full keyboard navigation support
- ARIA labels on all interactive elements
- Focus management for modals
- Screen reader friendly

### Analytics Integration
The components include hooks for analytics tracking:

```jsx
import { trackShare } from './components/blog/ShareButton';

// Track when articles are shared
trackShare('twitter', articleId);
```

### Copy to Clipboard
Includes modern clipboard API with fallback for older browsers.

## Styling

The sharing components use Vanilla Extract CSS classes from `/src/styles/share.css.ts`. Key features:

- Munich 1972 color scheme integration (#4A90E2)
- Smooth animations and hover effects
- Mobile-responsive design
- Platform-specific brand colors on hover

## Customization

### Custom Share URLs
You can customize the sharing URLs by modifying the `shareUrls` object in `ShareModal.jsx`:

```javascript
const shareUrls = {
  twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}&via=yourhandle`,
  // ... other platforms
};
```

### Adding New Platforms
To add new sharing platforms:

1. Add platform to `shareUrls` object in `ShareModal.jsx`
2. Create an icon component
3. Add button to the social buttons grid
4. Add compact version to `InlineShareButtons`

## Best Practices

1. **Always provide article title and excerpt** for better sharing experience
2. **Use FloatingShareButton on article pages** for easy access
3. **Include InlineShareButtons at article end** to encourage sharing after reading
4. **Use secondary variant ShareButton in card listings** to avoid overwhelming the interface
5. **Test sharing URLs** to ensure they generate proper previews on social platforms

## Browser Support

- Modern browsers: Full functionality including native Web Share API
- Older browsers: Fallback clipboard functionality
- Mobile: Native share sheet when available
- Desktop: Custom modal with full functionality

The sharing system is production-ready and includes error handling for all scenarios.
