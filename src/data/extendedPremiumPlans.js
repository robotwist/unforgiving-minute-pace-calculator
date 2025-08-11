/**
 * Extended Premium Training Plans
 * Complete distance coverage: 5K, 10K, Half Marathon, Marathon + Consultation Services
 */

export const extendedPremiumPlans = [
  {
    id: 'consultation-30min',
    name: "30-Minute Personal Consultation",
    description: "Individual assessment, personalized recommendations, and training guidance session",
    category: "consultation",
    distance: "All Distances",
    duration: "30 minutes",
    price: 50,
    
    deliverables: [
      "Individual Factor Assessment (age, experience, biomechanics)",
      "Personalized pace recommendations with explanations", 
      "Training plan overview and phase explanation",
      "Weekly workout samples for your level",
      "Q&A session for specific questions",
      "Follow-up email summary with key points"
    ],
    
    perfectFor: [
      "First-time customers wanting to try our approach",
      "Runners unsure which full plan to choose", 
      "Athletes needing specific guidance on current training",
      "Coaches wanting to understand our methodology"
    ]
  },

  {
    id: '5k-mastery-complete',
    name: "5K Mastery System",
    description: "12-week periodized program for 5K breakthrough performance",
    category: "distance-specific",
    distance: "5K",
    duration: 12,
    weeklyMileage: "35-50",
    price: 49,
    
    phases: {
      base: "Weeks 1-4: Aerobic foundation and injury prevention",
      build: "Weeks 5-8: VO2max development and race pace work",
      peak: "Weeks 9-11: Race simulation and confidence building", 
      taper: "Week 12: Volume reduction with sharpness maintenance"
    },
    
    keyFeatures: [
      "Individual factor assessment and ongoing adjustments",
      "Progressive base building with injury prevention protocols",
      "Advanced VO2max intervals with coaching explanations",
      "Race pace integration and pacing strategy development",
      "Detailed training log with analytics tracking",
      "Alternative workouts for different conditions/equipment"
    ]
  },

  {
    id: '10k-excellence-complete', 
    name: "10K Excellence Program",
    description: "14-week comprehensive program balancing aerobic power and lactate threshold",
    category: "distance-specific",
    distance: "10K", 
    duration: 14,
    weeklyMileage: "40-60",
    price: 67,
    
    phases: {
      base: "Weeks 1-6: Aerobic capacity expansion and movement efficiency",
      threshold: "Weeks 7-10: Lactate threshold development and tempo work",
      peak: "Weeks 11-13: Race pace integration and sharpening",
      taper: "Week 14: Race preparation and confidence building"
    },
    
    keyFeatures: [
      "Extended base phase for optimal aerobic development",
      "Advanced lactate threshold protocols with pacing guidance", 
      "10K-specific race pace work and negative split training",
      "Mental preparation strategies for the challenging middle miles",
      "Fueling strategies for optimal 10K performance",
      "Post-race recovery and next goal planning"
    ]
  },

  {
    id: 'half-marathon-breakthrough-complete',
    name: "Half Marathon Breakthrough", 
    description: "16-week program mastering the balance of speed and endurance",
    category: "distance-specific",
    distance: "Half Marathon",
    duration: 16,
    weeklyMileage: "45-70", 
    price: 82,
    
    phases: {
      base: "Weeks 1-6: Aerobic base with progressive long runs",
      tempo: "Weeks 7-12: Threshold development and tempo progressions",
      peak: "Weeks 13-15: Race pace work and confidence building",
      taper: "Week 16: Final preparation and race strategy"
    },
    
    keyFeatures: [
      "Progressive long run development up to 15+ miles",
      "Advanced tempo work building to 8+ mile continuous tempos",
      "Half marathon pace integration and pacing strategy",
      "Fueling and hydration protocols for 90+ minute efforts",
      "Mental strategies for the challenging miles 8-11",
      "Race day logistics and strategy planning"
    ]
  },

  {
    id: 'marathon-mastery-complete',
    name: "Marathon Mastery Program",
    description: "18-week comprehensive marathon preparation with advanced periodization",
    category: "distance-specific", 
    distance: "Marathon",
    duration: 18,
    weeklyMileage: "50-80",
    price: 97,
    
    phases: {
      base: "Weeks 1-8: Aerobic foundation and injury-resistant fitness",
      build: "Weeks 9-14: Marathon pace integration and long run peaks", 
      peak: "Weeks 15-17: Race simulation and final sharpening",
      taper: "Week 18: Race week preparation and strategy"
    },
    
    keyFeatures: [
      "Progressive long run development up to 22+ miles",
      "Marathon pace work integrated throughout build phase",
      "Advanced fueling and hydration strategy development",
      "Mental preparation for the marathon's unique challenges",
      "Detailed race day execution plan and pacing strategy",
      "Post-marathon recovery protocol and next goal planning"
    ]
  },

  {
    id: 'personal-coaching-monthly',
    name: "Personal Coaching Program",
    description: "Comprehensive monthly coaching with weekly sessions and ongoing support", 
    category: "coaching",
    distance: "All Distances",
    duration: "Ongoing",
    price: 297,
    
    monthlyIncludes: [
      "4 weekly 30-minute one-on-one coaching sessions",
      "Fully customized training plans adapted to your schedule", 
      "Real-time training adjustments based on performance/life",
      "Unlimited email support for questions and guidance",
      "Race strategy development and execution planning",
      "Injury prevention protocols and return-to-training guidance"
    ],
    
    coachingPhilosophy: [
      "Individual factors integration in all training decisions",
      "Sustainable progression respecting life balance",
      "Evidence-based training with practical application",
      "Injury prevention prioritized over aggressive progression",
      "Mental preparation and confidence building emphasis"
    ]
  }
];

// Pricing progression explanation
export const pricingStrategy = {
  consultation: {
    price: 50,
    rationale: "Low barrier entry point, builds trust, leads to plan purchases",
    conversionRate: "Expected 40-60% conversion to full plans",
    revenueModel: "Gateway product + repeat consultation blocks"
  },
  
  plans: {
    "5K": { price: 49, complexity: "Low", duration: 12 },
    "10K": { price: 67, complexity: "Medium", duration: 14 },  
    "HalfMarathon": { price: 82, complexity: "Medium-High", duration: 16 },
    "Marathon": { price: 97, complexity: "High", duration: 18 }
  },
  
  coaching: {
    price: 297,
    rationale: "Premium service with high touch, 4 sessions monthly", 
    value: "Equivalent to $75/session which is competitive for expert coaching"
  }
};

export default extendedPremiumPlans;
