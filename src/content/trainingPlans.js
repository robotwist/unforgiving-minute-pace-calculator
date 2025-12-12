// Premium training plans content - separated from UI
export const trainingPlans = [
  {
    id: '5k-mastery',
    name: '5K Mastery Program',
    badge: 'BESTSELLER',
    badgeColor: 'orange',
    price: 49,
    originalPrice: 69,
    discount: '30% OFF',
    duration: '12-week complete program',
    description: 'Break through your 5K plateau with individualized pacing and progressive training phases.',
    features: [
      'Individual factor assessment',
      'Progressive base building (4 weeks)',
      'Build phase with VO2max work (4 weeks)',
      'Peak/taper phase (4 weeks)',
      'Downloadable training log',
      'Pacing strategy guide',
      'Weekly progression tracking',
      'Race day nutrition plan'
    ],
    buttonText: 'Get 5K Mastery Plan',
    guarantee: '30-day money back guarantee'
  },
  
  {
    id: 'marathon-breakthrough',
    name: 'Marathon Breakthrough',
    badge: null,
    price: 97,
    originalPrice: null,
    duration: '18-week complete program',
    description: 'Complete marathon training system with personalized pacing for your first sub-3:30 or PR attempt.',
    features: [
      'Base building phase (8 weeks)',
      'Build phase with tempo work (6 weeks)',
      'Peak phase with race simulation (3 weeks)',
      'Taper strategy (1 week)',
      'Individual factor adjustments',
      'Weekly long run progressions',
      'Carb loading protocol',
      'Post-race recovery plan'
    ],
    buttonText: 'Get Marathon Program',
    guarantee: '30-day money back guarantee'
  },
  
  {
    id: 'personal-coaching',
    name: 'Personal Coaching',
    badge: 'PREMIUM',
    badgeColor: 'yellow',
    price: 297,
    priceFrequency: '/month',
    duration: 'One-on-one coaching',
    description: 'Work directly with certified coaches who understand individual factors and personalized training.',
    features: [
      'Weekly one-on-one sessions',
      'Fully customized training plans',
      'Real-time adjustments',
      '24/7 text support',
      'Race strategy consultation',
      'Injury prevention guidance',
      'Nutrition periodization',
      'Mental training techniques'
    ],
    buttonText: 'Schedule Consultation',
    isSubscription: true
  }
];

export const getTrainingPlanById = (id) => {
  return trainingPlans.find(plan => plan.id === id);
};

export const getPopularPlans = () => {
  return trainingPlans.filter(plan => plan.badge === 'BESTSELLER');
};


