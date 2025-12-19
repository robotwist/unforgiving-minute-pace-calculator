import React from 'react';
import { MUNICH_COLORS } from '../../constants';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  navigation?: any;
}

export const Header = ({ 
  title = 'RunPace Pro', 
  subtitle = 'Munich 1972 Olympic Training Calculator',
  navigation 
}: HeaderProps) => {
  return (
    <header className="munich-header">
      <div className="container um-mx-auto um-px-4">
        <div className="um-flex um-flex-col md:um-flex-row md:um-items-center md:um-justify-between um-py-4">
          <div>
            <h1 
              className="um-text-3xl um-font-bold mb-2"
              style={{ color: MUNICH_COLORS.black }}
            >
              {title}
            </h1>
            <p 
              className="um-text-lg opacity-75"
              style={{ color: MUNICH_COLORS.darkGreen }}
            >
              {subtitle}
            </p>
          </div>
          {navigation && (
            <div className="mt-4 md:mt-0">
              {navigation}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon?: string;
    badge?: string | number;
  }>;
}

export const NavigationTabs = ({ activeTab, onTabChange, tabs }: NavigationTabsProps) => {
  return (
    <nav className="munich-nav" role="navigation" aria-label="Main navigation">
      <div className="um-flex um-flex-wrap um-justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`munich-nav-tab ${activeTab === tab.id ? 'munich-nav-tab-active' : ''}`}
            style={{
              backgroundColor: activeTab === tab.id ? MUNICH_COLORS.lightBlue : 'transparent',
              color: activeTab === tab.id ? 'white' : MUNICH_COLORS.black,
              borderColor: activeTab === tab.id ? MUNICH_COLORS.lightBlue : MUNICH_COLORS.gray
            }}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.icon && (
              <span className="mr-2" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span 
                className="ml-2 px-2 py-1 um-text-xs um-um-rounded-full"
                style={{ 
                  backgroundColor: MUNICH_COLORS.orange,
                  color: 'white'
                }}
                aria-label={`${tab.badge} items`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

interface FooterProps {
  className?: string;
}

export const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className={`munich-footer mt-12 um-py-8 um-text-center ${className}`}
      style={{ 
        backgroundColor: MUNICH_COLORS.lightGreen,
        borderTop: `2px solid ${MUNICH_COLORS.darkGreen}`
      }}
    >
      <div className="container um-mx-auto um-px-4">
        <div className="um-grid md:um-grid-cols-3 gaum-p-6">
          <div>
            <h3 className="um-font-bold mb-2" style={{ color: MUNICH_COLORS.black }}>
              About RunPace Pro
            </h3>
            <p className="um-text-sm" style={{ color: MUNICH_COLORS.darkGreen }}>
              Precision running training inspired by the Munich 1972 Olympics
            </p>
          </div>
          
          <div>
            <h3 className="um-font-bold mb-2" style={{ color: MUNICH_COLORS.black }}>
              Features
            </h3>
            <ul className="um-text-sm space-y-1" style={{ color: MUNICH_COLORS.darkGreen }}>
              <li>VDOT Training Zones</li>
              <li>Personal Best Tracking</li>
              <li>Training Plans</li>
              <li>Performance Analytics</li>
            </ul>
          </div>
          
          <div>
            <h3 className="um-font-bold mb-2" style={{ color: MUNICH_COLORS.black }}>
              Connect
            </h3>
            <p className="um-text-sm" style={{ color: MUNICH_COLORS.darkGreen }}>
              Built with passion for Olympic excellence
            </p>
          </div>
        </div>
        
        <div 
          className="mt-6 pt-4 um-text-sm"
          style={{ 
            borderTop: `1px solid ${MUNICH_COLORS.gray}`,
            color: MUNICH_COLORS.darkGreen 
          }}
        >
          © {currentYear} RunPace Pro. Inspired by Munich 1972 Olympic Design System.
        </div>
      </div>
    </footer>
  );
};

interface MainLayoutProps {
  children: any;
  header?: any;
  navigation?: any;
  footer?: any;
  className?: string;
}

export const MainLayout = ({ 
  children, 
  header, 
  navigation, 
  footer,
  className = '' 
}: MainLayoutProps) => {
  return (
    <div className={`min-h-screen flex um-flex-col ${className}`}>
      {header}
      {navigation}
      
      <main className="flex-1 container um-mx-auto um-px-4 um-py-6">
        {children}
      </main>
      
      {footer}
    </div>
  );
};

interface ContainerProps {
  children: any;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Container = ({ 
  children, 
  size = 'lg',
  className = '' 
}: ContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-um-w-full'
  };

  return (
    <div className={`um-mx-auto um-px-4 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

interface SectionProps {
  children: any;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'highlight';
}

export const Section = ({ 
  children, 
  title, 
  subtitle, 
  className = '',
  variant = 'default' 
}: SectionProps) => {
  const variantStyles = {
    default: {},
    featured: { 
      backgroundColor: MUNICH_COLORS.lightGreen,
      borderLeft: `4px solid ${MUNICH_COLORS.orange}`
    },
    highlight: { 
      backgroundColor: MUNICH_COLORS.lightBlue + '20',
      border: `2px solid ${MUNICH_COLORS.lightBlue}`
    }
  };

  return (
    <section 
      className={`um-py-6 ${className}`}
      style={variantStyles[variant]}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 
              className="um-text-2xl um-font-bold mb-2"
              style={{ color: MUNICH_COLORS.black }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p 
              className="um-text-lg opacity-75"
              style={{ color: MUNICH_COLORS.darkGreen }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </section>
  );
};
