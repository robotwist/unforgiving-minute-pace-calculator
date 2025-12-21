import React, { useState } from 'react';
import CalendlyModal from '../consultation/CalendlyModal';

const PremiumPlansSection = ({ 
  colors, 
  handlePurchaseClick, 
  purchasedPlans 
}) => {
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);

  const handleConsultationClick = (planId, planName, price) => {
    // If user already has the coaching plan, open Calendly directly
    if (purchasedPlans.some(p => p.id === 'personal-coaching')) {
      setIsCalendlyModalOpen(true);
    } else {
      // Otherwise, proceed with purchase flow
      handlePurchaseClick(planId, planName, price);
    }
  };
  return (
    <div className="space-y-16 um-hero-winter">
      <div className="um-text-center um-rhythm-lg relative z-10 um-mb-16">
        <h2 className="um-text-3xl um-sm-text-4xl um-lg-text-5xl um-font-black um-leading-none um-tracking-tight" style={{ color: colors.black }}>
          Premium Training Plans
        </h2>
        <p className="um-text-lg um-sm-text-xl um-lg-text-2xl um-font-medium um-leading-relaxed max-w-3xl um-mx-auto" style={{ color: colors.darkGreen }}>
          Comprehensive, professionally-designed training programs for serious athletes
        </p>
        <a
          href="/apply"
          className="inline-flex um-items-center um-justify-center um-px-10 um-py-5 um-text-xl um-font-bold um-border-2 um-rounded-lg transition-all duration-200"
          style={{ 
            borderColor: colors.lightGreen, 
            color: colors.lightGreen, 
            backgroundColor: 'transparent',
            boxShadow: `0 4px 14px ${colors.lightGreen}40`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${colors.lightGreen}50`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 4px 14px ${colors.lightGreen}40`;
          }}
          aria-label="Apply for coaching"
        >
          Apply for coaching
        </a>
      </div>

      {/* Trust Indicators / Social Proof */}
      <div className="um-grid um-grid-cols-1 um-md-grid-cols-3 um-gap-6 um-mb-16">
        <div className="um-text-center um-p-6" style={{ backgroundColor: `${colors.lightBlue}10` }}>
          <div className="um-text-4xl um-sm-text-5xl um-font-black um-mb-2" style={{ color: colors.lightBlue }}>100%</div>
          <div className="um-text-lg um-font-semibold" style={{ color: colors.black }}>Personalized</div>
          <div className="um-text-sm um-mt-1" style={{ color: colors.darkGreen }}>Every plan tailored to you</div>
        </div>
        <div className="um-text-center um-p-6" style={{ backgroundColor: `${colors.lightGreen}10` }}>
          <div className="um-text-4xl um-sm-text-5xl um-font-black um-mb-2" style={{ color: colors.lightGreen }}>Elite-Tested</div>
          <div className="um-text-lg um-font-semibold" style={{ color: colors.black }}>Training System</div>
          <div className="um-text-sm um-mt-1" style={{ color: colors.darkGreen }}>Based on proven science</div>
        </div>
        <div className="um-text-center um-p-6" style={{ backgroundColor: `${colors.violet}10` }}>
          <div className="um-text-4xl um-sm-text-5xl um-font-black um-mb-2" style={{ color: colors.violet }}>1-on-1</div>
          <div className="um-text-lg um-font-semibold" style={{ color: colors.black }}>Coaching Available</div>
          <div className="um-text-sm um-mt-1" style={{ color: colors.darkGreen }}>Direct access to your coach</div>
        </div>
      </div>

      {/* Who am I? Section */}
      <div className="munich-card um-mb-16" style={{ background: `linear-gradient(135deg, ${colors.yellow}10, ${colors.lightBlue}10)` }}>
        <div className="munich-card-body um-text-center">
          <h3 className="um-text-3xl um-sm-text-4xl um-font-black um-mb-4" style={{ color: colors.black, lineHeight: '1.2' }}>
            Your Coach
          </h3>
          <div className="max-w-3xl um-mx-auto um-text-lg um-sm-text-xl space-y-4 leading-relaxed" style={{ color: colors.black }}>
            <p className="mb-2 um-font-medium">Rob Wistrand — Coach, founder, and lifelong athlete</p>
            <p className="mb-2">
              I grew up obsessed with the clock—first as a kid with a stopwatch, later as an athlete chasing the edge of what I thought was possible.
              That obsession became a system: how to train with intention, recover well, and show up when it matters.
            </p>
            <p className="mb-2">
              I’ve lived the whole arc: early breakthroughs, big stages, big setbacks, and the hard reset. When my own career got cut short, I moved into coaching
              and focused on the part I care about most: helping the right athletes build durable fitness and race with confidence.
            </p>
            <p className="mb-2">
              My approach is simple: clear communication, individualized pacing, and consistent execution. The calculator and plans in this app are a sample of how I think—
              the real value is the relationship and the weekly adjustments based on <em>your</em> life, feedback, and progress.
            </p>
          </div>
        </div>
      </div>

      {/* Why Personal Coaching / IFTS Value Section */}
      <div className="munich-card um-mb-16" style={{ background: `linear-gradient(135deg, ${colors.lightGreen}10, ${colors.violet}10)` }}>
        <div className="munich-card-body um-text-center">
          <h3 className="um-text-3xl um-sm-text-4xl um-font-black um-mb-6" style={{ color: colors.black, lineHeight: '1.2' }}>
            Why Personal Coaching?
          </h3>
          <div className="max-w-3xl um-mx-auto um-text-lg um-sm-text-xl space-y-4" style={{ color: colors.black, lineHeight: '1.6' }}>
            <p className="mb-2 um-font-medium">The IFTS System: Individual Factor Training Synthesis</p>
            <p className="mb-2">Most plans treat you like a number. Our IFTS system is different: it’s a dynamic, science-based approach that adapts to <span className="um-font-bold">your</span> age, experience, recovery, and goals. We analyze your unique profile and build a plan that evolves with you — not just a template, but a living roadmap.</p>
            <p className="mb-2">With personal coaching, you get real-time adjustments, direct access to your coach, and a partnership focused on your long-term growth. This is the gold standard for athletes who want more than a generic plan — it’s for those who want to maximize their potential, avoid injury, and enjoy the journey.</p>
            <p className="mb-2">If you’re ready for a truly individualized experience, personal coaching is the fastest, safest, and most rewarding path to your goals.</p>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="munich-card um-mb-16" style={{ background: `linear-gradient(135deg, ${colors.lightBlue}10, ${colors.lightGreen}10)` }}>
        <div className="munich-card-body um-text-center">
          <h3 className="um-text-3xl um-sm-text-4xl um-font-black um-mb-8" style={{ color: colors.black, lineHeight: '1.2' }}>
            Why Premium Plans?
          </h3>
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-3 um-gap-6">
            <div>
              <div className="w-12 um-h-12 geometric-diamond um-mx-auto um-mb-3" style={{ backgroundColor: colors.lightBlue }}></div>
              <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>Individual Factor Integration</h4>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                Plans adjusted for your age, experience, and recovery capacity
              </p>
            </div>
            <div>
              <div className="w-12 um-h-12 geometric-octagon um-mx-auto um-mb-3" style={{ backgroundColor: colors.lightGreen }}></div>
              <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>Race-Specific Training</h4>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                Goal and current pace integration for optimal training stimulus
              </p>
            </div>
            <div>
              <div className="w-12 um-h-12 geometric-square um-mx-auto um-mb-3" style={{ backgroundColor: colors.violet }}></div>
              <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>Professional Coaching</h4>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                Designed by certified coaches with proven track records
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Plans Grid */}
      <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-lg-grid-cols-4 um-gap-6">
        
        {/* 30-Minute Consultation */}
        <div className="munich-card um-relative um-overflow-hidden group">
          <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-diamond" style={{ 
            backgroundColor: colors.lightBlue,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <div className="um-flex um-items-center um-justify-between">
              <h4 className="um-text-xl um-font-bold" style={{ color: colors.black }}>
                30-Min Consultation
              </h4>
              <span className="um-text-xs um-font-medium px-2 py-1" style={{ 
                backgroundColor: colors.lightBlue,
                color: colors.white 
              }}>
                STARTER
              </span>
            </div>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="um-flex items-baseline">
                <span className="um-text-3xl um-font-bold" style={{ color: colors.black }}>$50</span>
              </div>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>Per session</p>
            </div>
            
            <ul className="space-y-2 um-mb-6 um-text-sm">
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Individual assessment & analysis</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Personalized pace recommendations</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Training plan explanation</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Q&A and guidance</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Weekly workout samples</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-primary um-w-full"
              onClick={() => handleConsultationClick('consultation-30min', '30-Min Consultation', 50)}
            >
              Book Session
            </button>
            
            <p className="um-text-xs um-text-center um-mt-2" style={{ color: colors.silver }}>
              Perfect for getting started • Can purchase multiple
            </p>
          </div>
        </div>

        {/* 5K Mastery Plan */}
        <div className="munich-card um-relative um-overflow-hidden group">
          <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-diamond" style={{ 
            backgroundColor: colors.orange,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <div className="um-flex um-items-center um-justify-between">
              <h4 className="um-text-xl um-font-bold" style={{ color: colors.black }}>
                5K Mastery Program
              </h4>
              <span className="um-text-xs um-font-medium px-2 py-1" style={{ 
                backgroundColor: colors.orange,
                color: colors.white 
              }}>
                BESTSELLER
              </span>
            </div>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="um-flex items-baseline">
                <span className="um-text-3xl um-font-bold" style={{ color: colors.black }}>$49</span>
                <span className="um-text-lg line-through ml-2" style={{ color: colors.silver }}>$69</span>
                <span className="um-text-sm ml-2 px-2 py-1" style={{ 
                  backgroundColor: colors.lightGreen,
                  color: colors.white 
                }}>
                  30% OFF
                </span>
              </div>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>12-week complete program</p>
            </div>
            
            <ul className="space-y-2 um-mb-6 um-text-sm">
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Individual factor assessment</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Progressive base building (4 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Build phase with VO2max work (4 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak/taper phase (4 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Downloadable training log</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Pacing strategy guide</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-primary um-w-full"
              onClick={() => handlePurchaseClick('5k-mastery', '5K Mastery Plan', 49)}
              disabled={purchasedPlans.some(p => p.id === '5k-mastery')}
            >
              {purchasedPlans.some(p => p.id === '5k-mastery') ? 'Purchased' : 'Get 5K Mastery Plan'}
            </button>
            
            <p className="um-text-xs um-text-center um-mt-2" style={{ color: colors.silver }}>
              Instant download • 30-day money back guarantee
            </p>
          </div>
        </div>

        {/* 10K Excellence Plan */}
        <div className="munich-card um-relative um-overflow-hidden group">
          <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-octagon" style={{ 
            backgroundColor: colors.lightGreen,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <h4 className="um-text-xl um-font-bold" style={{ color: colors.black }}>
              10K Excellence
            </h4>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="um-flex items-baseline">
                <span className="um-text-3xl um-font-bold" style={{ color: colors.black }}>$67</span>
              </div>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>14-week complete program</p>
            </div>
            
            <ul className="space-y-2 um-mb-6 um-text-sm">
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Base building phase (6 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Lactate threshold development (4 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak and race prep (4 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Advanced pacing strategies</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Mental preparation guide</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-secondary um-w-full"
              onClick={() => handlePurchaseClick('10k-excellence', '10K Excellence', 67)}
              disabled={purchasedPlans.some(p => p.id === '10k-excellence')}
            >
              {purchasedPlans.some(p => p.id === '10k-excellence') ? 'Purchased' : 'Get 10K Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Second Row - Half Marathon & Marathon */}
      <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-lg-grid-cols-3 um-gap-6">
        
        {/* Half Marathon Breakthrough */}
        <div className="munich-card um-relative um-overflow-hidden group">
          <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-square" style={{ 
            backgroundColor: colors.violet,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <h4 className="um-text-xl um-font-bold" style={{ color: colors.black }}>
              Half Marathon Breakthrough
            </h4>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="um-flex items-baseline">
                <span className="um-text-3xl um-font-bold" style={{ color: colors.black }}>$82</span>
              </div>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>16-week complete program</p>
            </div>
            
            <ul className="space-y-2 um-mb-6 um-text-sm">
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Aerobic base development (6 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Tempo and threshold work (6 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak phase and taper (4 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Fueling and hydration strategy</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Long run progression guide</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-secondary um-w-full"
              onClick={() => handlePurchaseClick('half-marathon-breakthrough', 'Half Marathon Breakthrough', 82)}
              disabled={purchasedPlans.some(p => p.id === 'half-marathon-breakthrough')}
            >
              {purchasedPlans.some(p => p.id === 'half-marathon-breakthrough') ? 'Purchased' : 'Get Half Marathon Plan'}
            </button>
          </div>
        </div>

        {/* Marathon Breakthrough Plan */}
        <div className="munich-card um-relative um-overflow-hidden group">
          <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-octagon" style={{ 
            backgroundColor: colors.violet,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <h4 className="um-text-xl um-font-bold" style={{ color: colors.black }}>
              Marathon Breakthrough
            </h4>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="um-flex items-baseline">
                <span className="um-text-3xl um-font-bold" style={{ color: colors.black }}>$97</span>
              </div>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>18-week complete program</p>
            </div>
            
            <ul className="space-y-2 um-mb-6 um-text-sm">
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Base building phase (8 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Build phase with marathon pace (6 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak and taper (4 weeks)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Nutrition and hydration guide</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Race day execution plan</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-secondary um-w-full"
              onClick={() => handlePurchaseClick('marathon-breakthrough', 'Marathon Breakthrough', 97)}
              disabled={purchasedPlans.some(p => p.id === 'marathon-breakthrough')}
            >
              {purchasedPlans.some(p => p.id === 'marathon-breakthrough') ? 'Purchased' : 'Get Marathon Plan'}
            </button>
          </div>
        </div>

        {/* Custom Coaching Plan */}
        <div className="munich-card um-relative um-overflow-hidden group">
          <div className="um-absolute top-0 right-0 um-w-8 um-h-8 geometric-square" style={{ 
            backgroundColor: colors.yellow,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <div className="um-flex um-items-center um-justify-between">
              <h4 className="um-text-xl um-font-bold" style={{ color: colors.black }}>
                Personal Coaching
              </h4>
              <span className="um-text-xs um-font-medium px-2 py-1" style={{ 
                backgroundColor: colors.yellow,
                color: colors.black 
              }}>
                PREMIUM
              </span>
            </div>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="um-flex items-baseline">
                <span className="um-text-3xl um-font-bold" style={{ color: colors.black }}>$297</span>
                <span className="um-text-sm ml-1" style={{ color: colors.darkGreen }}>/month</span>
              </div>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>Comprehensive coaching program</p>
            </div>
            
            <ul className="space-y-2 um-mb-6 um-text-sm">
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>4 weekly coaching sessions (30 min)</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Fully customized training plans</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Real-time adjustments</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Unlimited email support</span>
              </li>
              <li className="um-flex um-items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Race strategy consultation</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-outline um-w-full"
              onClick={() => handleConsultationClick('personal-coaching', 'Personal Coaching', 297)}
              disabled={false}
            >
              {purchasedPlans.some(p => p.id === 'personal-coaching') ? 'Schedule Session' : 'Schedule Consultation'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Stories section removed - will add back when athlete feedback is gathered */}

      {/* How It Works Section */}
      <div className="munich-card um-mb-16" style={{ background: `linear-gradient(135deg, ${colors.lightBlue}10, ${colors.lightGreen}10)` }}>
        <div className="munich-card-body um-text-center">
          <h3 className="um-text-3xl um-sm-text-4xl um-font-black um-mb-10" style={{ color: colors.black, lineHeight: '1.2' }}>
            How Our System Works
          </h3>
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-3 um-gap-8">
            <div>
              <div className="w-16 um-h-16 geometric-diamond um-mx-auto um-mb-4" style={{ backgroundColor: colors.lightBlue }}></div>
              <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>1. Start with Consultation</h4>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                Book a $50 session to get personalized assessment and understand your training needs. 
                Perfect for testing our approach.
              </p>
            </div>
            <div>
              <div className="w-16 um-h-16 geometric-octagon um-mx-auto um-mb-4" style={{ backgroundColor: colors.lightGreen }}></div>
              <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>2. Choose Your Distance</h4>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                Ready for a complete program? Select from 5K ($49) to Marathon ($97). 
                Each includes detailed daily workouts and coaching guidance.
              </p>
            </div>
            <div>
              <div className="w-16 um-h-16 geometric-square um-mx-auto um-mb-4" style={{ backgroundColor: colors.violet }}></div>
              <h4 className="um-font-bold um-mb-2" style={{ color: colors.black }}>3. Upgrade or Continue</h4>
              <p className="um-text-sm" style={{ color: colors.darkGreen }}>
                Need ongoing support? Continue with consultation blocks or upgrade to 
                monthly coaching for comprehensive guidance.
              </p>
            </div>
          </div>
          <div className="mt-6 um-p-4 um-radius-md" style={{ backgroundColor: `${colors.lightBlue}20` }}>
            <p className="um-font-medium" style={{ color: colors.black }}>
              💡 Try Before You Commit: Start with a $50 consultation to experience our personalized approach
            </p>
          </div>
        </div>
      </div>

      {/* Calendly Modal */}
      <CalendlyModal 
        isOpen={isCalendlyModalOpen}
        onClose={() => setIsCalendlyModalOpen(false)}
        colors={colors}
      />
    </div>
  );
};

export default PremiumPlansSection;
