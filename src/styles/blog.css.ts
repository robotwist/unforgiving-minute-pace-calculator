import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

// Design tokens for consistent spacing and typography
const tokens = {
  colors: {
    text: {
      primary: '#1a1a1a',      // Pure black for headings
      body: '#333333',         // Slightly muted for body text
      muted: '#666666',        // For captions, metadata
      accent: '#4A90E2',       // Munich light blue for links
      accentHover: '#357ABD',  // Darker blue for hover
    },
    background: {
      primary: '#ffffff',
      subtle: '#f8f9fa',
      code: '#f6f8fa',
      blockquote: '#f8f9fa',
    },
    borders: {
      light: '#e1e8ed',
      accent: '#4A90E2',
    }
  },
  typography: {
    fonts: {
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace",
    },
    sizes: {
      h1: '2.125rem',    // 34px
      h2: '1.75rem',     // 28px  
      h3: '1.5rem',      // 24px
      h4: '1.25rem',     // 20px
      body: '1.125rem',  // 18px
      caption: '0.875rem', // 14px
      code: '0.9375rem', // 15px
    },
    lineHeights: {
      tight: 1.2,
      body: 1.7,
      relaxed: 1.8,
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  layout: {
    maxWidth: '700px',
    sidebarWidth: '280px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  }
};

// Subtle animations for polish
const fadeIn = keyframes({
  'from': { opacity: 0, transform: 'translateY(10px)' },
  'to': { opacity: 1, transform: 'translateY(0)' }
});

const slideIn = keyframes({
  'from': { opacity: 0, transform: 'translateX(-20px)' },
  'to': { opacity: 1, transform: 'translateX(0)' }
});

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200px 0' },
  '100%': { backgroundPosition: 'calc(200px + 100%) 0' }
});

const hoverLift = keyframes({
  'from': { transform: 'translateY(0)' },
  'to': { transform: 'translateY(-2px)' }
});

// Main blog container
export const blogContainer = style({
  maxWidth: tokens.layout.maxWidth,
  margin: '0 auto',
  padding: `${tokens.spacing.xl} ${tokens.spacing.lg}`,
  fontFamily: tokens.typography.fonts.body,
  color: tokens.colors.text.body,
  lineHeight: tokens.typography.lineHeights.body,
  animation: `${fadeIn} 0.6s ease-out`,
  
  '@media': {
    '(max-width: 768px)': {
      padding: `${tokens.spacing.lg} ${tokens.spacing.md}`,
      fontSize: '1rem', // Slightly smaller on mobile
    }
  }
});

// Article content wrapper
export const articleContent = style({
  fontSize: tokens.typography.sizes.body,
  lineHeight: tokens.typography.lineHeights.body,
  color: tokens.colors.text.body,
});

// Typography styles
export const heading1 = style({
  fontSize: tokens.typography.sizes.h1,
  fontWeight: tokens.typography.weights.bold,
  color: tokens.colors.text.primary,
  lineHeight: tokens.typography.lineHeights.tight,
  marginTop: tokens.spacing.xxxl,
  marginBottom: tokens.spacing.xl,
  animation: `${slideIn} 0.7s ease-out`,
  
  ':first-child': {
    marginTop: 0,
  },
  
  '@media': {
    '(max-width: 768px)': {
      fontSize: '1.875rem', // 30px on mobile
      marginTop: tokens.spacing.xxl,
      marginBottom: tokens.spacing.lg,
    }
  }
});

export const heading2 = style({
  fontSize: tokens.typography.sizes.h2,
  fontWeight: tokens.typography.weights.bold,
  color: tokens.colors.text.primary,
  lineHeight: tokens.typography.lineHeights.tight,
  marginTop: tokens.spacing.xxl,
  marginBottom: tokens.spacing.lg,
  animation: `${slideIn} 0.7s ease-out 0.1s both`,
  
  '@media': {
    '(max-width: 768px)': {
      fontSize: '1.5rem', // 24px on mobile
    }
  }
});

export const heading3 = style({
  fontSize: tokens.typography.sizes.h3,
  fontWeight: tokens.typography.weights.semibold,
  color: tokens.colors.text.primary,
  lineHeight: tokens.typography.lineHeights.tight,
  marginTop: tokens.spacing.xl,
  marginBottom: tokens.spacing.md,
  animation: `${slideIn} 0.7s ease-out 0.2s both`,
  
  '@media': {
    '(max-width: 768px)': {
      fontSize: '1.25rem', // 20px on mobile
    }
  }
});

export const heading4 = style({
  fontSize: tokens.typography.sizes.h4,
  fontWeight: tokens.typography.weights.semibold,
  color: tokens.colors.text.primary,
  lineHeight: tokens.typography.lineHeights.tight,
  marginTop: tokens.spacing.lg,
  marginBottom: tokens.spacing.sm,
  animation: `${slideIn} 0.7s ease-out 0.3s both`,
});

// Paragraph styles
export const paragraph = style({
  fontSize: tokens.typography.sizes.body,
  lineHeight: tokens.typography.lineHeights.body,
  color: tokens.colors.text.body,
  marginBottom: tokens.spacing.lg,
  animation: `${fadeIn} 0.8s ease-out 0.2s both`,
  
  ':last-child': {
    marginBottom: 0,
  },
  
  '@media': {
    '(max-width: 768px)': {
      fontSize: '1rem',
      marginBottom: tokens.spacing.md,
    }
  }
});

// Link styles
export const link = style({
  color: tokens.colors.text.accent,
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  transition: 'all 0.2s ease',
  
  ':hover': {
    borderBottom: `1px solid ${tokens.colors.text.accentHover}`,
    color: tokens.colors.text.accentHover,
  },
  
  ':focus': {
    outline: `2px solid ${tokens.colors.text.accent}`,
    outlineOffset: '2px',
    borderRadius: tokens.borderRadius.sm,
  }
});

// Image styles
export const image = style({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: tokens.borderRadius.md,
  margin: `${tokens.spacing.xl} 0`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  animation: `${fadeIn} 0.9s ease-out 0.3s both`,
  
  ':hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  }
});

// Figure and caption
export const figure = style({
  margin: `${tokens.spacing.xl} 0`,
  animation: `${fadeIn} 0.9s ease-out 0.3s both`,
});

export const caption = style({
  fontSize: tokens.typography.sizes.caption,
  color: tokens.colors.text.muted,
  textAlign: 'center',
  marginTop: tokens.spacing.sm,
  fontStyle: 'italic',
});

// Code styles
export const inlineCode = style({
  fontFamily: tokens.typography.fonts.mono,
  fontSize: tokens.typography.sizes.code,
  backgroundColor: tokens.colors.background.code,
  padding: '0.2em 0.4em',
  borderRadius: tokens.borderRadius.sm,
  color: tokens.colors.text.primary,
  border: `1px solid ${tokens.colors.borders.light}`,
});

export const codeBlock = style({
  fontFamily: tokens.typography.fonts.mono,
  fontSize: tokens.typography.sizes.code,
  backgroundColor: tokens.colors.background.code,
  border: `1px solid ${tokens.colors.borders.light}`,
  borderRadius: tokens.borderRadius.md,
  padding: tokens.spacing.lg,
  margin: `${tokens.spacing.xl} 0`,
  overflow: 'auto',
  lineHeight: 1.5,
  color: tokens.colors.text.primary,
  animation: `${fadeIn} 0.8s ease-out 0.4s both`,
  
  ':hover': {
    backgroundColor: '#f1f3f5',
  },
  
  '@media': {
    '(max-width: 768px)': {
      padding: tokens.spacing.md,
      fontSize: '0.875rem',
    }
  }
});

// Blockquote styles
export const blockquote = style({
  backgroundColor: tokens.colors.background.blockquote,
  borderLeft: `4px solid ${tokens.colors.borders.accent}`,
  padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
  margin: `${tokens.spacing.xl} 0`,
  fontStyle: 'italic',
  fontSize: '1.0625rem', // Slightly larger than body
  lineHeight: tokens.typography.lineHeights.relaxed,
  color: tokens.colors.text.body,
  borderRadius: `0 ${tokens.borderRadius.md} ${tokens.borderRadius.md} 0`,
  position: 'relative',
  animation: `${slideIn} 0.8s ease-out 0.4s both`,
  
  '::before': {
    content: '""',
    position: 'absolute',
    left: '-4px',
    top: '0',
    bottom: '0',
    width: '4px',
    background: `linear-gradient(to bottom, ${tokens.colors.borders.accent}, ${tokens.colors.text.accent}20)`,
  },
  
  '@media': {
    '(max-width: 768px)': {
      padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
      fontSize: '1rem',
    }
  }
});

// List styles
export const orderedList = style({
  paddingLeft: tokens.spacing.xl,
  marginBottom: tokens.spacing.lg,
  
  '@media': {
    '(max-width: 768px)': {
      paddingLeft: tokens.spacing.lg,
    }
  }
});

export const unorderedList = style({
  paddingLeft: tokens.spacing.xl,
  marginBottom: tokens.spacing.lg,
  
  '@media': {
    '(max-width: 768px)': {
      paddingLeft: tokens.spacing.lg,
    }
  }
});

export const listItem = style({
  marginBottom: tokens.spacing.sm,
  lineHeight: tokens.typography.lineHeights.body,
  animation: `${fadeIn} 0.6s ease-out calc(0.1s * var(--item-index, 0)) both`,
});

// Article meta information
export const articleMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing.md,
  fontSize: tokens.typography.sizes.caption,
  color: tokens.colors.text.muted,
  marginBottom: tokens.spacing.xxl,
  paddingBottom: tokens.spacing.lg,
  borderBottom: `1px solid ${tokens.colors.borders.light}`,
  animation: `${fadeIn} 0.6s ease-out 0.1s both`,
  
  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: tokens.spacing.sm,
    }
  }
});

