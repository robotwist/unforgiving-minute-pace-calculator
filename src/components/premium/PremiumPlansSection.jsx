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
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold" style={{ color: colors.black }}>
          Premium Training Plans
        </h2>
        <p className="text-xl" style={{ color: colors.darkGreen }}>
          Comprehensive, professionally-designed training programs for serious athletes
        </p>
      </div>

      {/* Who am I? Section */}
      <div className="munich-card" style={{ background: `linear-gradient(135deg, ${colors.yellow}10, ${colors.lightBlue}10)` }}>
        <div className="munich-card-body text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
            Who am I?
          </h3>
          <div className="max-w-2xl mx-auto text-base" style={{ color: colors.black }}>
            <p className="mb-2 font-medium">Rob Wistrand — Head Coach, Founder, and Athlete</p>
            <p className="mb-2">I started running as soon as I could walk, and my dad mowed a track in our yard right after he showed me a mechanical stopwatch, and I wanted to see if I could run around the track faster than it could mechanically tick around once. I did it, and I asked my parents to time me incessantly. It was a mild obsession, but I had a bunch of them. The first race I remember had more to do with falling than anything at Meadows Elementary in Madison, Wisconsin. My first win was a race at Lake Atalanta when I was in second grade. After that, I placed 8th in the National AAU Championships as a fourth grader. As a fifth grader I ran 4:48 for the 1500 and 10:18 for the 3000, which got me a national champion runner-up at the AAU Nationals in San Antonio, right behind future national-class runner Steve Fein. In 7th grade I broke the 5-minute mile, which is 1609 meters, not the assumed 1600 meters. In 9th grade, I finished in 5th place for the largest classification in the state meet for cross country. I finished in the top 10 for the freshman-sophomore race at the Foot Locker Regional XC Champs. I ended up being a five-time individual state champion by the time I graduated high school and still hold the 800-meter record for my high school almost 30 years later. My letter jacket ran out of room for patches. I ran for the winningest team in all of D1 collegiate sports under the most legendary coach in all of coaching history. I suffered a career-ending injury/illness in the fall of my sophomore year. I went on to coach multiple state champions, age-group champions, race winners, a few who went on to be All-Americans, professionals, and Olympic Trials and national place-winners. I love coaching and have an instinctual knack for what really works. I coach with that uncanny desire that those who have unfinished business do, who love the sport with an innate passion, and who generally enjoy and love seeing people grow and succeed. Running and coaching are the vehicles through which I see people growing and transcending physically, mentally, and spiritually. I really look forward to coaching you and watching you grow and overcome big obstacles to become a better person.</p>
          </div>
        </div>
      </div>

      {/* Why Personal Coaching / IFTS Value Section */}
      <div className="munich-card" style={{ background: `linear-gradient(135deg, ${colors.lightGreen}10, ${colors.violet}10)` }}>
        <div className="munich-card-body text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
            Why Personal Coaching?
          </h3>
          <div className="max-w-2xl mx-auto text-base" style={{ color: colors.black }}>
            <p className="mb-2 font-medium">The IFTS System: Individual Factor Training Synthesis</p>
            <p className="mb-2">Most plans treat you like a number. Our IFTS system is different: it’s a dynamic, science-based approach that adapts to <span className="font-bold">your</span> age, experience, recovery, and goals. We analyze your unique profile and build a plan that evolves with you — not just a template, but a living roadmap.</p>
            <p className="mb-2">With personal coaching, you get real-time adjustments, direct access to your coach, and a partnership focused on your long-term growth. This is the gold standard for athletes who want more than a generic plan — it’s for those who want to maximize their potential, avoid injury, and enjoy the journey.</p>
            <p className="mb-2">If you’re ready for a truly individualized experience, personal coaching is the fastest, safest, and most rewarding path to your goals.</p>
          </div>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 30-Minute Consultation */}
        <div className="munich-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 geometric-diamond" style={{ 
            backgroundColor: colors.lightBlue,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold" style={{ color: colors.black }}>
                30-Min Consultation
              </h4>
              <span className="text-xs font-medium px-2 py-1" style={{ 
                backgroundColor: colors.lightBlue,
                color: colors.white 
              }}>
                STARTER
              </span>
            </div>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold" style={{ color: colors.black }}>$50</span>
              </div>
              <p className="text-sm" style={{ color: colors.darkGreen }}>Per session</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Individual assessment & analysis</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Personalized pace recommendations</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Training plan explanation</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Q&A and guidance</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Weekly workout samples</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-primary w-full"
              onClick={() => handleConsultationClick('consultation-30min', '30-Min Consultation', 50)}
            >
              Book Session
            </button>
            
            <p className="text-xs text-center mt-2" style={{ color: colors.silver }}>
              Perfect for getting started • Can purchase multiple
            </p>
          </div>
        </div>

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

        {/* 10K Excellence Plan */}
        <div className="munich-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 geometric-octagon" style={{ 
            backgroundColor: colors.lightGreen,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <h4 className="text-xl font-bold" style={{ color: colors.black }}>
              10K Excellence
            </h4>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold" style={{ color: colors.black }}>$67</span>
              </div>
              <p className="text-sm" style={{ color: colors.darkGreen }}>14-week complete program</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Base building phase (6 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Lactate threshold development (4 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak and race prep (4 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Advanced pacing strategies</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Mental preparation guide</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-secondary w-full"
              onClick={() => handlePurchaseClick('10k-excellence', '10K Excellence', 67)}
              disabled={purchasedPlans.some(p => p.id === '10k-excellence')}
            >
              {purchasedPlans.some(p => p.id === '10k-excellence') ? 'Purchased' : 'Get 10K Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Second Row - Half Marathon & Marathon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Half Marathon Breakthrough */}
        <div className="munich-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-8 h-8 geometric-square" style={{ 
            backgroundColor: colors.violet,
            opacity: 0.8
          }}></div>
          
          <div className="munich-card-header">
            <h4 className="text-xl font-bold" style={{ color: colors.black }}>
              Half Marathon Breakthrough
            </h4>
          </div>
          
          <div className="munich-card-body">
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold" style={{ color: colors.black }}>$82</span>
              </div>
              <p className="text-sm" style={{ color: colors.darkGreen }}>16-week complete program</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Aerobic base development (6 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Tempo and threshold work (6 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Peak phase and taper (4 weeks)</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Fueling and hydration strategy</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Long run progression guide</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-secondary w-full"
              onClick={() => handlePurchaseClick('half-marathon-breakthrough', 'Half Marathon Breakthrough', 82)}
              disabled={purchasedPlans.some(p => p.id === 'half-marathon-breakthrough')}
            >
              {purchasedPlans.some(p => p.id === 'half-marathon-breakthrough') ? 'Purchased' : 'Get Half Marathon Plan'}
            </button>
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
              <p className="text-sm" style={{ color: colors.darkGreen }}>Comprehensive coaching program</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>4 weekly coaching sessions (30 min)</span>
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
                <span className="ml-2" style={{ color: colors.black }}>Unlimited email support</span>
              </li>
              <li className="flex items-start">
                <span style={{ color: colors.lightBlue }}>✓</span>
                <span className="ml-2" style={{ color: colors.black }}>Race strategy consultation</span>
              </li>
            </ul>
            
            <button 
              className="munich-btn munich-btn-outline w-full"
              onClick={() => handleConsultationClick('personal-coaching', 'Personal Coaching', 297)}
              disabled={false}
            >
              {purchasedPlans.some(p => p.id === 'personal-coaching') ? 'Schedule Session' : 'Schedule Consultation'}
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

      {/* How It Works Section */}
      <div className="munich-card" style={{ background: `linear-gradient(135deg, ${colors.lightBlue}10, ${colors.lightGreen}10)` }}>
        <div className="munich-card-body text-center">
          <h3 className="text-2xl font-bold mb-6" style={{ color: colors.black }}>
            How Our System Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 geometric-diamond mx-auto mb-4" style={{ backgroundColor: colors.lightBlue }}></div>
              <h4 className="font-bold mb-2" style={{ color: colors.black }}>1. Start with Consultation</h4>
              <p className="text-sm" style={{ color: colors.darkGreen }}>
                Book a $50 session to get personalized assessment and understand your training needs. 
                Perfect for testing our approach.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 geometric-octagon mx-auto mb-4" style={{ backgroundColor: colors.lightGreen }}></div>
              <h4 className="font-bold mb-2" style={{ color: colors.black }}>2. Choose Your Distance</h4>
              <p className="text-sm" style={{ color: colors.darkGreen }}>
                Ready for a complete program? Select from 5K ($49) to Marathon ($97). 
                Each includes detailed daily workouts and coaching guidance.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 geometric-square mx-auto mb-4" style={{ backgroundColor: colors.violet }}></div>
              <h4 className="font-bold mb-2" style={{ color: colors.black }}>3. Upgrade or Continue</h4>
              <p className="text-sm" style={{ color: colors.darkGreen }}>
                Need ongoing support? Continue with consultation blocks or upgrade to 
                monthly coaching for comprehensive guidance.
              </p>
            </div>
          </div>
          <div className="mt-6 p-4" style={{ backgroundColor: `${colors.lightBlue}20`, borderRadius: '12px' }}>
            <p className="font-medium" style={{ color: colors.black }}>
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
