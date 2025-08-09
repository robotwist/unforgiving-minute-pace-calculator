// Example: How to integrate the new blog styling into your RunningTrainingApp.jsx

// 1. Import the new BlogSection component
import BlogSection from './components/blog/BlogSection';

// 2. Replace your existing blog section (around line 2520) with:
{activeTab === 'blog' && (
  <BlogSection 
    colors={colors} 
    onReadArticle={setSelectedArticle} 
  />
)}

// 3. For displaying full blog posts, use the FullBlogPost component:
import { FullBlogPost } from './components/blog/FullBlogPost';

// Example modal or page for showing full articles
const BlogModal = ({ article, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="close-btn">×</button>
      <FullBlogPost article={article} />
    </div>
  </div>
);

// 4. For custom blog content, use individual styling classes:
import * as blogStyles from './styles/blog.css';

const CustomBlogContent = () => (
  <div className={blogStyles.blogContainer}>
    <h1 className={blogStyles.heading1}>Your Custom Title</h1>
    <p className={blogStyles.paragraph}>
      Your content with <a className={blogStyles.link}>styled links</a>
    </p>
    
    <blockquote className={blogStyles.blockquote}>
      Important quotes stand out beautifully
    </blockquote>
    
    <pre className={blogStyles.codeBlock}>
      {`// Code blocks are perfectly formatted
const example = "Beautiful code styling";`}
    </pre>
  </div>
);

// 5. The styling system is fully compatible with your existing Munich color system
// Colors are automatically applied where appropriate, but you can override:

const CustomStyledSection = ({ colors }) => (
  <section className={blogStyles.blogContainer}>
    <h2 
      className={blogStyles.heading2}
      style={{ color: colors.lightBlue }} // Use your Munich colors
    >
      Section with Munich Colors
    </h2>
    <p className={blogStyles.paragraph}>
      Content automatically uses the elegant typography while maintaining 
      your color scheme compatibility.
    </p>
  </section>
);

export default CustomStyledSection;