export const authorInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing.sm,
});

export const authorAvatar = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  objectFit: 'cover',
});

export const publishDate = style({
  fontSize: tokens.typography.sizes.caption,
  color: tokens.colors.text.muted,
});

export const readingTime = style({
  fontSize: tokens.typography.sizes.caption,
  color: tokens.colors.text.muted,
  
  '::before': {
    content: '•',
    marginRight: tokens.spacing.sm,
    color: tokens.colors.borders.light,
  }
});

// Article card styles for blog listing
export const articleCard = style({
  backgroundColor: tokens.colors.background.primary,
  border: `1px solid ${tokens.colors.borders.light}`,
  borderRadius: tokens.borderRadius.lg,
  padding: tokens.spacing.xl,
  marginBottom: tokens.spacing.xl,
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 0.6s ease-out calc(0.1s * var(--card-index, 0)) both`,
  
  ':hover': {
    borderColor: tokens.colors.borders.accent,
    boxShadow: '0 8px 24px rgba(74, 144, 226, 0.12)',
    animation: `${hoverLift} 0.3s ease-out forwards`,
  },
  
  '@media': {
    '(max-width: 768px)': {
      padding: tokens.spacing.lg,
    }
  }
});

export const cardTitle = style({
  fontSize: tokens.typography.sizes.h3,
  fontWeight: tokens.typography.weights.semibold,
  color: tokens.colors.text.primary,
  marginBottom: tokens.spacing.md,
  lineHeight: tokens.typography.lineHeights.tight,
  
  ':hover': {
    color: tokens.colors.text.accent,
  }
});

export const cardExcerpt = style({
  color: tokens.colors.text.body,
  lineHeight: tokens.typography.lineHeights.body,
  marginBottom: tokens.spacing.lg,
});

export const cardMeta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: tokens.typography.sizes.caption,
  color: tokens.colors.text.muted,
});

// Table styles
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  margin: `${tokens.spacing.xl} 0`,
  fontSize: '0.9375rem',
  animation: `${fadeIn} 0.8s ease-out 0.4s both`,
});

export const tableHeader = style({
  backgroundColor: tokens.colors.background.subtle,
  fontWeight: tokens.typography.weights.semibold,
  color: tokens.colors.text.primary,
});

export const tableCell = style({
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
  borderBottom: `1px solid ${tokens.colors.borders.light}`,
  lineHeight: tokens.typography.lineHeights.body,
});

// Loading state styles
export const loadingShimmer = style({
  background: `linear-gradient(90deg, ${tokens.colors.background.subtle} 25%, transparent 50%, ${tokens.colors.background.subtle} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 2s infinite linear`,
  borderRadius: tokens.borderRadius.md,
  height: '1rem',
  marginBottom: tokens.spacing.sm,
});

// Responsive utility classes
export const hideOnMobile = style({
  '@media': {
    '(max-width: 768px)': {
      display: 'none',
    }
  }
});

export const showOnMobile = style({
  display: 'none',
  '@media': {
    '(max-width: 768px)': {
      display: 'block',
    }
  }
});

// Global styles for blog content
globalStyle(`${articleContent} p + p`, {
  marginTop: tokens.spacing.lg,
});

globalStyle(`${articleContent} h1 + p, ${articleContent} h2 + p, ${articleContent} h3 + p, ${articleContent} h4 + p`, {
  marginTop: tokens.spacing.md,
});

globalStyle(`${articleContent} img`, {
  maxWidth: '100%',
  height: 'auto',
  borderRadius: tokens.borderRadius.md,
});

// Focus styles for accessibility
globalStyle(':focus-visible', {
  outline: `2px solid ${tokens.colors.text.accent}`,
  outlineOffset: '2px',
  borderRadius: tokens.borderRadius.sm,
});
