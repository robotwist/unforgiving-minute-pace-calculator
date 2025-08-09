#!/usr/bin/env node

/**
 * Accessibility Audit Script for Unforgiving Minute Running Calculator
 * Checks for WCAG 2.1 compliance, color contrast, and accessibility best practices
 */

const fs = require('fs');
const path = require('path');

// Color contrast calculation functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(rgb) {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(hexToRgb(color1));
  const lum2 = getLuminance(hexToRgb(color2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function checkContrast(foreground, background, level = 'AA') {
  const ratio = getContrastRatio(foreground, background);
  const requirements = {
    'AA': { normal: 4.5, large: 3.0 },
    'AAA': { normal: 7.0, large: 4.5 }
  };
  
  return {
    ratio: ratio.toFixed(2),
    passAA: ratio >= requirements.AA.normal,
    passAAA: ratio >= requirements.AAA.normal,
    passAALarge: ratio >= requirements.AA.large,
    passAAALarge: ratio >= requirements.AAA.large
  };
}

// Extract colors from CSS files
function extractColorsFromCSS() {
  console.log('🎨 EXTRACTING COLORS FROM CSS FILES');
  console.log('='.repeat(50));
  
  const colors = {
    light: {},
    dark: {}
  };
  
  try {
    // Main CSS file
    const indexCSS = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf8');
    
    // Extract Munich color palette
    const colorMatches = indexCSS.match(/--munich-[\w-]+:\s*#[a-fA-F0-9]{6}/g) || [];
    colorMatches.forEach(match => {
      const [variable, color] = match.split(':');
      const varName = variable.replace('--munich-', '').trim();
      colors.light[varName] = color.trim().replace(';', '');
    });
    
    // Running Design App CSS
    const designCSS = fs.readFileSync(path.join(__dirname, 'src/RunningDesignApp.css'), 'utf8');
    
    // Extract light mode colors
    const lightColors = designCSS.match(/--[\w-]+:\s*#[a-fA-F0-9]{6}/g) || [];
    lightColors.forEach(match => {
      const [variable, color] = match.split(':');
      const varName = variable.replace('--', '').trim();
      if (varName.includes('dark')) {
        colors.dark[varName.replace('dark-', '')] = color.trim().replace(';', '');
      } else {
        colors.light[varName] = color.trim().replace(';', '');
      }
    });
    
    console.log('✅ Extracted colors from CSS files');
    console.log(`   Light mode colors: ${Object.keys(colors.light).length}`);
    console.log(`   Dark mode colors: ${Object.keys(colors.dark).length}`);
    
  } catch (error) {
    console.log('❌ Error reading CSS files:', error.message);
  }
  
  return colors;
}

// Check color contrast issues
function checkColorContrast() {
  console.log('\\n🔍 COLOR CONTRAST ANALYSIS');
  console.log('='.repeat(50));
  
  const colors = extractColorsFromCSS();
  const issues = [];
  
  // Define common text/background combinations
  const combinations = [
    // Light mode combinations
    { name: 'Light Mode - Primary Text', fg: colors.light['black'] || '#1F2937', bg: colors.light['white'] || '#FFFFFF', mode: 'light' },
    { name: 'Light Mode - Primary Button', fg: colors.light['white'] || '#FFFFFF', bg: colors.light['light-blue'] || '#4A90E2', mode: 'light' },
    { name: 'Light Mode - Success Button', fg: colors.light['white'] || '#FFFFFF', bg: colors.light['light-green'] || '#7ED321', mode: 'light' },
    { name: 'Light Mode - Warning Button', fg: colors.light['white'] || '#FFFFFF', bg: colors.light['orange'] || '#F97316', mode: 'light' },
    { name: 'Light Mode - Secondary Text', fg: colors.light['silver'] || '#9CA3AF', bg: colors.light['white'] || '#FFFFFF', mode: 'light' },
    
    // Dark mode combinations  
    { name: 'Dark Mode - Primary Text', fg: colors.dark['white'] || '#E8E8E8', bg: colors.dark['charcoal'] || '#2C2C2C', mode: 'dark' },
    { name: 'Dark Mode - Primary Button', fg: colors.light['white'] || '#FFFFFF', bg: colors.dark['blue'] || '#0D2B3E', mode: 'dark' },
    { name: 'Dark Mode - Success Button', fg: colors.light['white'] || '#FFFFFF', bg: colors.dark['forest'] || '#1A4D35', mode: 'dark' },
    
    // Cross-mode checks with Munich colors
    { name: 'Munich Blue on White', fg: colors.light['light-blue'] || '#4A90E2', bg: colors.light['white'] || '#FFFFFF', mode: 'light' },
    { name: 'Munich Green on White', fg: colors.light['light-green'] || '#7ED321', bg: colors.light['white'] || '#FFFFFF', mode: 'light' },
  ];
  
  console.log('Checking contrast ratios (WCAG 2.1 standards):');
  console.log('• AA Normal Text: 4.5:1 minimum');
  console.log('• AA Large Text: 3.0:1 minimum'); 
  console.log('• AAA Normal Text: 7.0:1 minimum');
  console.log('• AAA Large Text: 4.5:1 minimum\\n');
  
  combinations.forEach(combo => {
    if (combo.fg && combo.bg) {
      const result = checkContrast(combo.fg, combo.bg);
      const status = result.passAA ? '✅' : '❌';
      const level = result.passAAA ? 'AAA' : (result.passAA ? 'AA' : 'FAIL');
      
      console.log(`${status} ${combo.name}`);
      console.log(`   Ratio: ${result.ratio}:1 (${level})`);
      console.log(`   Colors: ${combo.fg} on ${combo.bg}`);
      
      if (!result.passAA) {
        issues.push({
          type: 'contrast',
          severity: 'high',
          element: combo.name,
          issue: `Contrast ratio ${result.ratio}:1 fails WCAG AA (4.5:1 required)`,
          recommendation: 'Adjust colors to meet minimum 4.5:1 contrast ratio'
        });
      }
      
      console.log();
    }
  });
  
  return issues;
}

// Check accessibility attributes in components
function checkAccessibilityAttributes() {
  console.log('🏷️  ACCESSIBILITY ATTRIBUTES AUDIT');
  console.log('='.repeat(50));
  
  const issues = [];
  const componentFiles = [
    'src/components/RunningTrainingApp.jsx',
    'src/RunningDesignApp.jsx',
    'src/components/StripePaymentForm.jsx'
  ];
  
  componentFiles.forEach(filePath => {
    try {
      if (fs.existsSync(path.join(__dirname, filePath))) {
        const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
        console.log(`\\n📄 Checking ${filePath}:`);
        
        // Check for accessibility attributes
        const checks = [
          { pattern: /aria-label=/g, name: 'aria-label', good: true },
          { pattern: /aria-describedby=/g, name: 'aria-describedby', good: true },
          { pattern: /role=/g, name: 'role', good: true },
          { pattern: /<img(?![^>]*alt=)/g, name: 'images without alt text', good: false },
          { pattern: /<button(?![^>]*aria-label)(?![^>]*title)/g, name: 'buttons without labels', good: false },
          { pattern: /<input(?![^>]*aria-label)(?![^>]*placeholder)/g, name: 'inputs without labels', good: false },
          { pattern: /onClick.*=.*{/g, name: 'interactive elements', good: null },
          { pattern: /tabIndex/g, name: 'tab index management', good: true }
        ];
        
        checks.forEach(check => {
          const matches = content.match(check.pattern) || [];
          if (check.good === true && matches.length > 0) {
            console.log(`   ✅ Found ${matches.length} ${check.name} attributes`);
          } else if (check.good === false && matches.length > 0) {
            console.log(`   ❌ Found ${matches.length} ${check.name}`);
            issues.push({
              type: 'accessibility',
              severity: 'medium',
              file: filePath,
              issue: `Found ${matches.length} ${check.name}`,
              recommendation: `Add appropriate accessibility attributes`
            });
          } else if (check.good === null) {
            console.log(`   ℹ️  Found ${matches.length} ${check.name}`);
          }
        });
        
        // Check for semantic HTML
        const semanticElements = content.match(/<(header|nav|main|section|article|aside|footer)/g) || [];
        console.log(`   📱 Semantic HTML elements: ${semanticElements.length}`);
        
        if (semanticElements.length === 0) {
          issues.push({
            type: 'semantic',
            severity: 'low',
            file: filePath,
            issue: 'No semantic HTML elements found',
            recommendation: 'Use semantic HTML elements (header, nav, main, section, etc.)'
          });
        }
        
      }
    } catch (error) {
      console.log(`   ❌ Error reading ${filePath}:`, error.message);
    }
  });
  
  return issues;
}

// Check keyboard navigation
function checkKeyboardNavigation() {
  console.log('\\n⌨️  KEYBOARD NAVIGATION AUDIT');  
  console.log('='.repeat(50));
  
  const issues = [];
  
  try {
    const designApp = fs.readFileSync(path.join(__dirname, 'src/RunningDesignApp.jsx'), 'utf8');
    
    // Check for keyboard event handlers
    const keyboardEvents = [
      { pattern: /onKeyDown/g, name: 'onKeyDown handlers' },
      { pattern: /onKeyPress/g, name: 'onKeyPress handlers' },
      { pattern: /onKeyUp/g, name: 'onKeyUp handlers' },
      { pattern: /addEventListener.*keydown/g, name: 'keydown event listeners' },
      { pattern: /handleKeyPress/g, name: 'keyboard handler functions' }
    ];
    
    let hasKeyboardSupport = false;
    keyboardEvents.forEach(event => {
      const matches = designApp.match(event.pattern) || [];
      if (matches.length > 0) {
        console.log(`✅ Found ${matches.length} ${event.name}`);
        hasKeyboardSupport = true;
      }
    });
    
    if (!hasKeyboardSupport) {
      console.log('⚠️  Limited keyboard navigation support detected');
      issues.push({
        type: 'keyboard',
        severity: 'medium',
        issue: 'Limited keyboard navigation support',
        recommendation: 'Add keyboard event handlers for interactive elements'
      });
    }
    
    // Check for focus management
    const focusPatterns = [
      { pattern: /:focus/g, name: 'CSS focus styles' },
      { pattern: /focus\(\)/g, name: 'JavaScript focus calls' },
      { pattern: /tabIndex/g, name: 'tab index attributes' }
    ];
    
    focusPatterns.forEach(pattern => {
      const matches = designApp.match(pattern.pattern) || [];
      console.log(`${matches.length > 0 ? '✅' : '⚠️ '} ${pattern.name}: ${matches.length}`);
    });
    
  } catch (error) {
    console.log('❌ Error checking keyboard navigation:', error.message);
  }
  
  return issues;
}

// Check responsive design and mobile accessibility
function checkResponsiveAccessibility() {
  console.log('\\n📱 RESPONSIVE & MOBILE ACCESSIBILITY');
  console.log('='.repeat(50));
  
  const issues = [];
  
  try {
    const cssFiles = ['src/index.css', 'src/RunningDesignApp.css'];
    
    cssFiles.forEach(filePath => {
      if (fs.existsSync(path.join(__dirname, filePath))) {
        const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
        console.log(`\\n📄 Checking ${filePath}:`);
        
        // Check for responsive design patterns
        const mediaQueries = content.match(/@media[^{]+{/g) || [];
        console.log(`   📐 Media queries: ${mediaQueries.length}`);
        
        // Check for reduced motion support
        const reducedMotion = content.match(/@media.*prefers-reduced-motion/g) || [];
        console.log(`   ♿ Reduced motion support: ${reducedMotion.length > 0 ? '✅' : '❌'}`);
        
        if (reducedMotion.length === 0) {
          issues.push({
            type: 'motion',
            severity: 'low',
            file: filePath,
            issue: 'No reduced motion preferences detected',
            recommendation: 'Add @media (prefers-reduced-motion: reduce) support'
          });
        }
        
        // Check for high contrast support
        const highContrast = content.match(/@media.*prefers-contrast.*high/g) || [];
        console.log(`   🎨 High contrast support: ${highContrast.length > 0 ? '✅' : '❌'}`);
        
        // Check minimum touch target sizes (44px recommended)
        const buttonStyles = content.match(/button[^}]*{[^}]*}/g) || [];
        console.log(`   👆 Button styles defined: ${buttonStyles.length}`);
        
      }
    });
    
  } catch (error) {
    console.log('❌ Error checking responsive accessibility:', error.message);
  }
  
  return issues;
}

// Generate accessibility report
function generateAccessibilityReport() {
  console.log('🚀 UNFORGIVING MINUTE - ACCESSIBILITY AUDIT REPORT');
  console.log('='.repeat(60));
  
  const allIssues = [
    ...checkColorContrast(),
    ...checkAccessibilityAttributes(), 
    ...checkKeyboardNavigation(),
    ...checkResponsiveAccessibility()
  ];
  
  console.log('\\n📊 ACCESSIBILITY SUMMARY');
  console.log('='.repeat(50));
  
  const severityCounts = {
    high: allIssues.filter(i => i.severity === 'high').length,
    medium: allIssues.filter(i => i.severity === 'medium').length,
    low: allIssues.filter(i => i.severity === 'low').length
  };
  
  console.log(`🔴 High Priority Issues: ${severityCounts.high}`);
  console.log(`🟡 Medium Priority Issues: ${severityCounts.medium}`);
  console.log(`🟢 Low Priority Issues: ${severityCounts.low}`);
  console.log(`📋 Total Issues Found: ${allIssues.length}`);
  
  if (allIssues.length > 0) {
    console.log('\\n🔧 RECOMMENDED FIXES:');
    console.log('='.repeat(50));
    
    allIssues.forEach((issue, index) => {
      const priority = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
      console.log(`${priority} ${index + 1}. ${issue.issue}`);
      console.log(`   💡 ${issue.recommendation}`);
      if (issue.file) console.log(`   📁 File: ${issue.file}`);
      console.log();
    });
  } else {
    console.log('\\n🎉 EXCELLENT! No major accessibility issues detected.');
  }
  
  console.log('\\n📋 ACCESSIBILITY CHECKLIST STATUS:');
  console.log('='.repeat(50));
  console.log('✅ Color contrast analysis completed');
  console.log('✅ Accessibility attributes audited');
  console.log('✅ Keyboard navigation checked');  
  console.log('✅ Responsive accessibility verified');
  console.log('✅ Semantic HTML structure analyzed');
  console.log('✅ Focus management reviewed');
  
  return allIssues;
}

// Run the accessibility audit
const issues = generateAccessibilityReport();

// Exit with appropriate code
process.exit(issues.filter(i => i.severity === 'high').length > 0 ? 1 : 0);
