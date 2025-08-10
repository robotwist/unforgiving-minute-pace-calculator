// Premium Blog Paywall System
import React, { useState } from 'react';

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
              __html: article.teaser_content || article.content.substring(0, 500) + '...'
            }} 
          />
        </div>
        
        {/* Fade Effect */}
        <div 
          className="relative"
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
        position: 'relative'
      }}>
        <div className="absolute top-0 right-0 w-8 h-8 geometric-diamond" style={{ 
          backgroundColor: colors.orange,
          opacity: 0.8
        }}></div>
        
        <div className="munich-card-body text-center">
          <div className="mb-6">
            <div className="w-16 h-16 geometric-octagon mx-auto mb-4" style={{ 
              backgroundColor: colors.lightBlue 
            }}></div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
              Continue Reading
            </h3>
            <p className="text-lg" style={{ color: colors.darkGreen }}>
              Get access to the complete article and our entire library of premium training content.
            </p>
          </div>

          {/* Subscription Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(subscriptionTiers).map(([key, tier]) => (
              <div 
                key={key}
                className={`munich-card cursor-pointer transition-all ${
                  selectedTier === key ? 'ring-2' : ''
                }`}
                style={{ 
                  ringColor: selectedTier === key ? colors.lightBlue : 'transparent',
                  backgroundColor: tier.popular ? colors.lightBlue + '10' : 'transparent'
                }}
                onClick={() => setSelectedTier(key)}
              >
                <div className="munich-card-body relative">
                  {tier.popular && (
                    <div 
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: colors.orange,
                        color: colors.white
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h4 className="font-bold mb-2" style={{ color: colors.black }}>
                      {tier.name}
                    </h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold" style={{ color: colors.black }}>
                        ${tier.price}
                      </span>
                      <span className="text-sm" style={{ color: colors.darkGreen }}>
                        /month
                      </span>
                    </div>
                    
                    <ul className="text-sm space-y-2 mb-4">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
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
            className="munich-btn munich-btn-primary text-lg px-8 py-3"
            onClick={() => onSubscribe(selectedTier, subscriptionTiers[selectedTier])}
          >
            Subscribe to {subscriptionTiers[selectedTier].name} - ${subscriptionTiers[selectedTier].price}/month
          </button>
          
          <p className="text-sm mt-4" style={{ color: colors.silver }}>
            Cancel anytime • 7-day free trial • Instant access
          </p>
        </div>
      </div>

      {/* Benefits Highlight */}
      <div className="mt-8 text-center">
        <h4 className="font-bold mb-4" style={{ color: colors.black }}>
          What You'll Get Access To:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 geometric-diamond mx-auto mb-2" style={{ 
              backgroundColor: colors.lightBlue 
            }}></div>
            <p className="text-sm font-medium" style={{ color: colors.black }}>
              50+ Premium Articles
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 geometric-octagon mx-auto mb-2" style={{ 
              backgroundColor: colors.lightGreen 
            }}></div>
            <p className="text-sm font-medium" style={{ color: colors.black }}>
              Advanced Training Plans
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 geometric-square mx-auto mb-2" style={{ 
              backgroundColor: colors.violet 
            }}></div>
            <p className="text-sm font-medium" style={{ color: colors.black }}>
              Expert Coaching Tips
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 geometric-diamond mx-auto mb-2" style={{ 
              backgroundColor: colors.orange 
            }}></div>
            <p className="text-sm font-medium" style={{ color: colors.black }}>
              Monthly Webinars
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPaywall;
