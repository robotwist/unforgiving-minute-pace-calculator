// Premium Blog Paywall System
import React, { useState } from 'react';
import DOMPurify from 'dompurify';

const PremiumPaywall = ({ article, colors, onSubscribe }) => {
  const [selectedTier, setSelectedTier] = useState('pro');

  const subscriptionTiers = {
    basic: {
      name: 'Basic',
      price: 9,
      features: [
        'Access to premium articles',
        'Weekly training tips',
        'Basic training plan templates'
      ]
    },
    pro: {
      name: 'Pro',
      price: 19,
      features: [
        'All Basic features',
        'Advanced training analysis',
        'Personalized pace calculations',
        'Monthly coaching webinars'
      ],
      popular: true
    },
    elite: {
      name: 'Elite',
      price: 39,
      features: [
        'All Pro features',
        'One-on-one monthly consultation',
        'Custom training plan creation',
        'Priority support'
      ]
    }
  };

  return (
    <div className="premium-paywall">
      {/* Article Teaser */}
      <div className="teaser-content mb-8">
        <div className="prose prose-lg max-w-none" style={{ color: colors.black }}>
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(article.teaser_content || article.content.substring(0, 500) + '...')
            }} 
          />
        </div>
        
        {/* Fade Effect */}
        <div 
          className="um-relative"
          style={{
            background: `linear-gradient(transparent, ${colors.white})`,
            height: '60px',
            marginTop: '-60px',
            zIndex: 10
          }}
        />
      </div>

      {/* Paywall CTA */}
      <div className="munich-card" style={{ 
        background: `linear-gradient(135deg, ${colors.lightBlue}10, ${colors.lightGreen}10)`,
        border: `2px solid ${colors.lightBlue}`,
        position: 'um-relative'
      }}>
        <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-diamond" style={{ 
          backgroundColor: colors.orange,
          opacity: 0.8
        }}></div>
        
        <div className="munich-card-body um-text-center">
          <div className="mb-6">
            <div className="w-16 um-h-16 geometric-octagon um-mx-auto um-mb-4" style={{ 
              backgroundColor: colors.lightBlue 
            }}></div>
            <h3 className="um-text-2xl um-font-bold um-mb-2" style={{ color: colors.black }}>
              Continue Reading
            </h3>
            <p className="um-text-lg" style={{ color: colors.darkGreen }}>
              Get access to the complete article and our entire library of premium training content.
            </p>
          </div>

          {/* Subscription Tiers */}
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-3 gaum-p-4 um-mb-6">
            {Object.entries(subscriptionTiers).map(([key, tier]) => (
              <div 
                key={key}
                className={`munich-card um-cursor-pointer transition-all ${
                  selectedTier === key ? 'ring-2' : ''
                }`}
                style={{ 
                  ringColor: selectedTier === key ? colors.lightBlue : 'transparent',
                  backgroundColor: tier.popular ? colors.lightBlue + '10' : 'transparent'
                }}
                onClick={() => setSelectedTier(key)}
              >
                <div className="munich-card-body um-relative">
                  {tier.popular && (
                    <div 
                      className="um-absolute -top-2 left-1/2 transform -translate-x-1/2 um-text-xs um-font-bold px-3 py-1 um-um-rounded-full"
                      style={{ 
                        backgroundColor: colors.orange,
                        color: colors.white
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="um-text-center">
                    <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>
                      {tier.name}
                    </h4>
                    <div className="mb-4">
                      <span className="um-text-3xl um-font-bold" style={{ color: colors.black }}>
                        ${tier.price}
                      </span>
                      <span className="um-text-sm" style={{ color: colors.darkGreen }}>
                        /month
                      </span>
                    </div>
                    
                    <ul className="um-text-sm space-y-2 um-mb-4">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="um-flex um-items-start">
                          <span style={{ color: colors.lightBlue }}>✓</span>
                          <span className="ml-2" style={{ color: colors.black }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <button 
            className="munich-btn munich-btn-primary um-text-lg um-px-8 py-3"
            onClick={() => onSubscribe(selectedTier, subscriptionTiers[selectedTier])}
          >
            Subscribe to {subscriptionTiers[selectedTier].name} - ${subscriptionTiers[selectedTier].price}/month
          </button>
          
          <p className="um-text-sm um-mt-4" style={{ color: colors.silver }}>
            Cancel anytime • 7-day free trial • Instant access
          </p>
        </div>
      </div>

      {/* Benefits Highlight */}
      <div className="mt-8 um-text-center">
        <h4 className="um-font-bold um-mb-4" style={{ color: colors.black }}>
          What You'll Get Access To:
        </h4>
        <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-lg-grid-cols-4 gaum-p-4">
          <div className="um-text-center">
            <div className="w-12 um-h-12 geometric-diamond um-mx-auto um-mb-2" style={{ 
              backgroundColor: colors.lightBlue 
            }}></div>
            <p className="um-text-sm um-font-medium" style={{ color: colors.black }}>
              50+ Premium Articles
            </p>
          </div>
          <div className="um-text-center">
            <div className="w-12 um-h-12 geometric-octagon um-mx-auto um-mb-2" style={{ 
              backgroundColor: colors.lightGreen 
            }}></div>
            <p className="um-text-sm um-font-medium" style={{ color: colors.black }}>
              Advanced Training Plans
            </p>
          </div>
          <div className="um-text-center">
            <div className="w-12 um-h-12 geometric-square um-mx-auto um-mb-2" style={{ 
              backgroundColor: colors.violet 
            }}></div>
            <p className="um-text-sm um-font-medium" style={{ color: colors.black }}>
              Expert Coaching Tips
            </p>
          </div>
          <div className="um-text-center">
            <div className="w-12 um-h-12 geometric-diamond um-mx-auto um-mb-2" style={{ 
              backgroundColor: colors.orange 
            }}></div>
            <p className="um-text-sm um-font-medium" style={{ color: colors.black }}>
              Monthly Webinars
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPaywall;
