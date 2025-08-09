import { style, keyframes } from '@vanilla-extract/css';

// Share modal animations
const modalFadeIn = keyframes({
  'from': { opacity: 0, transform: 'scale(0.95)' },
  'to': { opacity: 1, transform: 'scale(1)' }
});

const shareButtonPulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' }
});

const copyFeedback = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
});

// Share button styles
export const shareButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  backgroundColor: '#4A90E2',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  
  ':hover': {
    backgroundColor: '#357ABD',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
    animation: `${shareButtonPulse} 0.3s ease-out`,
  },
  
  ':active': {
    transform: 'translateY(0)',
  },
  
  ':focus': {
    outline: '2px solid #4A90E2',
    outlineOffset: '2px',
  }
});

export const shareButtonSecondary = style([shareButton, {
  backgroundColor: '#f8f9fa',
  color: '#333333',
  border: '1px solid #e1e8ed',
  
  ':hover': {
    backgroundColor: '#e9ecef',
    borderColor: '#4A90E2',
    color: '#4A90E2',
  }
}]);

// Share modal overlay
export const shareModalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
  animation: `${modalFadeIn} 0.2s ease-out`,
});

// Share modal content
export const shareModalContent = style({
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '2rem',
  maxWidth: '500px',
  width: '100%',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  animation: `${modalFadeIn} 0.3s ease-out`,
  position: 'relative',
  
  '@media': {
    '(max-width: 768px)': {
      padding: '1.5rem',
      margin: '1rem',
    }
  }
});

// Close button
export const closeButton = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  color: '#666666',
  cursor: 'pointer',
  padding: '0.25rem',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
  
  ':hover': {
    backgroundColor: '#f8f9fa',
    color: '#333333',
  }
});

// Share modal title
export const shareModalTitle = style({
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '0.5rem',
  paddingRight: '2rem', // Space for close button
});

export const shareModalSubtitle = style({
  fontSize: '0.875rem',
  color: '#666666',
  marginBottom: '2rem',
});

// Social media buttons grid
export const socialButtonsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '1rem',
  marginBottom: '2rem',
});

// Individual social media buttons
export const socialButton = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem',
  backgroundColor: 'white',
  border: '2px solid #e1e8ed',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  color: '#333333',
  
  ':hover': {
    borderColor: '#4A90E2',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }
});

// Platform-specific colors
export const twitterButton = style([socialButton, {
  ':hover': {
    borderColor: '#1DA1F2',
    backgroundColor: '#1DA1F2',
    color: 'white',
  }
}]);

export const facebookButton = style([socialButton, {
  ':hover': {
    borderColor: '#1877F2',
    backgroundColor: '#1877F2',
    color: 'white',
  }
}]);

export const linkedinButton = style([socialButton, {
  ':hover': {
    borderColor: '#0A66C2',
    backgroundColor: '#0A66C2',
    color: 'white',
  }
}]);

export const redditButton = style([socialButton, {
  ':hover': {
    borderColor: '#FF4500',
    backgroundColor: '#FF4500',
    color: 'white',
  }
}]);

export const emailButton = style([socialButton, {
  ':hover': {
    borderColor: '#34495e',
    backgroundColor: '#34495e',
    color: 'white',
  }
}]);

// Copy link section
export const copyLinkSection = style({
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  marginBottom: '1rem',
});

export const copyLinkTitle = style({
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#333333',
  marginBottom: '0.5rem',
});

export const copyLinkInput = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #e1e8ed',
  borderRadius: '6px',
  fontSize: '0.875rem',
  backgroundColor: 'white',
  
  ':focus': {
    outline: 'none',
    borderColor: '#4A90E2',
    boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.1)',
  }
});

export const copyButton = style({
  marginTop: '0.5rem',
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#4A90E2',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  ':hover': {
    backgroundColor: '#357ABD',
  },
  
  ':active': {
    transform: 'translateY(1px)',
  }
});

// Copy feedback message
export const copyFeedbackMessage = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#059669',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontSize: '0.875rem',
  fontWeight: '500',
  animation: `${copyFeedback} 0.2s ease-out`,
  zIndex: 10,
});

// Social media icons (using SVG-based icons)
export const socialIcon = style({
  width: '24px',
  height: '24px',
  opacity: 0.8,
  transition: 'opacity 0.2s ease',
});

// Share stats (optional)
export const shareStats = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  fontSize: '0.75rem',
  color: '#666666',
  marginTop: '1rem',
  paddingTop: '1rem',
  borderTop: '1px solid #e1e8ed',
});

// Mobile-specific adjustments
export const mobileShareButton = style({
  '@media': {
    '(max-width: 768px)': {
      padding: '0.5rem 0.75rem',
      fontSize: '0.8125rem',
    }
  }
});

// Floating share button (for articles)
export const floatingShareButton = style({
  position: 'fixed',
  right: '2rem',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#4A90E2',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
  transition: 'all 0.3s ease',
  zIndex: 100,
  
  ':hover': {
    backgroundColor: '#357ABD',
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 6px 16px rgba(74, 144, 226, 0.4)',
  },
  
  '@media': {
    '(max-width: 1024px)': {
      display: 'none', // Hide on smaller screens
    }
  }
});

// Inline share buttons (at end of articles)
export const inlineShareContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  padding: '2rem 0',
  borderTop: '1px solid #e1e8ed',
  borderBottom: '1px solid #e1e8ed',
  marginTop: '3rem',
  marginBottom: '2rem',
});

export const inlineShareLabel = style({
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#666666',
  alignSelf: 'center',
  marginRight: '0.5rem',
});

// Compact share buttons for inline use
export const compactShareButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.5rem 0.75rem',
  backgroundColor: '#f8f9fa',
  color: '#333333',
  border: '1px solid #e1e8ed',
  borderRadius: '20px',
  fontSize: '0.8125rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  
  ':hover': {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    color: 'white',
    transform: 'translateY(-1px)',
  }
});
