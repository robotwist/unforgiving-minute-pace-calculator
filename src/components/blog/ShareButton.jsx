import React, { useState } from 'react';
import ShareModal from './ShareModal';
import * as styles from '../styles/share.css';

// Main Share Button Component
export const ShareButton = ({ article, url, variant = 'primary', className = '' }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const buttonClass = variant === 'secondary' ? styles.shareButtonSecondary : styles.shareButton;

  return (
    <>
      <button 
        className={`${buttonClass} ${className}`}
        onClick={() => setIsShareModalOpen(true)}
        aria-label={`Share "${article.title}"`}
      >
        <ShareIcon />
        Share
      </button>
      
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={article}
        url={url}
      />
    </>
  );
};

// Floating Share Button (for article pages)
export const FloatingShareButton = ({ article, url }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <button 
        className={styles.floatingShareButton}
        onClick={() => setIsShareModalOpen(true)}
        aria-label={`Share "${article.title}"`}
        title="Share this article"
      >
        <ShareIcon />
      </button>
      
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={article}
        url={url}
      />
    </>
  );
};

// Inline Share Buttons (at the end of articles)
export const InlineShareButtons = ({ article, url }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleDirectShare = (platform) => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`I thought you might find this interesting: ${shareUrl}`)}`
    };

    if (platform === 'email') {
      window.location.href = shareUrls[platform];
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <>
      <div className={styles.inlineShareContainer}>
        <span className={styles.inlineShareLabel}>Share:</span>
        
        <button 
          className={styles.compactShareButton}
          onClick={() => handleDirectShare('twitter')}
          aria-label="Share on Twitter"
        >
          <TwitterIconSmall />
          Twitter
        </button>
        
        <button 
          className={styles.compactShareButton}
          onClick={() => handleDirectShare('facebook')}
          aria-label="Share on Facebook"
        >
          <FacebookIconSmall />
          Facebook
        </button>
        
        <button 
          className={styles.compactShareButton}
          onClick={() => handleDirectShare('linkedin')}
          aria-label="Share on LinkedIn"
        >
          <LinkedInIconSmall />
          LinkedIn
        </button>
        
        <button 
          className={styles.compactShareButton}
          onClick={() => handleDirectShare('email')}
          aria-label="Share via Email"
        >
          <EmailIconSmall />
          Email
        </button>
        
        <button 
          className={styles.compactShareButton}
          onClick={() => setIsShareModalOpen(true)}
          aria-label="More sharing options"
        >
          <ShareIcon />
          More
        </button>
      </div>
      
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={article}
        url={url}
      />
    </>
  );
};

// Quick Share Hook for programmatic sharing
export const useShare = () => {
  const share = async (article, url) => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    // Use native Web Share API if available (mainly mobile)
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || 'Check out this running article',
          url: shareUrl,
        });
        return true;
      } catch (err) {
        // User cancelled or share failed, fallback to custom modal
        return false;
      }
    }
    return false; // Fallback to custom modal
  };

  return { share };
};

// Copy Link Function (utility)
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

// Share Analytics (optional - for tracking shares)
export const trackShare = (platform, articleId) => {
  // You can implement your analytics tracking here
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      method: platform,
      content_type: 'article',
      content_id: articleId,
    });
  }
  
  // Or custom analytics
  console.log(`Article shared via ${platform}:`, articleId);
};

// Icon Components (smaller versions for compact buttons)
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
  </svg>
);

const TwitterIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const FacebookIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EmailIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h1.883l8.481 6.36 8.481-6.36h1.883c.904 0 1.636.732 1.636 1.636z"/>
  </svg>
);

export default ShareButton;
