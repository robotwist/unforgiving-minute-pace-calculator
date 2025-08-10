import React from 'react';

const PremiumPlansSection = ({ 
  colors, 
  handlePurchaseClick, 
  purchasedPlans 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold" style={{ color: colors.black }}>
          Premium Training Plans
        </h2>
        <p className="text-xl" style={{ color: colors.darkGreen }}>
          Comprehensive, professionally-designed training programs for serious athletes
        </p>
      </div>

      {/* Value Proposition */}
      <div className="munich-card" style={{ background: `linear-gradient(135deg, ${colors.lightBlue}10, ${colors.lightGreen}10)` }}>
        <div className="munich-card-body text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.black }}>
            Why Premium Plans?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 geometric-diamond mx-auto mb-3" style={{ backgroundColor: colors.lightBlue }}></div>
              <h4 className="font-bold mb-2" style={{ color: colors.black }}>Individual Factor Integration</h4>
              <p className="text-sm" style={{ color: colors.darkGreen }}>
                Plans adjusted for your age, experience, and recovery capacity
              </p>
            </div>
            <div>
              <div className="w-12 h-12 geometric-octagon mx-auto mb-3" style={{ backgroundColor: colors.lightGreen }}></div>
              <h4 className="font-bold mb-2" style={{ color: colors.black }}>Race-Specific Training</h4>
              <p className="text-sm" style={{ color: colors.darkGreen }}>
                Goal and current pace integration for optimal training stimulus
              </p>
            </div>
            <div>
              <div className="w-12 h-12 geometric-square mx-auto mb-3" style={{ backgroundColor: colors.violet }}></div>
              <h4 className="font-bold mb-2" style={{ color: colors.black }}>Professional Coaching</h4>
              <p className="text-sm" style={{ color: colors.darkGreen }}>
                Designed by certified coaches with proven track records
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 5K Mastery Plan */}
        <div className="munich-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 geometric-diamond" style={{ 
            backgroundColor: colors.orange,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold" style={{ color: colors.black }}>
                5K Mastery Program
              </h4>
              <span className="text-xs font-medium px-2 py-1" style={{ 
                backgroundColor: colors.orange,
                color: colors.white 
              }}>
                BESTSELLER
              </span>
            </div>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold" style={{ color: colors.black }}>$49</span>
                <span className="text-lg line-through ml-2" style={{ color: colors.silver }}>$69</span>
                <span className="text-sm ml-2 px-2 py-1" style={{ 
                  backgroundColor: colors.lightGreen,
                  color: colors.white 
                }}>
                  30% OFF
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.darkGreen }}>12-week complete program</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Individual factor assessment</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Progressive base building (4 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Build phase with VO2max work (4 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak/taper phase (4 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Downloadable training log</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Pacing strategy guide</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-primary w-full"
              onClick={() => handlePurchaseClick('5k-mastery', '5K Mastery Plan', 49)}
              disabled={purchasedPlans.some(p => p.id === '5k-mastery')}
            >
              {purchasedPlans.some(p => p.id === '5k-mastery') ? 'Purchased' : 'Get 5K Mastery Plan'}
            </button>
            
            <p className="text-xs text-center mt-2" style={{ color: colors.silver }}>
              Instant download • 30-day money back guarantee
            </p>
          </div>
        </div>

        {/* Marathon Breakthrough Plan */}
        <div className="munich-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 geometric-octagon" style={{ 
            backgroundColor: colors.violet,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <h4 className="text-xl font-bold" style={{ color: colors.black }}>
              Marathon Breakthrough
            </h4>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold" style={{ color: colors.black }}>$97</span>
              </div>
              <p className="text-sm" style={{ color: colors.darkGreen }}>18-week complete program</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Base building phase (8 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Build phase with marathon pace (6 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak and taper (4 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Nutrition and hydration guide</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Race day execution plan</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-secondary w-full"
              onClick={() => handlePurchaseClick('marathon-breakthrough', 'Marathon Breakthrough', 97)}
              disabled={purchasedPlans.some(p => p.id === 'marathon-breakthrough')}
            >
              {purchasedPlans.some(p => p.id === 'marathon-breakthrough') ? 'Purchased' : 'Get Marathon Plan'}
            </button>
          </div>
        </div>

        {/* Custom Coaching Plan */}
        <div className="munich-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 geometric-square" style={{ 
            backgroundColor: colors.yellow,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold" style={{ color: colors.black }}>
                Personal Coaching
              </h4>
              <span className="text-xs font-medium px-2 py-1" style={{ 
                backgroundColor: colors.yellow,
                color: colors.black 
              }}>
                PREMIUM
              </span>
            </div>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold" style={{ color: colors.black }}>$297</span>
                <span className="text-sm ml-1" style={{ color: colors.darkGreen }}>/month</span>
              </div>
              <p className="text-sm" style={{ color: colors.darkGreen }}>One-on-one coaching</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Weekly one-on-one sessions</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Fully customized training plans</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Real-time adjustments</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>24/7 text support</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Race strategy consultation</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-outline w-full"
              onClick={() => handlePurchaseClick('personal-coaching', 'Personal Coaching', 297)}
              disabled={purchasedPlans.some(p => p.id === 'personal-coaching')}
            >
              {purchasedPlans.some(p => p.id === 'personal-coaching') ? 'Active Coaching' : 'Schedule Consultation'}
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="munich-card">
        <div className="munich-card-header">
          <h3 className="text-2xl font-bold" style={{ color: colors.black }}>
            Success Stories
          </h3>
        </div>
        <div className="munich-card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 geometric-diamond mx-auto" style={{ backgroundColor: colors.lightBlue }}></div>
              </div>
              <blockquote className="text-sm mb-4" style={{ color: colors.black }}>
                "The 5K Mastery Program helped me break 20 minutes for the first time in my running career. The individual factor assessment was a game-changer."
              </blockquote>
              <div>
                <div className="font-bold" style={{ color: colors.black }}>Sarah M.</div>
                <div className="text-sm" style={{ color: colors.darkGreen }}>Boston, MA • 19:47 5K PR</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 geometric-octagon mx-auto" style={{ backgroundColor: colors.lightGreen }}></div>
              </div>
              <blockquote className="text-sm mb-4" style={{ color: colors.black }}>
                "After struggling with VDOT for years, the Marathon Breakthrough plan got me to Boston with a 2:58 finish. The pacing strategy was perfect."
              </blockquote>
              <div>
                <div className="font-bold" style={{ color: colors.black }}>Mike T.</div>
                <div className="text-sm" style={{ color: colors.darkGreen }}>Denver, CO • 2:58:23 Boston Qualifier</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 geometric-square mx-auto" style={{ backgroundColor: colors.violet }}></div>
              </div>
              <blockquote className="text-sm mb-4" style={{ color: colors.black }}>
                "Personal coaching transformed my running. Understanding my individual factors made all the difference in my training."
              </blockquote>
              <div>
                <div className="font-bold" style={{ color: colors.black }}>Lisa K.</div>
                <div className="text-sm" style={{ color: colors.darkGreen }}>Portland, OR • Multiple PR athlete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlansSection;
