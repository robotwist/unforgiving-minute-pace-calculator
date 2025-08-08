import React, { useState, useEffect } from 'react';
import { Calculator, Download, Target, Clock, TrendingUp, User, BookOpen, Star, Calendar, Activity, Trophy, CheckCircle } from 'lucide-react';
// import ArticleCard from './blog/ArticleCard';
// import ArticleModal from './blog/ArticleModal';
// import { articles, getFeaturedArticles } from '../content/articles';
// import { trainingPlans } from '../content/trainingPlans';

const RunningTrainingApp = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [raceTime, setRaceTime] = useState('');
  const [raceDistance, setRaceDistance] = useState('5K');
  const [goldenPace, setGoldenPace] = useState(null);
  const [trainingPaces, setTrainingPaces] = useState(null);
  const [userProfile, setUserProfile] = useState({ 
    name: '', 
    email: '', 
    experience: 'beginner',
    goalRaceDistance: '5K',
    goalRaceTime: '',
    weeklyMileage: '',
    injuryHistory: '',
    preferredUnits: 'imperial',
    currentGoldenPace: null,
    goldenPaceHistory: [],
    projectedGoldenPace: null,
    trainingStartDate: null
  });
  const [profileError, setProfileError] = useState('');
  const [showProfileDashboard, setShowProfileDashboard] = useState(false);
  const [savedProfileData, setSavedProfileData] = useState(null);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [personalBests, setPersonalBests] = useState({});
  const [trainingPlansCompleted, setTrainingPlansCompleted] = useState([]);
  
  // Purchase and premium plan state
  const [purchasedPlans, setPurchasedPlans] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Training log form state
  const [showTrainingLogForm, setShowTrainingLogForm] = useState(false);
  const [trainingLogData, setTrainingLogData] = useState({
    type: 'Easy Run',
    distance: '',
    time: '',
    feeling: 'Good',
    effort: 'Easy',
    notes: '',
    weather: '',
    location: ''
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('runningProfile');
    const savedHistory = localStorage.getItem('trainingHistory');
    const savedPBs = localStorage.getItem('personalBests');
    const savedPlans = localStorage.getItem('completedPlans');
    const savedPurchases = localStorage.getItem('purchasedPlans');
    
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setSavedProfileData(profileData);
      setUserProfile(profileData);
      
      // If profile exists, show dashboard by default
      setShowProfileDashboard(true);
    }
    
    if (savedHistory) {
      setTrainingHistory(JSON.parse(savedHistory));
    }
    
    if (savedPBs) {
      setPersonalBests(JSON.parse(savedPBs));
    }
    
    if (savedPlans) {
      setTrainingPlansCompleted(JSON.parse(savedPlans));
    }
    
    if (savedPurchases) {
      setPurchasedPlans(JSON.parse(savedPurchases));
    }
  }, []);

  // Save profile data to localStorage
  const saveProfileData = (profileData) => {
    localStorage.setItem('runningProfile', JSON.stringify(profileData));
    setSavedProfileData(profileData);
  };

  // Add training session to history
  const addTrainingSession = (session) => {
    const newSession = {
      ...session,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      goldenPace: goldenPace
    };
    
    const updatedHistory = [...trainingHistory, newSession];
    setTrainingHistory(updatedHistory);
    localStorage.setItem('trainingHistory', JSON.stringify(updatedHistory));
  };

  // Update personal best
  const updatePersonalBest = (distance, time) => {
    const updatedPBs = {
      ...personalBests,
      [distance]: time
    };
    setPersonalBests(updatedPBs);
    localStorage.setItem('personalBests', JSON.stringify(updatedPBs));
  };

  // Mark training plan as completed
  const completeTrainingPlan = (planName) => {
    const completedPlan = {
      name: planName,
      completedDate: new Date().toISOString().split('T')[0],
      goldenPaceAtCompletion: goldenPace
    };
    
    const updatedPlans = [...trainingPlansCompleted, completedPlan];
    setTrainingPlansCompleted(updatedPlans);
    localStorage.setItem('completedPlans', JSON.stringify(updatedPlans));
  };

  // Use global Munich 1972 CSS variables for consistent design system
  const colors = {
    lightBlue: '#1E6B96',      // Munich light blue (primary)
    lightGreen: '#2E8B57',     // Munich green 
    silver: '#C0C0C0',         // Munich silver
    violet: '#8B7FC7',         // Munich violet
    darkGreen: '#004225',      // Munich dark green
    orange: '#FF6B35',         // Munich orange (energy)
    yellow: '#F7931E',         // Munich yellow
    white: darkMode ? '#1A1A1A' : '#FFFFFF',          // Adaptive white/dark
    black: darkMode ? '#E5E5E5' : '#1A1A1A',          // Adaptive black/light
    gray: darkMode ? '#2D2D2D' : '#F5F5F5',           // Adaptive background
    border: darkMode ? '#404040' : '#E1E5E9'          // Adaptive border
  };

  // Articles data structure
  const articles = [
    {
      id: 1,
      title: "Why VDOT Doesn't Work: The Science Behind Better Training",
      excerpt: "Research shows VDOT underestimates VO2max and mispredicts training paces for most runners. Here's what elite coaches do instead.",
      readTime: "8 min read",
      category: "Training Science",
      featured: true,
      content: `
# Why VDOT Doesn't Work: The Science Behind Better Training

        {/* Premium Training Plans Section - Munich 1972 Design */}

This misalignment can lead to real-world consequences: workouts that are too easy to stimulate adaptation or too hard to recover from. For the recreational runner, VDOT may suggest interval sessions that fail to elicit peak aerobic demand. For the competitive runner, it may push threshold sessions into anaerobic territory, sabotaging endurance development.

## Enter Brad Hudson: Adaptive and Specific Beats Prescriptive

Brad Hudson's training philosophy revolves around the simple idea that no one-size-fits-all training plan can capture the variability of real athletes. In his book *Run Faster*, Hudson outlines an adaptive model that:

* Divides training into **general preparation** and **race-specific phases**.
* Emphasizes **responsiveness to athlete feedback**, not adherence to static paces.
* Encourages **goal-pace specificity** in the final 4-6 weeks before a target race.

He writes, "Anything more than 10% off pace lacks specific endurance." In other words, if you're running your reps 30 seconds faster or slower than race pace, you're not training for your race—you're just training.

This is a key insight for our philosophy. Rather than relying on a generic Interval pace calculated by VDOT, we tailor reps to align with each athlete's actual race performance, recent data, and physiological response.

## Lessons from the Oregon System: Balance, Variation, Intelligence

Bill Dellinger and Bill Bowerman, architects of the famed Oregon system, knew that running success wasn't just about grinding out miles. Their method emphasized:

* **Alternating hard and easy days** to optimize recovery.
* **Progressive overload** with ample room for adaptation.
* **Race-pace integration**, especially during peak periods.

Bowerman once said, "The idea that the harder you work, the better you get is just garbage. The greatest improvement is made by the man who works most intelligently."

This wisdom speaks to the heart of our approach. Smart training doesn't just avoid burnout—it accelerates progress.

## Modern Voices and Community Insights

Even outside academic circles, runners are calling for change. In Reddit forums like r/AdvancedRunning and r/Running, athletes express skepticism about VDOT's one-size-fits-all model. Comments like "VDOT doesn't account for weight, economy, or mental strength" and "It predicts times but lacks nuance" are common.

As GPS watches become more advanced, many runners notice discrepancies between VDOT predictions and actual performance. These observations confirm what science already suggests: formulas are helpful, but incomplete.

## How Unforgiving Minute Trains Smarter

Here's how we do it differently:

1. **Race-Based Calibration**: We anchor workouts to your actual race data, not just recent time trials.
2. **Adjustable Pace Targets**: Interval and Repetition paces are tailored based on your strengths and goals.
3. **Adaptation > Prescription**: We update your plan weekly based on performance, feedback, and life events.
      `
    },
    {
      id: 2,
      title: "The Art of Recovery: Why Easy Days Make Hard Days Possible",
      excerpt: "Elite athletes spend 80% of their time running easy. Learn the physiological and psychological benefits of proper recovery running.",
      readTime: "6 min read",
      category: "Recovery",
      featured: true,
      content: `
# The Art of Recovery: Why Easy Days Make Hard Days Possible

Recovery is not the absence of training—it's training at its most fundamental level. When elite athletes run easy, they're developing the aerobic engine that powers breakthrough performances.

## The 80/20 Rule in Action

Research consistently shows that world-class endurance athletes train approximately 80% of their volume at low intensity and 20% at moderate to high intensity. This isn't arbitrary—it's physiologically optimal.

### Aerobic Base Development

Easy running:
* Increases mitochondrial density
* Improves capillarization
* Enhances fat oxidation
* Builds cardiac stroke volume

### Active Recovery Benefits

Beyond adaptation, easy running provides:
* Enhanced blood flow to aid muscle repair
* Mental restoration from high-intensity stress
* Movement quality maintenance
* Habit reinforcement

## How to Run Easy (Really Easy)

Most runners run their easy days too hard. Here's how to nail the right effort:

1. **Conversational pace** - You should be able to speak in full sentences
2. **Nasal breathing** - If you're mouth breathing, you're going too fast  
3. **RPE 3-4/10** - Should feel genuinely easy, almost effortless
4. **Heart rate guidance** - Generally 65-75% of max HR for most athletes

Remember: The purpose is to enhance recovery while maintaining fitness, not to squeeze in extra training stress.
      `
    },
    {
      id: 3,
      title: "Marathon Fueling Strategy: Beyond Gels and Sports Drinks",
      excerpt: "Train your gut like you train your legs. A comprehensive guide to race-day nutrition that actually works for 26.2 miles.",
      readTime: "12 min read",
      category: "Nutrition",
      featured: false,
      content: `
# Marathon Fueling Strategy: Beyond Gels and Sports Drinks

Your marathon performance depends as much on your fueling strategy as your fitness. Here's how to develop a bulletproof nutrition plan.

## The Science of Marathon Fueling

During a marathon, you'll burn approximately:
- 100-120 calories per mile
- 60-70% from carbohydrates at marathon pace
- Glycogen stores last roughly 90-120 minutes

This means every marathoner hits the glycogen depletion point around mile 18-22. Your fueling strategy determines whether you'll finish strong or hit the wall.

## Pre-Race Fueling

**3-4 Days Before:**
- Increase carbohydrate intake to 7-10g per kg body weight
- Maintain normal protein and fat intake
- Stay well hydrated

**Night Before:**
- Familiar, easily digestible dinner
- Avoid excess fiber, fat, or new foods
- Go to bed well-hydrated

**Morning Of:**
- Eat 3-4 hours before start time
- Target 1-4g carbs per kg body weight
- Include some protein for satiety
- Stop eating 2-3 hours before race start

## During the Race

**Carbohydrate Strategy:**
- Start fueling early (mile 4-6)
- Target 30-60g carbs per hour
- Use multiple carbohydrate sources (glucose + fructose)
- Practice your exact race strategy during long runs

**Hydration Guidelines:**
- Drink to thirst, don't over-hydrate
- Include electrolytes for runs over 90 minutes
- Weigh yourself before/after long training runs to understand sweat rate

## Post-Race Recovery

**First 30 minutes:**
- 1.2g carbs per kg body weight
- 0.3g protein per kg body weight
- Rehydrate with 150% of fluid lost

**Next 24-48 hours:**
- Continue high-carb intake
- Include anti-inflammatory foods
- Prioritize sleep for adaptation

Remember: Your gut is trainable. Practice your race-day strategy during every long run to avoid surprises on marathon morning.
      `
    }
  ];

  // Get featured articles
  const featuredArticles = articles.filter(article => article.featured);

  // GoldenPace calculation based on Daniels Running Formula
  const calculateGoldenPace = (time, distance) => {
    const timeInSeconds = parseTimeToSeconds(time);
    if (!timeInSeconds) return null;

    // Validate input
    if (timeInSeconds <= 0) return null;
    
    let distanceInMeters;
    switch(distance) {
      case '5K': distanceInMeters = 5000; break;
      case '10K': distanceInMeters = 10000; break;
      case '15K': distanceInMeters = 15000; break;
      case 'Half Marathon': distanceInMeters = 21097; break;
      case 'Marathon': distanceInMeters = 42195; break;
      default: distanceInMeters = 5000;
    }

    // Convert to equivalent 5K time for GoldenPace lookup
    // Using Daniels Running Formula race time conversion (Riegel formula)
    const equivalent5KTime = timeInSeconds * Math.pow(5000 / distanceInMeters, 1.06);
    
    // Official Daniels GoldenPace table based on 5K times (30-85 range)
    // Source: Updated CSV data - Official Daniels Running Formula data
    const goldenPaceFrom5K = {
      1840: 30,  // 30:40 - GoldenPace 30
      1745: 32,  // 29:05 - GoldenPace 32
      1659: 34,  // 27:39 - GoldenPace 34
      1582: 36,  // 26:22 - GoldenPace 36
      1512: 38,  // 25:12 - GoldenPace 38
      1448: 40,  // 24:08 - GoldenPace 40
      1389: 42,  // 23:09 - GoldenPace 42
      1335: 44,  // 22:15 - GoldenPace 44
      1310: 45,  // 21:50 - GoldenPace 45
      1285: 46,  // 21:25 - GoldenPace 46
      1262: 47,  // 21:02 - GoldenPace 47
      1239: 48,  // 20:39 - GoldenPace 48
      1218: 49,  // 20:18 - GoldenPace 49
      1197: 50,  // 19:57 - GoldenPace 50
      1176: 51,  // 19:36 - GoldenPace 51
      1157: 52,  // 19:17 - GoldenPace 52
      1138: 53,  // 18:58 - GoldenPace 53
      1120: 54,  // 18:40 - GoldenPace 54
      1102: 55,  // 18:22 - GoldenPace 55
      1085: 56,  // 18:05 - GoldenPace 56
      1069: 57,  // 17:49 - GoldenPace 57
      1053: 58,  // 17:33 - GoldenPace 58
      1037: 59,  // 17:17 - GoldenPace 59
      1023: 60,  // 17:03 - GoldenPace 60 (corrected from l7:03)
      1008: 61,  // 16:48 - GoldenPace 61
      994: 62,   // 16:34 - GoldenPace 62
      980: 63,   // 16:20 - GoldenPace 63
      967: 64,   // 16:07 - GoldenPace 64
      954: 65,   // 15:54 - GoldenPace 65
      942: 66,   // 15:42 - GoldenPace 66
      929: 67,   // 15:29 - GoldenPace 67
      918: 68,   // 15:18 - GoldenPace 68
      906: 69,   // 15:06 - GoldenPace 69
      895: 70,   // 14:55 - GoldenPace 70
      884: 71,   // 14:44 - GoldenPace 71
      873: 72,   // 14:33 - GoldenPace 72
      863: 73,   // 14:23 - GoldenPace 73
      853: 74,   // 14:13 - GoldenPace 74
      843: 75,   // 14:03 - GoldenPace 75
      834: 76,   // 13:54 - GoldenPace 76
      824: 77,   // 13:44 - GoldenPace 77
      815: 78,   // 13:35 - GoldenPace 78
      806: 79,   // 13:26 - GoldenPace 79
      798: 80,   // 13:18 - GoldenPace 80
      789: 81,   // 13:09 - GoldenPace 81
      781: 82,   // 13:01 - GoldenPace 82
      773: 83,   // 12:53 - GoldenPace 83
      765: 84,   // 12:45 - GoldenPace 84
      757: 85    // 12:37 - GoldenPace 85
    };

    // Find closest 5K time and interpolate if needed
    const timeKeys = Object.keys(goldenPaceFrom5K).map(Number).sort((a, b) => a - b);
    
    // Handle edge cases
    if (equivalent5KTime <= timeKeys[0]) return goldenPaceFrom5K[timeKeys[0]];
    if (equivalent5KTime >= timeKeys[timeKeys.length - 1]) return goldenPaceFrom5K[timeKeys[timeKeys.length - 1]];
    
    // Find the two closest times for interpolation
    let lowerTime = timeKeys[0];
    let upperTime = timeKeys[timeKeys.length - 1];
    
    for (let i = 0; i < timeKeys.length - 1; i++) {
      if (equivalent5KTime >= timeKeys[i] && equivalent5KTime <= timeKeys[i + 1]) {
        lowerTime = timeKeys[i];
        upperTime = timeKeys[i + 1];
        break;
      }
    }
    
    // Interpolate GoldenPace value
    const lowerGoldenPace = goldenPaceFrom5K[lowerTime];
    const upperGoldenPace = goldenPaceFrom5K[upperTime];
    
    const interpolationFactor = (equivalent5KTime - lowerTime) / (upperTime - lowerTime);
    const interpolatedGoldenPace = lowerGoldenPace + (upperGoldenPace - lowerGoldenPace) * interpolationFactor;
    
    return Math.round(interpolatedGoldenPace * 10) / 10; // Round to 1 decimal place
  };

  // Calculate projected GoldenPace improvement (1 VDOT point per 6 weeks average)
  const calculateProjectedGoldenPace = (currentGoldenPace, trainingStartDate, weeklyMileage = 20) => {
    if (!currentGoldenPace || !trainingStartDate) return null;
    
    const startDate = new Date(trainingStartDate);
    const currentDate = new Date();
    const weeksTraining = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 7));
    
    // Base improvement rate: 1 VDOT point per 6 weeks
    // Adjusted by training volume and consistency
    const baseImprovementRate = 1 / 6; // VDOT points per week
    
    // Mileage factor (optimal around 30-50 mpw for most runners)
    const mileageFactor = Math.min(1.2, Math.max(0.7, weeklyMileage / 40));
    
    // Diminishing returns factor (improvement slows at higher VDOT levels)
    const diminishingFactor = Math.max(0.5, 1 - (currentGoldenPace - 40) * 0.01);
    
    const adjustedImprovementRate = baseImprovementRate * mileageFactor * diminishingFactor;
    const projectedImprovement = weeksTraining * adjustedImprovementRate;
    
    return Math.round((currentGoldenPace + projectedImprovement) * 10) / 10;
  };

  // Generate GoldenPace progression graph data
  const generateGoldenPaceProgression = (startingGoldenPace, trainingStartDate, weeklyMileage = 20, weeksToProject = 52) => {
    if (!startingGoldenPace || !trainingStartDate) return [];
    
    const progression = [];
    const startDate = new Date(trainingStartDate);
    
    for (let week = 0; week <= weeksToProject; week += 2) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7));
      
      // Calculate projected VDOT for this week
      const baseImprovementRate = 1 / 6; // 1 VDOT per 6 weeks
      const mileageFactor = Math.min(1.2, Math.max(0.7, weeklyMileage / 40));
      const diminishingFactor = Math.max(0.5, 1 - (startingGoldenPace - 40) * 0.01);
      const adjustedImprovementRate = baseImprovementRate * mileageFactor * diminishingFactor;
      
      const projectedGoldenPace = startingGoldenPace + (week * adjustedImprovementRate);
      
      progression.push({
        week,
        date: currentDate.toISOString().split('T')[0],
        goldenPace: Math.round(projectedGoldenPace * 10) / 10,
        weeklyMileage: weeklyMileage
      });
    }
    
    return progression;
  };

  const parseTimeToSeconds = (timeStr) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  };



  const calculateTrainingPaces = (goldenPaceValue) => {
    if (!goldenPaceValue) return null;

    // Validate GoldenPace range
    if (goldenPaceValue < 30 || goldenPaceValue > 85) {
      console.warn(`GoldenPace value ${goldenPaceValue} is outside valid range (30-85)`);
      goldenPaceValue = Math.max(30, Math.min(85, goldenPaceValue));
    }

    // Official Daniels training pace table (minutes:seconds per mile)
    // Based on accurate VDOT data from CSV file (30-85 range)
    const paceTable = {
      30: { 
        easy: '12:16', 
        threshold: '10:18', 
        interval: '2:22', 
        repetition: '2:16' 
      },
      32: { 
        easy: '11:41', 
        threshold: '9:47', 
        interval: '2:14', 
        repetition: '2:08' 
      },
      34: { 
        easy: '11:09', 
        threshold: '9:20', 
        interval: '2:08', 
        repetition: '2:02' 
      },
      36: { 
        easy: '10:40', 
        threshold: '8:55', 
        interval: '2:02', 
        repetition: '1:55' 
      },
      38: { 
        easy: '10:14', 
        threshold: '8:33', 
        interval: '1:56', 
        repetition: '1:50' 
      },
      40: { 
        easy: '9:50', 
        threshold: '8:12', 
        interval: '1:52', 
        repetition: '1:46' 
      },
      42: { 
        easy: '9:28', 
        threshold: '7:52', 
        interval: '1:48', 
        repetition: '1:42' 
      },
      44: { 
        easy: '9:07', 
        threshold: '7:33', 
        interval: '1:44', 
        repetition: '1:38' 
      },
      45: { 
        easy: '8:58', 
        threshold: '7:25', 
        interval: '1:42', 
        repetition: '1:36' 
      },
      46: { 
        easy: '8:48', 
        threshold: '7:17', 
        interval: '1:40', 
        repetition: '1:34' 
      },
      47: { 
        easy: '8:39', 
        threshold: '7:10', 
        interval: '1:38', 
        repetition: '1:32' 
      },
      48: { 
        easy: '8:31', 
        threshold: '7:02', 
        interval: '1:36', 
        repetition: '1:30' 
      },
      49: { 
        easy: '8:22', 
        threshold: '6:55', 
        interval: '1:35', 
        repetition: '1:29' 
      },
      50: { 
        easy: '8:14', 
        threshold: '6:51', 
        interval: '1:33', 
        repetition: '1:27' 
      },
      51: { 
        easy: '8:07', 
        threshold: '6:44', 
        interval: '1:32', 
        repetition: '1:26' 
      },
      52: { 
        easy: '7:59', 
        threshold: '6:38', 
        interval: '1:31', 
        repetition: '1:25' 
      },
      53: { 
        easy: '7:52', 
        threshold: '6:32', 
        interval: '1:30', 
        repetition: '1:24' 
      },
      54: { 
        easy: '7:45', 
        threshold: '6:26', 
        interval: '1:28', 
        repetition: '1:22' 
      },
      55: { 
        easy: '7:38', 
        threshold: '6:20', 
        interval: '1:27', 
        repetition: '1:21' 
      },
      56: { 
        easy: '7:31', 
        threshold: '6:15', 
        interval: '1:26', 
        repetition: '1:20' 
      },
      57: { 
        easy: '7:25', 
        threshold: '6:09', 
        interval: '1:25', 
        repetition: '1:19' 
      },
      58: { 
        easy: '7:19', 
        threshold: '6:04', 
        interval: '1:23', 
        repetition: '1:17' 
      },
      59: { 
        easy: '7:13', 
        threshold: '5:59', 
        interval: '1:22', 
        repetition: '1:16' 
      },
      60: { 
        easy: '7:07', 
        threshold: '5:54', 
        interval: '1:21', 
        repetition: '1:15' 
      },
      61: { 
        easy: '7:01', 
        threshold: '5:50', 
        interval: '1:20', 
        repetition: '1:14' 
      },
      62: { 
        easy: '6:56', 
        threshold: '5:45', 
        interval: '1:19', 
        repetition: '1:13' 
      },
      63: { 
        easy: '6:50', 
        threshold: '5:41', 
        interval: '1:18', 
        repetition: '1:12' 
      },
      64: { 
        easy: '6:45', 
        threshold: '5:36', 
        interval: '1:17', 
        repetition: '1:11' 
      },
      65: { 
        easy: '6:40', 
        threshold: '5:32', 
        interval: '1:16', 
        repetition: '1:10' 
      },
      66: { 
        easy: '6:35', 
        threshold: '5:28', 
        interval: '1:15', 
        repetition: '1:09' 
      },
      67: { 
        easy: '6:30', 
        threshold: '5:24', 
        interval: '1:14', 
        repetition: '1:08' 
      },
      68: { 
        easy: '6:26', 
        threshold: '5:20', 
        interval: '1:13', 
        repetition: '1:07' 
      },
      69: { 
        easy: '6:21', 
        threshold: '5:16', 
        interval: '1:12', 
        repetition: '1:06' 
      },
      70: { 
        easy: '6:17', 
        threshold: '5:13', 
        interval: '1:11', 
        repetition: '1:05' 
      },
      71: { 
        easy: '6:12', 
        threshold: '5:09', 
        interval: '1:10', 
        repetition: '1:04' 
      },
      72: { 
        easy: '6:08', 
        threshold: '5:05', 
        interval: '1:09', 
        repetition: '1:03' 
      },
      73: { 
        easy: '6:04', 
        threshold: '5:02', 
        interval: '1:09', 
        repetition: '1:02' 
      },
      74: { 
        easy: '6:00', 
        threshold: '4:59', 
        interval: '1:08', 
        repetition: '1:02' 
      },
      75: { 
        easy: '5:56', 
        threshold: '4:56', 
        interval: '1:07', 
        repetition: '1:01' 
      },
      76: { 
        easy: '5:52', 
        threshold: '4:52', 
        interval: '1:06', 
        repetition: '1:00' 
      },
      77: { 
        easy: '5:48', 
        threshold: '4:49', 
        interval: '1:05', 
        repetition: '0:59' 
      },
      78: { 
        easy: '5:45', 
        threshold: '4:46', 
        interval: '1:05', 
        repetition: '0:59' 
      },
      79: { 
        easy: '5:41', 
        threshold: '4:43', 
        interval: '1:04', 
        repetition: '0:58' 
      },
      80: { 
        easy: '5:38', 
        threshold: '4:41', 
        interval: '1:04', 
        repetition: '0:58' 
      },
      81: { 
        easy: '5:34', 
        threshold: '4:38', 
        interval: '1:03', 
        repetition: '0:57' 
      },
      82: { 
        easy: '5:31', 
        threshold: '4:35', 
        interval: '1:02', 
        repetition: '0:56' 
      },
      83: { 
        easy: '5:28', 
        threshold: '4:32', 
        interval: '1:02', 
        repetition: '0:56' 
      },
      84: { 
        easy: '5:25', 
        threshold: '4:30', 
        interval: '1:01', 
        repetition: '0:55' 
      },
      85: { 
        easy: '5:21', 
        threshold: '4:27', 
        interval: '1:01', 
        repetition: '0:55' 
      }
    };

    // Find closest GoldenPace values for interpolation
    const goldenPaceKeys = Object.keys(paceTable).map(Number).sort((a, b) => a - b);
    
    // Handle edge cases
    if (goldenPaceValue <= goldenPaceKeys[0]) return paceTable[goldenPaceKeys[0]];
    if (goldenPaceValue >= goldenPaceKeys[goldenPaceKeys.length - 1]) return paceTable[goldenPaceKeys[goldenPaceKeys.length - 1]];
    
    // Find the two closest GoldenPace values for interpolation
    let lowerGoldenPace = goldenPaceKeys[0];
    let upperGoldenPace = goldenPaceKeys[goldenPaceKeys.length - 1];
    
    for (let i = 0; i < goldenPaceKeys.length - 1; i++) {
      if (goldenPaceValue >= goldenPaceKeys[i] && goldenPaceValue <= goldenPaceKeys[i + 1]) {
        lowerGoldenPace = goldenPaceKeys[i];
        upperGoldenPace = goldenPaceKeys[i + 1];
        break;
      }
    }
    
    // Interpolate training paces
    const lowerPaces = paceTable[lowerGoldenPace];
    const upperPaces = paceTable[upperGoldenPace];
    
    const interpolationFactor = (goldenPaceValue - lowerGoldenPace) / (upperGoldenPace - lowerGoldenPace);
    
    // Helper function to interpolate pace strings
    const interpolatePace = (lowerPace, upperPace) => {
      // Handle range paces (e.g., "7:38-8:39")
      if (lowerPace.includes('-') && upperPace.includes('-')) {
        const [lowerStart, lowerEnd] = lowerPace.split('-').map(p => parseTimeToSeconds(p));
        const [upperStart, upperEnd] = upperPace.split('-').map(p => parseTimeToSeconds(p));
        
        const interpolatedStart = lowerStart + (upperStart - lowerStart) * interpolationFactor;
        const interpolatedEnd = lowerEnd + (upperEnd - lowerEnd) * interpolationFactor;
        
        return `${formatTimeFromSeconds(interpolatedStart)}-${formatTimeFromSeconds(interpolatedEnd)}`;
      }
      
      // Handle single paces
      const lowerSeconds = parseTimeToSeconds(lowerPace);
      const upperSeconds = parseTimeToSeconds(upperPace);
      const interpolatedSeconds = lowerSeconds + (upperSeconds - lowerSeconds) * interpolationFactor;
      
      return formatTimeFromSeconds(interpolatedSeconds);
    };
    
    return {
      easy: interpolatePace(lowerPaces.easy, upperPaces.easy),
      threshold: interpolatePace(lowerPaces.threshold, upperPaces.threshold),
      interval: interpolatePace(lowerPaces.interval, upperPaces.interval),
      repetition: interpolatePace(lowerPaces.repetition, upperPaces.repetition)
    };
  };

  const formatTimeFromSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveProfile = () => {
    try {
      setProfileError('');
      
      // Validation
      if (!userProfile.name || !userProfile.email) {
        setProfileError('Please fill in your name and email');
        return;
      }
      
      const currentDate = new Date().toISOString().split('T')[0];
      const currentGoldenPace = goldenPace || null;
      
      // Initialize GoldenPace history if first time
      let goldenPaceHistory = [];
      if (currentGoldenPace) {
        goldenPaceHistory = [{
          date: currentDate,
          goldenPace: currentGoldenPace,
          raceDistance: raceDistance,
          raceTime: raceTime,
          weeklyMileage: parseInt(userProfile.weeklyMileage) || 20
        }];
      }
      
      // Calculate projected GoldenPace
      const projectedGoldenPace = currentGoldenPace 
        ? calculateProjectedGoldenPace(currentGoldenPace, currentDate, parseInt(userProfile.weeklyMileage) || 20)
        : null;
      
      // Create profile data with GoldenPace tracking
      const profileData = {
        ...userProfile,
        current_vdot: currentGoldenPace,
        currentGoldenPace: currentGoldenPace,
        goldenPaceHistory: goldenPaceHistory,
        projectedGoldenPace: projectedGoldenPace,
        trainingStartDate: currentDate,
        weekly_mileage: parseInt(userProfile.weeklyMileage) || null,
        created_date: currentDate,
        last_updated: currentDate
      };
      
      // Save to localStorage
      saveProfileData(profileData);
      setShowProfileDashboard(true);
      
      // Add this calculation to training history
      if (currentGoldenPace && raceTime && raceDistance) {
        addTrainingSession({
          type: 'GoldenPace Calculation',
          distance: raceDistance,
          time: raceTime,
          goldenPace: currentGoldenPace,
          notes: `Initial GoldenPace calculation: ${currentGoldenPace}. Projected in 6 weeks: ${projectedGoldenPace || 'N/A'}`
        });
        
        // Update personal best if this is better
        const currentPB = personalBests[raceDistance];
        if (!currentPB || parseTimeToSeconds(raceTime) < parseTimeToSeconds(currentPB)) {
          updatePersonalBest(raceDistance, raceTime);
        }
      }
      
      console.log('Profile saved successfully with GoldenPace tracking');
    } catch (error) {
      console.error('Error saving profile:', error);
      setProfileError('Error saving profile. Please try again.');
    }
  };

  const loadProfile = (email) => {
    try {
      // Since we're using localStorage, just load the saved data
      const savedProfile = localStorage.getItem('runningProfile');
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        if (data.email === email) {
          setSavedProfileData(data);
          setShowProfileDashboard(true);
          
          // Update the form with existing data
          setUserProfile({
            name: data.name || '',
            email: data.email || '',
            experience: data.experience || 'beginner',
            goalRaceDistance: data.goalRaceDistance || '5K',
            goalRaceTime: data.goalRaceTime || '',
            weeklyMileage: data.weekly_mileage?.toString() || '',
            injuryHistory: data.injuryHistory || '',
            preferredUnits: 'imperial'
          });
          
          if (data.current_vdot) {
            setGoldenPace(data.current_vdot);
          }
          
          console.log('Profile loaded successfully from localStorage');
        } else {
          console.log('No saved profile found for this email');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = () => {
    try {
      setProfileError('');
      
      // Validation
      if (!userProfile.name || !userProfile.email) {
        setProfileError('Please fill in your name and email');
        return;
      }
      
      const currentDate = new Date().toISOString().split('T')[0];
      const currentGoldenPace = goldenPace || savedProfileData?.currentGoldenPace || null;
      
      // Update GoldenPace history if there's a new GoldenPace
      let updatedGoldenPaceHistory = savedProfileData?.goldenPaceHistory || [];
      if (currentGoldenPace && goldenPace && goldenPace !== savedProfileData?.currentGoldenPace) {
        const newEntry = {
          date: currentDate,
          goldenPace: currentGoldenPace,
          raceDistance: raceDistance,
          raceTime: raceTime,
          weeklyMileage: parseInt(userProfile.weeklyMileage) || 20
        };
        updatedGoldenPaceHistory = [...updatedGoldenPaceHistory, newEntry];
      }
      
      // Recalculate projected GoldenPace
      const projectedGoldenPace = currentGoldenPace 
        ? calculateProjectedGoldenPace(
            currentGoldenPace, 
            savedProfileData?.trainingStartDate || currentDate, 
            parseInt(userProfile.weeklyMileage) || 20
          )
        : null;
      
      // Create updated profile data with enhanced GoldenPace tracking
      const updatedProfileData = {
        ...savedProfileData,
        ...userProfile,
        current_vdot: currentGoldenPace,
        currentGoldenPace: currentGoldenPace,
        goldenPaceHistory: updatedGoldenPaceHistory,
        projectedGoldenPace: projectedGoldenPace,
        trainingStartDate: savedProfileData?.trainingStartDate || currentDate,
        weekly_mileage: parseInt(userProfile.weeklyMileage) || null,
        last_updated: currentDate
      };
      
      // Save to localStorage
      saveProfileData(updatedProfileData);
      setSavedProfileData(updatedProfileData);
      
      console.log('Profile updated successfully with GoldenPace tracking');
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Error updating profile. Please try again.');
    }
  };

  const handleCalculate = () => {
    const calculatedGoldenPace = calculateGoldenPace(raceTime, raceDistance);
    setGoldenPace(calculatedGoldenPace);
    setTrainingPaces(calculateTrainingPaces(calculatedGoldenPace));
  };

  // Function to get training paces for a specific GoldenPace level
  const getTrainingPacesForLevel = (goldenPaceLevel) => {
    if (goldenPaceLevel < 30 || goldenPaceLevel > 85) {
      goldenPaceLevel = Math.max(30, Math.min(85, goldenPaceLevel));
    }
    
    // Get the exact paces from our updated table
    const paces = calculateTrainingPaces(goldenPaceLevel);
    return paces;
  };

  // Function to generate personalized training plans
  const generatePersonalizedPlan = (basePlan, goldenPaceLevel) => {
    const paces = getTrainingPacesForLevel(goldenPaceLevel);
    
    return {
      ...basePlan,
      name: `${basePlan.name} (GoldenPace ${goldenPaceLevel})`,
      description: `${basePlan.description} Personalized for GoldenPace ${goldenPaceLevel} with specific training paces.`,
      goldenPaceLevel: goldenPaceLevel,
      trainingPaces: paces,
      workouts: basePlan.workouts.map(workout => ({
        ...workout,
        days: workout.days.map(day => {
          let paceNote = "";
          switch(day.type) {
            case "Easy":
            case "Long Run":
              paceNote = ` (${paces.easy} per mile)`;
              break;
            case "Threshold":
              paceNote = ` (${paces.threshold} per mile)`;
              break;
            case "Interval":
              paceNote = ` (${paces.interval} per 400m)`;
              break;
            case "Repetition":
              paceNote = ` (${paces.repetition} per 400m)`;
              break;
            default:
              paceNote = "";
          }
          return {
            ...day,
            notes: day.notes + paceNote
          };
        })
      }))
    };
  };

  // Base training plans with detailed daily schedules
  const baseTrainingPlans = [
    {
      id: 1,
      name: "5K Base Building",
      description: "4-week base building program focusing on easy running and building endurance",
      distance: "5K",
      phase: "Base",
      weeklyMileage: 35,
      duration: 4,
      workouts: [
        {
          week: 1,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "4 miles", notes: "2 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 2,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Interval", distance: "5 miles", notes: "6x400m at interval pace" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 3,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Repetition", distance: "5 miles", notes: "8x200m at repetition pace" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 4,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "4 miles", notes: "2 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "5K Build Phase",
      description: "4-week build phase with increased intensity and structured workouts",
      distance: "5K",
      phase: "Build",
      weeklyMileage: 35,
      duration: 4,
      workouts: [
        {
          week: 1,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Wednesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Interval", distance: "6 miles", notes: "8x400m at interval pace" },
            { day: "Saturday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" }
          ]
        },
        {
          week: 2,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Wednesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Repetition", distance: "6 miles", notes: "10x200m at repetition pace" },
            { day: "Saturday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" }
          ]
        },
        {
          week: 3,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Wednesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Interval", distance: "6 miles", notes: "10x400m at interval pace" },
            { day: "Saturday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" }
          ]
        },
        {
          week: 4,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Wednesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Repetition", distance: "6 miles", notes: "12x200m at repetition pace" },
            { day: "Saturday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Long Run", distance: "8 miles", notes: "Easy pace, longest run of week" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "5K Peak Phase",
      description: "4-week peak phase with race-specific workouts and tapering",
      distance: "5K",
      phase: "Peak",
      weeklyMileage: 35,
      duration: 4,
      workouts: [
        {
          week: 1,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Wednesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Repetition", distance: "6 miles", notes: "12x200m at repetition pace" },
            { day: "Saturday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" }
          ]
        },
        {
          week: 2,
          days: [
            { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Wednesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Repetition", distance: "6 miles", notes: "12x200m at repetition pace" },
            { day: "Saturday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" }
          ]
        },
        {
          week: 3,
          days: [
            { day: "Monday", type: "Easy", distance: "4 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Threshold", distance: "5 miles", notes: "2 miles at threshold pace" },
            { day: "Wednesday", type: "Easy", distance: "4 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "4 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Repetition", distance: "5 miles", notes: "8x200m at repetition pace" },
            { day: "Saturday", type: "Easy", distance: "4 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Easy", distance: "4 miles", notes: "Easy pace, conversational" }
          ]
        },
        {
          week: 4,
          days: [
            { day: "Monday", type: "Easy", distance: "3 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "3 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Easy", distance: "3 miles", notes: "Easy pace, conversational" },
            { day: "Thursday", type: "Easy", distance: "2 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "2 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Easy", distance: "2 miles", notes: "Easy pace, conversational" },
            { day: "Sunday", type: "Race", distance: "5K", notes: "Race day!" }
          ]
        }
      ]
    },
    {
      id: 4,
      name: "10K Base Building",
      description: "4-week base building program for 10K training",
      distance: "10K",
      phase: "Base",
      weeklyMileage: 45,
      duration: 4,
      workouts: [
        {
          week: 1,
          days: [
            { day: "Monday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "10 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 2,
          days: [
            { day: "Monday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Interval", distance: "7 miles", notes: "8x400m at interval pace" },
            { day: "Thursday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "10 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 3,
          days: [
            { day: "Monday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Repetition", distance: "7 miles", notes: "10x200m at repetition pace" },
            { day: "Thursday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "10 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 4,
          days: [
            { day: "Monday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "6 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "10 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        }
      ]
    },
    {
      id: 5,
      name: "Half Marathon Base Building",
      description: "4-week base building program for half marathon training",
      distance: "Half Marathon",
      phase: "Base",
      weeklyMileage: 55,
      duration: 4,
      workouts: [
        {
          week: 1,
          days: [
            { day: "Monday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "8 miles", notes: "4 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "12 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 2,
          days: [
            { day: "Monday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Interval", distance: "8 miles", notes: "10x400m at interval pace" },
            { day: "Thursday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "12 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 3,
          days: [
            { day: "Monday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Repetition", distance: "8 miles", notes: "12x200m at repetition pace" },
            { day: "Thursday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "12 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 4,
          days: [
            { day: "Monday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "8 miles", notes: "4 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "7 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "12 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        }
      ]
    },
    {
      id: 6,
      name: "Marathon Base Building",
      description: "4-week base building program for marathon training",
      distance: "Marathon",
      phase: "Base",
      weeklyMileage: 65,
      duration: 4,
      workouts: [
        {
          week: 1,
          days: [
            { day: "Monday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "10 miles", notes: "5 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "15 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 2,
          days: [
            { day: "Monday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Interval", distance: "10 miles", notes: "12x400m at interval pace" },
            { day: "Thursday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "15 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 3,
          days: [
            { day: "Monday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Repetition", distance: "10 miles", notes: "15x200m at repetition pace" },
            { day: "Thursday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "15 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        },
        {
          week: 4,
          days: [
            { day: "Monday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Tuesday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Wednesday", type: "Threshold", distance: "10 miles", notes: "5 miles at threshold pace" },
            { day: "Thursday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Friday", type: "Easy", distance: "8 miles", notes: "Easy pace, conversational" },
            { day: "Saturday", type: "Long Run", distance: "15 miles", notes: "Easy pace, longest run of week" },
            { day: "Sunday", type: "Rest", distance: "0 miles", notes: "Complete rest or light cross-training" }
          ]
        }
      ]
    }
  ];

  // Generate personalized training plans based on user's GoldenPace
  const trainingPlans = goldenPace ? 
    baseTrainingPlans.map(plan => generatePersonalizedPlan(plan, Math.round(goldenPace))) :
    baseTrainingPlans;

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  // Purchase handlers
  const handlePurchaseClick = (planId, planName, price) => {
    setSelectedPlanForPurchase({ id: planId, name: planName, price });
    setShowPurchaseModal(true);
  };

  const processPurchase = async () => {
    if (!selectedPlanForPurchase) return;
    
    setPurchaseLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const newPurchase = {
        id: selectedPlanForPurchase.id,
        name: selectedPlanForPurchase.name,
        price: selectedPlanForPurchase.price,
        purchaseDate: new Date().toISOString(),
        status: 'active'
      };
      
      const updatedPurchases = [...purchasedPlans, newPurchase];
      setPurchasedPlans(updatedPurchases);
      localStorage.setItem('purchasedPlans', JSON.stringify(updatedPurchases));
      
      setPurchaseLoading(false);
      setPurchaseSuccess(true);
      setShowPurchaseModal(false);
      setSelectedPlanForPurchase(null);
      
      // Reset success state after 3 seconds
      setTimeout(() => setPurchaseSuccess(false), 3000);
    }, 2000);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedPlanForPurchase(null);
    setPurchaseLoading(false);
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.white }}>
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-2 h-2" style={{ 
          backgroundColor: colors.lightBlue,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}></div>
        <div className="absolute top-40 right-20 w-3 h-3" style={{ 
          backgroundColor: colors.lightGreen,
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
        }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2" style={{ 
          backgroundColor: colors.lightBlue,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
        }}></div>
      </div>
      {/* Header - Munich 1972 Geometric Style with Running Pictogram */}
      <header className="shadow-sm border-b relative overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.gray }}>
        {/* Progressive Melange Background */}
        <div className="absolute inset-0 progressive-melange opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            {/* Brand Logo - Enhanced Prominence */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Geometric logo background */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 geometric-octagon flex items-center justify-center" style={{ 
                  backgroundColor: colors.lightBlue,
                  boxShadow: '0 6px 12px rgba(30,107,150,0.3)'
                }}>
                  {/* Olympic Runner Icon */}
                  <img 
                    src="/olympicrunner72icon.png" 
                    alt="Olympic Runner" 
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain running-pictogram"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                {/* Geometric accent */}
                <div className="absolute -top-1 -right-1 w-4 h-4 geometric-diamond" style={{ 
                  backgroundColor: colors.orange
                }}></div>
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-3xl font-black tracking-wide leading-tight" style={{ 
                  color: colors.black,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  UNFORGIVING MINUTE
                </h1>
                <p className="text-sm sm:text-lg font-bold tracking-wider" style={{ 
                  color: colors.lightBlue,
                  letterSpacing: '0.15em'
                }}>
                  DISTANCE RUNNING
                </p>
                <div className="hidden sm:block mt-1">
                  <div className="h-0.5 w-20 bg-gradient-to-r" style={{ 
                    backgroundImage: `linear-gradient(90deg, ${colors.lightBlue} 0%, ${colors.orange} 50%, ${colors.lightGreen} 100%)`
                  }}></div>
                </div>
              </div>
            </div>
            
            {/* Navigation - Munich 1972 Style */}
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-1">
              {[
                { id: 'calculator', label: 'GoldenPace Calculator', icon: Calculator },
                { id: 'plans', label: 'Training Plans', icon: Target },
                { id: 'blog', label: 'Articles', icon: BookOpen },
                { id: 'premium', label: 'Premium Plans', icon: Star },
                { id: 'profile', label: 'Profile', icon: User }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={(e) => {
                    // Secret admin access: Shift + Click on Articles
                    if (id === 'blog' && e.shiftKey) {
                      setShowAdminPanel(true);
                    } else {
                      setActiveTab(id);
                    }
                  }}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm transition-all duration-200 ${
                    activeTab === id
                      ? 'text-white shadow-sm'
                      : 'text-gray-600 hover:text-white hover:shadow-sm'
                  }`}
                  style={{
                    backgroundColor: activeTab === id ? colors.lightBlue : 'transparent',
                    borderBottom: activeTab === id ? `2px solid ${colors.lightGreen}` : 'none'
                  }}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </button>
              ))}
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="ml-4 p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: darkMode ? colors.yellow : colors.gray,
                  color: darkMode ? colors.black : colors.lightBlue,
                  border: `2px solid ${darkMode ? colors.yellow : colors.lightBlue}`
                }}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <span className="text-lg">☀️</span>
                ) : (
                  <span className="text-lg">🌙</span>
                )}
              </button>
              

            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative" style={{ backgroundColor: colors.white, color: colors.black }}>
        {/* Floating runner elements - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-20 left-10 w-12 h-12 geometric-float-counterclockwise">
          {/* Olympic Runner Icon */}
          <img 
            src="/olympicrunner72icon.png" 
            alt="Olympic Runner" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
        </div>
        
        <div className="hidden sm:block absolute top-40 right-20 w-16 h-16 geometric-float-counterclockwise" style={{ animationDelay: '2s' }}>
          {/* Olympic Runner Icon */}
          <img 
            src="/olympicrunner72icon.png" 
            alt="Olympic Runner" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
        </div>
        
        <div className="hidden sm:block absolute bottom-40 left-1/4 w-8 h-8 geometric-float-counterclockwise" style={{ animationDelay: '4s' }}>
          {/* Olympic Runner Icon */}
          <img 
            src="/olympicrunner72icon.png" 
            alt="Olympic Runner" 
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          />
        </div>
        
        {activeTab === 'calculator' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Hero Section - Munich 1972 Style */}
            <div className="text-center space-y-4 sm:space-y-6">
              {/* Track -> Stopwatch -> Calculator Design */}
              <div className="inline-block relative">
                {/* 8-Lane Oval Track - Vertical orientation (elongated 10%) */}
                <div className="relative w-44 h-24 sm:w-52 sm:h-32" style={{ transform: 'rotate(0deg)' }}>
                  {/* Lane 8 (outermost) */}
                  <div className="absolute inset-0 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 7 */}
                  <div className="absolute inset-1 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                  {/* Lane 6 */}
                  <div className="absolute inset-2 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 5 */}
                  <div className="absolute inset-3 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                  {/* Lane 4 */}
                  <div className="absolute inset-4 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 3 */}
                  <div className="absolute inset-5 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                  {/* Lane 2 */}
                  <div className="absolute inset-6 border-2 rounded-full" style={{ 
                    borderColor: colors.lightBlue,
                    background: `conic-gradient(from 0deg, ${colors.lightBlue} 0deg, ${colors.lightGreen} 90deg, ${colors.lightBlue} 180deg, ${colors.lightGreen} 270deg, ${colors.lightBlue} 360deg)`
                  }}></div>
                  {/* Lane 1 (innermost) */}
                  <div className="absolute inset-7 border-2 rounded-full" style={{ 
                    borderColor: colors.lightGreen,
                    background: `conic-gradient(from 0deg, ${colors.lightGreen} 0deg, ${colors.lightBlue} 90deg, ${colors.lightGreen} 180deg, ${colors.lightBlue} 270deg, ${colors.lightGreen} 360deg)`
                  }}></div>
                </div>
                
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: colors.black }}>
                GoldenPace Calculator
              </h2>
              <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4 leading-relaxed" style={{ color: colors.black }}>
                Enter a recent race time to unlock your personalized training paces—used by elite athletes worldwide
              </p>
              
              {/* Value proposition badges */}
              <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
                  borderColor: colors.lightBlue, 
                  backgroundColor: colors.lightBlue + '10',
                  color: colors.black 
                }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                  <span className="text-sm font-medium">Elite-Tested</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
                  borderColor: colors.lightGreen, 
                  backgroundColor: colors.lightGreen + '10',
                  color: colors.black 
                }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                  <span className="text-sm font-medium">Instant Results</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border" style={{ 
                  borderColor: colors.orange, 
                  backgroundColor: colors.orange + '10',
                  color: colors.black 
                }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.orange }}></div>
                  <span className="text-sm font-medium">Free Training Sample</span>
                </div>
              </div>
            </div>

            {/* Calculator Card - Munich 1972 Geometric Style */}
            <div className="max-w-2xl mx-auto">
              <div className="shadow-sm border relative overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.white }}>
                {/* Progressive Melange Background */}
                <div className="absolute inset-0 progressive-melange opacity-5"></div>
                
                {/* Subtle geometric corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2" style={{ borderColor: colors.lightBlue }}></div>
                <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2" style={{ borderColor: colors.lightGreen }}></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2" style={{ borderColor: colors.lightGreen }}></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2" style={{ borderColor: colors.lightBlue }}></div>
                
                <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold flex items-center" style={{ color: colors.black }}>
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" style={{ color: colors.lightBlue }} />
                    GoldenPace Calculator
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                        Race Time
                      </label>
                      <input
                        type="text"
                        placeholder="MM:SS or HH:MM:SS"
                        value={raceTime}
                        onChange={(e) => setRaceTime(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 border-2 font-mono text-base sm:text-lg text-center"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.black,
                          backgroundColor: colors.white
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                        Distance
                      </label>
                      <select
                        value={raceDistance}
                        onChange={(e) => setRaceDistance(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 border-2 font-medium text-center"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.black,
                          backgroundColor: colors.white
                        }}
                      >
                        <option value="5K">5K</option>
                        <option value="10K">10K</option>
                        <option value="15K">15K</option>
                        <option value="Half Marathon">Half Marathon</option>
                        <option value="Marathon">Marathon</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCalculate}
                    className="w-full py-3 px-6 font-medium text-base sm:text-lg transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg relative btn-high-contrast"
                    style={{ 
                      backgroundColor: colors.lightBlue,
                      color: colors.white,
                      border: `2px solid ${colors.darkGreen}`
                    }}
                  >
                    Calculate GoldenPace
                    {/* Geometric accent on button */}
                    <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond" style={{ 
                      backgroundColor: colors.lightGreen
                    }}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section - Munich 1972 Geometric Style */}
            {goldenPace && trainingPaces && (
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                {/* GoldenPace Display */}
                <div className="text-center p-4 sm:p-6 bg-white shadow-sm border relative overflow-hidden" style={{ borderColor: colors.border }}>
                  {/* Progressive Melange Background */}
                  <div className="absolute inset-0 progressive-melange opacity-5"></div>
                  
                  {/* Geometric border accents */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-16 sm:h-2" style={{ backgroundColor: colors.lightBlue }}></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 sm:w-16 sm:h-2" style={{ backgroundColor: colors.lightGreen }}></div>
                  
                  <div className="relative z-10">
                    <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.lightBlue }}>
                      {goldenPace}
                    </div>
                    <div className="text-base sm:text-lg font-medium" style={{ color: colors.black }}>
                      GoldenPace
                    </div>
                    <p className="text-xs sm:text-sm mt-2" style={{ color: colors.lightBlue }}>
                      Your training fitness level
                    </p>
                  </div>
                </div>

                {/* Training Paces Grid - Munich 1972 Geometric Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { name: 'Easy', pace: trainingPaces.easy, icon: Clock, color: colors.gray },
                    { name: 'Threshold', pace: trainingPaces.threshold, icon: TrendingUp, color: colors.lightGreen },
                    { name: 'Interval', pace: trainingPaces.interval, icon: Clock, color: colors.darkGreen },
                    { name: 'Repetition', pace: trainingPaces.repetition, icon: TrendingUp, color: colors.lightBlue }
                  ].map(({ name, pace, icon: Icon, color }, index) => (
                    <div key={name} className="bg-white shadow-sm border p-3 sm:p-4 text-center relative overflow-hidden" style={{ borderColor: colors.border }}>
                      {/* Progressive Melange Background */}
                      <div className="absolute inset-0 progressive-melange opacity-3"></div>
                      
                      {/* Geometric corner accent */}
                      <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-diamond geometric-float-counterclockwise" style={{ 
                        backgroundColor: color,
                        opacity: 0.3,
                        animationDelay: `${index * 0.5}s`
                      }}></div>
                      
                      <div className="relative z-10">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: color }} />
                        <h4 className="text-sm sm:text-md font-medium mb-1" style={{ color: colors.black }}>
                          {name}
                        </h4>
                        <div className="text-lg sm:text-xl font-bold font-mono" style={{ color: color }}>
                          {pace}
                        </div>
                        <p className="text-xs mt-1" style={{ color: colors.lightBlue }}>
                          per mile
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Freemium Flow - Post-Calculation User Journey */}
                <div className="mt-8 space-y-6">
                  {/* Free Training Week Sample */}
                  <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 rounded-lg p-6 relative overflow-hidden" style={{ 
                    borderColor: colors.lightBlue,
                    boxShadow: '0 10px 25px rgba(30, 107, 150, 0.15)'
                  }}>
                    <div className="absolute top-0 right-0 w-24 h-24 geometric-diamond" style={{ 
                      backgroundColor: colors.orange,
                      opacity: 0.08
                    }}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.black }}>
                            Your Personalized Training Week
                          </h3>
                          <p className="text-sm" style={{ color: colors.darkGreen }}>
                            Based on your {goldenPace} GoldenPace • Elite-tested training system
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-4 py-2 rounded-full text-sm font-bold border-2" style={{ 
                            backgroundColor: colors.lightGreen,
                            borderColor: colors.darkGreen,
                            color: 'white'
                          }}>
                            FREE SAMPLE
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Monday - Recovery Run</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.lightBlue,
                              backgroundColor: colors.lightBlue + '15'
                            }}>{trainingPaces.easy}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightGreen + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightGreen }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Wednesday - Threshold Run</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.lightGreen,
                              backgroundColor: colors.lightGreen + '15'
                            }}>{trainingPaces.threshold}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.darkGreen + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.darkGreen }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Friday - Interval Session</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.darkGreen,
                              backgroundColor: colors.darkGreen + '15'
                            }}>{trainingPaces.interval}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.lightBlue + '40' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.lightBlue }}></div>
                              <span className="font-medium" style={{ color: colors.black }}>Sunday - Long Run</span>
                            </div>
                            <span className="font-mono font-bold px-2 py-1 rounded" style={{ 
                              color: colors.lightBlue,
                              backgroundColor: colors.lightBlue + '15'
                            }}>{trainingPaces.easy}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Value proposition with urgency */}
                      <div className="bg-white rounded-lg p-4 mb-6 border" style={{ borderColor: colors.orange + '30' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.orange }}>
                            <Star className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1" style={{ color: colors.black }}>
                              This is just week 1 of a 12-week journey to your race goal
                            </p>
                            <p className="text-xs" style={{ color: colors.darkGreen }}>
                              Full programs include progressive build phases, peak training, and race-specific workouts
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => setActiveTab('premium')}
                          className="flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          style={{ 
                            backgroundColor: colors.orange,
                            color: 'white'
                          }}
                        >
                          <TrendingUp className="w-6 h-6 mr-3" />
                          Get Complete 12-Week Program
                        </button>
                        <button 
                          onClick={() => setActiveTab('plans')}
                          className="flex-1 px-6 py-4 rounded-lg font-medium border-2 transition-all duration-200 flex items-center justify-center"
                          style={{ 
                            borderColor: colors.lightBlue,
                            color: colors.lightBlue,
                            backgroundColor: 'white'
                          }}
                        >
                          <Target className="w-5 h-5 mr-2" />
                          Browse All Programs
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Creation Prompt */}
                  {!savedProfileData && (
                    <div className="border-2 rounded-lg p-6 relative overflow-hidden" style={{ 
                      borderColor: colors.lightGreen + '60',
                      backgroundColor: 'white',
                      boxShadow: '0 8px 25px rgba(46, 139, 87, 0.12)'
                    }}>
                      <div className="absolute top-0 left-0 w-32 h-32 geometric-octagon" style={{ 
                        backgroundColor: colors.lightGreen,
                        opacity: 0.06
                      }}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                            backgroundColor: colors.lightGreen + '20'
                          }}>
                            <User className="w-6 h-6" style={{ color: colors.lightGreen }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2" style={{ color: colors.black }}>
                              Save Your Progress & Get Personalized Coaching
                            </h3>
                            <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                              Create a free profile to unlock AI-powered training recommendations, track your progress, and get access to our community of elite runners.
                            </p>
                          </div>
                        </div>
                        
                        {/* Benefits list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>Save your GoldenPace & training paces</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>Personal training log & progress tracking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>AI-powered workout recommendations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" style={{ color: colors.lightGreen }} />
                            <span className="text-sm" style={{ color: colors.black }}>Access to elite coaching insights</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <button 
                            onClick={() => setActiveTab('profile')}
                            className="flex-1 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            style={{ 
                              backgroundColor: colors.lightGreen,
                              color: 'white'
                            }}
                          >
                            <User className="w-6 h-6 mr-3" />
                            Create Free Profile Now
                          </button>
                          <div className="flex items-center gap-2 text-sm" style={{ color: colors.darkGreen }}>
                            <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: colors.lightGreen }}>
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            No credit card • Always free
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Training Plans</h2>
              <p className="text-xl text-gray-600">Structured programs tailored to your GoldenPace fitness level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainingPlans.map((plan, index) => (
                <div key={plan.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{plan.duration} weeks</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">Focus: {plan.phase}</p>
                    <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                    {plan.goldenPaceLevel && (
                      <div className="munich-alert munich-alert-info mb-4 relative">
                        {/* Geometric accent */}
                        <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
                          backgroundColor: colors.lightBlue,
                          opacity: 0.6
                        }}></div>
                        <p className="font-medium" style={{ color: colors.black }}>
                          Personalized for GoldenPace {plan.goldenPaceLevel}
                        </p>
                        <p className="mt-1" style={{ 
                          color: colors.lightBlue,
                          fontSize: 'var(--text-xs)'
                        }}>
                          Easy: {plan.trainingPaces?.easy} | Threshold: {plan.trainingPaces?.threshold}
                        </p>
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowPlanDetails(true);
                        }}
                        className="munich-btn munich-btn-primary flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Plan
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowPlanDetails(true);
                        }}
                        className="munich-btn munich-btn-outline"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Details Modal */}
            {showPlanDetails && selectedPlan && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h3>
                    <button 
                      onClick={() => setShowPlanDetails(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Duration</h4>
                      <p className="text-gray-600">{selectedPlan.duration} weeks</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Focus</h4>
                      <p className="text-gray-600">{selectedPlan.phase}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Description</h4>
                      <p className="text-gray-600">{selectedPlan.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Weekly Mileage</h4>
                      <p className="text-gray-600">{selectedPlan.weeklyMileage} miles</p>
                    </div>
                    
                    {selectedPlan.goldenPaceLevel && selectedPlan.trainingPaces && (
                      <div>
                        <h4 className="font-semibold text-gray-900">Training Paces (GoldenPace {selectedPlan.goldenPaceLevel})</h4>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Easy/Long Run</p>
                            <p className="text-lg font-bold text-blue-600">{selectedPlan.trainingPaces.easy} per mile</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Threshold</p>
                            <p className="text-lg font-bold text-green-600">{selectedPlan.trainingPaces.threshold} per mile</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Interval (400m)</p>
                            <p className="text-lg font-bold text-orange-600">{selectedPlan.trainingPaces.interval}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Repetition (400m)</p>
                            <p className="text-lg font-bold text-red-600">{selectedPlan.trainingPaces.repetition}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900">Workout Types</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {selectedPlan.workouts.map((workout, weekIndex) => (
                          <li key={weekIndex} className="font-medium text-gray-900">Week {weekIndex + 1}:</li>
                        ))}
                      </ul>
                      <ul className="list-disc list-inside text-gray-600">
                        {selectedPlan.workouts.map((workout, weekIndex) => (
                          <li key={weekIndex}>
                            {workout.days.map((day, dayIndex) => (
                              <div key={dayIndex} className="flex items-start space-x-2">
                                <span className="font-medium text-gray-900">{day.day}:</span>
                                <span>{day.type} - {day.distance}</span>
                                {day.notes && <span className="text-xs text-gray-500"> ({day.notes})</span>}
                              </div>
                            ))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button 
                      onClick={() => {
                        // Generate and download plan
                        let planContent = `Training Plan: ${selectedPlan.name}\n\nDuration: ${selectedPlan.duration} weeks\nFocus: ${selectedPlan.phase}\nWeekly Mileage: ${selectedPlan.weeklyMileage} miles\n\nDescription: ${selectedPlan.description}\n`;
                        
                        if (selectedPlan.goldenPaceLevel && selectedPlan.trainingPaces) {
                          planContent += `\nTRAINING PACES (GoldenPace ${selectedPlan.goldenPaceLevel}):\n`;
                          planContent += `Easy/Long Run: ${selectedPlan.trainingPaces.easy} per mile\n`;
                          planContent += `Threshold: ${selectedPlan.trainingPaces.threshold} per mile\n`;
                          planContent += `Interval (400m): ${selectedPlan.trainingPaces.interval}\n`;
                          planContent += `Repetition (400m): ${selectedPlan.trainingPaces.repetition}\n`;
                        }
                        
                        planContent += `\nWORKOUT SCHEDULE:\n`;
                        selectedPlan.workouts.forEach((workout, weekIndex) => {
                          planContent += `Week ${weekIndex + 1}:\n`;
                          workout.days.forEach((day, dayIndex) => {
                            planContent += `  ${day.day}: ${day.type} - ${day.distance}`;
                            if (day.notes) {
                              planContent += ` (${day.notes})`;
                            }
                            planContent += "\n";
                          });
                          planContent += "\n";
                        });
                        const blob = new Blob([planContent], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedPlan.name.replace(/\s+/g, '_')}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="munich-btn munich-btn-primary flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Plan
                    </button>
                    <button 
                      onClick={() => setShowPlanDetails(false)}
                      className="munich-btn munich-btn-outline"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 relative">
              {/* Geometric background elements */}
              <div className="absolute inset-0 progressive-melange opacity-5"></div>
              
              <div className="relative z-10">
                <h2 className="font-bold" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-4xl)'
                }}>Your Profile</h2>
                <p style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-xl)'
                }}>Customize your training experience</p>
              </div>
            </div>

            {!showProfileDashboard ? (
              // Profile Creation Form
              <div className="munich-card max-w-3xl mx-auto">
                <div className="munich-card-header relative overflow-hidden" style={{ 
                  backgroundColor: colors.lightBlue 
                }}>
                  {/* Progressive Melange Background */}
                  <div className="absolute inset-0 progressive-melange opacity-20"></div>
                  
                  {/* Geometric corner accent */}
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-octagon" style={{ 
                    backgroundColor: colors.lightGreen,
                    opacity: 0.8
                  }}></div>
                  
                  <div className="relative z-10">
                    <h3 className="font-bold flex items-center" style={{ 
                      color: colors.white,
                      fontSize: 'var(--text-2xl)'
                    }}>
                      <User className="w-6 h-6 mr-3" />
                      Create Your Running Profile
                    </h3>
                  </div>
                </div>
                
                <div className="munich-card-body space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        className="munich-input"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Email</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        className="munich-input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Experience Level</label>
                      <select
                        value={userProfile.experience}
                        onChange={(e) => setUserProfile({...userProfile, experience: e.target.value})}
                        className="munich-input"
                      >
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (1-3 years)</option>
                        <option value="advanced">Advanced (3+ years)</option>
                        <option value="elite">Elite/Competitive</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Goal Race Distance</label>
                      <select
                        value={userProfile.goalRaceDistance}
                        onChange={(e) => setUserProfile({...userProfile, goalRaceDistance: e.target.value})}
                        className="munich-input"
                      >
                        <option value="5K">5K</option>
                        <option value="10K">10K</option>
                        <option value="Half Marathon">Half Marathon</option>
                        <option value="Marathon">Marathon</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Goal Race Time (optional)</label>
                      <input
                        type="text"
                        value={userProfile.goalRaceTime}
                        onChange={(e) => setUserProfile({...userProfile, goalRaceTime: e.target.value})}
                        className="munich-input"
                        placeholder="e.g., 20:00 for 5K"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>Current Weekly Mileage</label>
                      <input
                        type="number"
                        value={userProfile.weeklyMileage}
                        onChange={(e) => setUserProfile({...userProfile, weeklyMileage: e.target.value})}
                        className="munich-input"
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-sm)'
                    }}>Injury History (optional)</label>
                    <textarea
                      value={userProfile.injuryHistory}
                      onChange={(e) => setUserProfile({...userProfile, injuryHistory: e.target.value})}
                      className="munich-input"
                      placeholder="Any injuries or health considerations we should know about?"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={savedProfileData ? updateProfile : saveProfile}
                      className="munich-btn munich-btn-primary flex-1 relative"
                    >
                      {savedProfileData ? 'Update Profile' : 'Create Profile'}
                      {/* Geometric accent on button */}
                      <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
                        backgroundColor: colors.lightGreen
                      }}></div>
                    </button>
                    
                    {!savedProfileData && (
                      <button 
                        onClick={() => userProfile.email && loadProfile(userProfile.email)}
                        disabled={!userProfile.email}
                        className="munich-btn munich-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check Existing
                      </button>
                    )}
                  </div>
                  
                  {profileError && (
                    <div className="munich-alert munich-alert-error">
                      {profileError}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Profile Dashboard
              <div className="space-y-6">
                <div className="munich-card">
                  <div className="munich-card-header relative overflow-hidden" style={{ 
                    backgroundColor: colors.lightGreen 
                  }}>
                    {/* Progressive Melange Background */}
                    <div className="absolute inset-0 progressive-melange opacity-20"></div>
                    
                    {/* Geometric corner accent */}
                    <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                      backgroundColor: colors.violet,
                      opacity: 0.8
                    }}></div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold flex items-center" style={{ 
                        color: colors.white,
                        fontSize: 'var(--text-2xl)'
                      }}>
                        <User className="w-6 h-6 mr-3" />
                        Welcome, {savedProfileData?.name || userProfile.name}!
                      </h3>
                      <p className="mt-2" style={{ 
                        color: colors.white,
                        opacity: 0.9,
                        fontSize: 'var(--text-base)'
                      }}>Your profile has been created successfully</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="munich-card relative overflow-hidden">
                        {/* Progressive Melange Background */}
                        <div className="absolute inset-0 progressive-melange opacity-3"></div>
                        
                        {/* Geometric corner accent */}
                        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-diamond geometric-float-counterclockwise" style={{ 
                          backgroundColor: colors.lightBlue,
                          opacity: 0.3
                        }}></div>
                        
                        <div className="munich-card-body relative z-10">
                          <h4 className="font-medium mb-4" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-lg)'
                          }}>Personal Info</h4>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Name: {savedProfileData?.name || userProfile.name}</p>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Email: {savedProfileData?.email || userProfile.email}</p>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Experience: {savedProfileData?.experience || userProfile.experience}</p>
                          <p style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Member since: {savedProfileData?.created_date || new Date().toISOString().split('T')[0]}</p>
                        </div>
                      </div>
                      
                      <div className="munich-card relative overflow-hidden">
                        {/* Progressive Melange Background */}
                        <div className="absolute inset-0 progressive-melange opacity-3"></div>
                        
                        {/* Geometric corner accent */}
                        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-octagon geometric-float-counterclockwise" style={{ 
                          backgroundColor: colors.lightGreen,
                          opacity: 0.3,
                          animationDelay: '1s'
                        }}></div>
                        
                        <div className="munich-card-body relative z-10">
                          <h4 className="font-medium mb-4" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-lg)'
                          }}>Running Goals</h4>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Goal Race: {savedProfileData?.goalRaceDistance || userProfile.goalRaceDistance}</p>
                          <p className="mb-2" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Goal Time: {savedProfileData?.goalRaceTime || userProfile.goalRaceTime || 'Not set'}</p>
                          <p style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>Weekly Mileage: {savedProfileData?.weekly_mileage || userProfile.weeklyMileage || 'Not set'} miles</p>
                        </div>
                      </div>
                      
                      <div className="munich-card relative overflow-hidden">
                        {/* Progressive Melange Background */}
                        <div className="absolute inset-0 progressive-melange opacity-3"></div>
                        
                        {/* Geometric corner accent */}
                        <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-square geometric-float-counterclockwise" style={{ 
                          backgroundColor: colors.violet,
                          opacity: 0.3,
                          animationDelay: '2s'
                        }}></div>
                        
                        <div className="munich-card-body relative z-10">
                          <h4 className="font-medium mb-4 flex items-center" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-lg)'
                          }}>
                            <Activity className="w-4 h-4 mr-2" />
                            GoldenPace Progress
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span style={{ 
                                color: colors.black,
                                fontSize: 'var(--text-sm)'
                              }}>Current GoldenPace:</span>
                              <span className="font-bold" style={{ 
                                color: colors.violet,
                                fontSize: 'var(--text-lg)'
                              }}>
                                {savedProfileData?.currentGoldenPace || goldenPace || 'Not calculated'}
                              </span>
                            </div>
                            
                            {savedProfileData?.projectedGoldenPace && (
                              <div className="flex justify-between items-center">
                                <span style={{ 
                                  color: colors.black,
                                  fontSize: 'var(--text-sm)'
                                }}>6-Week Projection:</span>
                                <span className="font-bold" style={{ 
                                  color: colors.lightGreen,
                                  fontSize: 'var(--text-lg)'
                                }}>
                                  {savedProfileData.projectedGoldenPace}
                                </span>
                              </div>
                            )}
                            
                            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${colors.gray}` }}>
                              <div className="flex justify-between text-xs">
                                <span style={{ color: colors.black }}>Training Sessions: {trainingHistory.length}</span>
                                <span style={{ color: colors.black }}>Personal Bests: {Object.keys(personalBests).length}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GoldenPace Progression Chart */}
                    {savedProfileData?.currentGoldenPace && savedProfileData?.trainingStartDate && (
                      <div className="mt-8">
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                            backgroundColor: colors.lightBlue,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-6 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-xl)'
                            }}>
                              <TrendingUp className="w-5 h-5 mr-2" style={{ color: colors.lightBlue }} />
                              GoldenPace Progression Forecast
                            </h4>
                            
                            <div className="mb-4 text-sm" style={{ color: colors.darkGreen }}>
                              <p>Projected improvement: +1 VDOT point every 6 weeks (average training consistency)</p>
                              <p>Based on {savedProfileData.weekly_mileage || 20} miles/week at your experience level</p>
                            </div>
                            
                            {/* Simple ASCII-style progression chart */}
                            <div className="bg-white p-6 rounded-lg border" style={{ borderColor: colors.gray }}>
                              <div className="space-y-2">
                                {(() => {
                                  const progression = generateGoldenPaceProgression(
                                    savedProfileData.currentGoldenPace, 
                                    savedProfileData.trainingStartDate, 
                                    savedProfileData.weekly_mileage || 20,
                                    26 // 6 months
                                  );
                                  
                                  return progression.filter((_, index) => index % 2 === 0).slice(0, 7).map((point, index) => {
                                    const isCurrentWeek = point.week === 0;
                                    const barWidth = Math.min(100, ((point.goldenPace - savedProfileData.currentGoldenPace) / 6) * 100 + 20);
                                    
                                    return (
                                      <div key={point.week} className="flex items-center space-x-3">
                                        <div className="w-20 text-xs font-medium" style={{ color: colors.black }}>
                                          {point.week === 0 ? 'Current' : `Week ${point.week}`}
                                        </div>
                                        <div className="flex-1 relative">
                                          <div className="h-6 rounded" style={{ 
                                            backgroundColor: colors.lightGray,
                                            border: `1px solid ${colors.gray}`
                                          }}>
                                            <div 
                                              className="h-full rounded transition-all duration-500"
                                              style={{ 
                                                width: `${barWidth}%`,
                                                backgroundColor: isCurrentWeek ? colors.violet : colors.lightBlue,
                                                backgroundImage: isCurrentWeek ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)' : 'none'
                                              }}
                                            />
                                          </div>
                                          <div className="absolute right-2 top-0 h-6 flex items-center">
                                            <span className="text-xs font-bold" style={{ 
                                              color: colors.black,
                                              textShadow: '0 0 3px white'
                                            }}>
                                              {point.goldenPace}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="w-16 text-xs" style={{ color: colors.darkGreen }}>
                                          {point.week === 0 ? 'Current' : 
                                            point.goldenPace > savedProfileData.currentGoldenPace ? 
                                            `+${(point.goldenPace - savedProfileData.currentGoldenPace).toFixed(1)}` : '---'}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                              
                              <div className="mt-4 pt-4 text-xs" style={{ 
                                borderTop: `1px solid ${colors.gray}`,
                                color: colors.darkGreen
                              }}>
                                <p>💡 <strong>Pro Tip:</strong> Consistency is key! Maintain your weekly mileage and training intensity for steady progression.</p>
                                <p>📈 Your projected GoldenPace in 6 months: <strong>{savedProfileData.projectedGoldenPace || 'N/A'}</strong></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Training Data Section */}
                    <div className="mt-8 space-y-6">
                      {/* Personal Bests Section */}
                      {Object.keys(personalBests).length > 0 && (
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                            backgroundColor: colors.orange,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-4 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-lg)'
                            }}>
                              <Trophy className="w-5 h-5 mr-2" style={{ color: colors.orange }} />
                              Personal Bests
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(personalBests).map(([distance, time]) => (
                                <div key={distance} className="text-center p-3 rounded" style={{ 
                                  backgroundColor: colors.lightGray,
                                  border: `1px solid ${colors.gray}`
                                }}>
                                  <div className="font-medium" style={{ 
                                    color: colors.black,
                                    fontSize: 'var(--text-sm)'
                                  }}>{distance}</div>
                                  <div className="font-bold" style={{ 
                                    color: colors.orange,
                                    fontSize: 'var(--text-lg)'
                                  }}>{time}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recent Training History */}
                      {trainingHistory.length > 0 && (
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-octagon" style={{ 
                            backgroundColor: colors.lightBlue,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-4 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-lg)'
                            }}>
                              <Calendar className="w-5 h-5 mr-2" style={{ color: colors.lightBlue }} />
                              Recent Training History
                            </h4>
                            <div className="space-y-3">
                              {trainingHistory.slice(-5).reverse().map((session, index) => (
                                <div key={index} className="p-4 rounded" style={{ 
                                  backgroundColor: colors.lightGray,
                                  border: `1px solid ${colors.gray}`
                                }}>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium" style={{ 
                                      color: colors.black,
                                      fontSize: 'var(--text-sm)'
                                    }}>{session.type}</span>
                                    <span style={{ 
                                      color: colors.gray,
                                      fontSize: 'var(--text-xs)'
                                    }}>{session.date}</span>
                                  </div>
                                  {session.distance && (
                                    <div style={{ 
                                      color: colors.black,
                                      fontSize: 'var(--text-sm)'
                                    }}>
                                      Distance: {session.distance} • Time: {session.time}
                                    </div>
                                  )}
                                  {(session.feeling || session.effort) && (
                                    <div style={{ 
                                      color: colors.lightBlue,
                                      fontSize: 'var(--text-sm)'
                                    }}>
                                      Felt: {session.feeling} • Effort: {session.effort}
                                    </div>
                                  )}
                                  {session.location && (
                                    <div style={{ 
                                      color: colors.black,
                                      fontSize: 'var(--text-xs)',
                                      opacity: 0.8
                                    }}>
                                      {session.location}
                                      {session.weather && ` • ${session.weather}`}
                                    </div>
                                  )}
                                  {session.goldenPace && (
                                    <div style={{ 
                                      color: colors.orange,
                                      fontSize: 'var(--text-sm)',
                                      fontWeight: '500'
                                    }}>
                                      GoldenPace: {session.goldenPace}
                                    </div>
                                  )}
                                  {session.notes && (
                                    <div className="mt-2" style={{ 
                                      color: colors.gray,
                                      fontSize: 'var(--text-xs)',
                                      fontStyle: 'italic'
                                    }}>
                                      "{session.notes}"
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Completed Training Plans */}
                      {trainingPlansCompleted.length > 0 && (
                        <div className="munich-card relative overflow-hidden">
                          <div className="absolute inset-0 progressive-melange opacity-3"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 geometric-square" style={{ 
                            backgroundColor: colors.violet,
                            opacity: 0.4
                          }}></div>
                          
                          <div className="munich-card-body relative z-10">
                            <h4 className="font-medium mb-4 flex items-center" style={{ 
                              color: colors.black,
                              fontSize: 'var(--text-lg)'
                            }}>
                              <CheckCircle className="w-5 h-5 mr-2" style={{ color: colors.violet }} />
                              Completed Training Plans
                            </h4>
                            <div className="space-y-2">
                              {trainingPlansCompleted.map((plan, index) => (
                                <div key={index} className="flex justify-between items-center p-3 rounded" style={{ 
                                  backgroundColor: colors.lightGray,
                                  border: `1px solid ${colors.gray}`
                                }}>
                                  <span style={{ 
                                    color: colors.black,
                                    fontSize: 'var(--text-sm)'
                                  }}>{plan.name}</span>
                                  <span style={{ 
                                    color: colors.gray,
                                    fontSize: 'var(--text-xs)'
                                  }}>{plan.completedDate}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8 flex flex-wrap gap-4">
                      <button
                        onClick={() => setActiveTab('calculator')}
                        className="munich-btn munich-btn-primary relative"
                      >
                        Calculate GoldenPace
                        {/* Geometric accent on button */}
                        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond" style={{ 
                          backgroundColor: colors.lightGreen
                        }}></div>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('plans')}
                        className="munich-btn munich-btn-secondary relative"
                      >
                        Get Training Plans
                        {/* Geometric accent on button */}
                        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-octagon" style={{ 
                          backgroundColor: colors.violet
                        }}></div>
                      </button>
                      
                      <button
                        onClick={() => setShowProfileDashboard(false)}
                        className="munich-btn munich-btn-outline"
                      >
                        Edit Profile
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowTrainingLogForm(true);
                        }}
                        className="munich-btn munich-btn-outline relative"
                        style={{ color: colors.lightBlue, borderColor: colors.lightBlue }}
                      >
                        Log Training Session
                        <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
                          backgroundColor: colors.lightBlue,
                          opacity: 0.3
                        }}></div>
                      </button>
                      
                      <button
                        onClick={() => {
                          // Add demo data to showcase the full profile functionality
                          updatePersonalBest('5K', '24:30');
                          updatePersonalBest('10K', '51:45');
                          updatePersonalBest('Half Marathon', '1:54:20');
                          
                          addTrainingSession({
                            type: 'Tempo Run',
                            distance: '6 miles',
                            time: '42:00',
                            notes: 'Comfortably hard pace, felt strong'
                          });
                          
                          addTrainingSession({
                            type: 'Long Run',
                            distance: '12 miles',
                            time: '1:32:00',
                            notes: 'Progressive long run, negative split'
                          });
                          
                          completeTrainingPlan('5K Training Plan - Beginner');
                        }}
                        className="munich-btn munich-btn-outline relative"
                        style={{ color: colors.orange, borderColor: colors.orange }}
                      >
                        Add Demo Data
                        <div className="absolute top-0 right-0 w-3 h-3 geometric-octagon" style={{ 
                          backgroundColor: colors.orange,
                          opacity: 0.3
                        }}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Training Log Form Modal */}
        {showTrainingLogForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="munich-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="munich-card-header relative overflow-hidden" style={{ 
                backgroundColor: colors.lightBlue 
              }}>
                <div className="absolute inset-0 progressive-melange opacity-20"></div>
                <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                  backgroundColor: colors.orange,
                  opacity: 0.8
                }}></div>
                
                <div className="relative z-10">
                  <h3 className="font-bold flex items-center" style={{ 
                    color: colors.white,
                    fontSize: 'var(--text-2xl)'
                  }}>
                    <Activity className="w-6 h-6 mr-3" />
                    Log Training Session
                  </h3>
                  <p className="mt-2" style={{ 
                    color: colors.white,
                    opacity: 0.9,
                    fontSize: 'var(--text-base)'
                  }}>Track your workout details and how you felt</p>
                </div>
              </div>
              
              <div className="p-8">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  
                  // Add the training session
                  addTrainingSession({
                    type: trainingLogData.type,
                    distance: trainingLogData.distance,
                    time: trainingLogData.time,
                    feeling: trainingLogData.feeling,
                    effort: trainingLogData.effort,
                    notes: trainingLogData.notes,
                    weather: trainingLogData.weather,
                    location: trainingLogData.location
                  });
                  
                  // Check if this is a race/PR
                  if (trainingLogData.type.includes('Race') && trainingLogData.distance && trainingLogData.time) {
                    const currentPB = personalBests[trainingLogData.distance];
                    if (!currentPB || parseTimeToSeconds(trainingLogData.time) < parseTimeToSeconds(currentPB)) {
                      updatePersonalBest(trainingLogData.distance, trainingLogData.time);
                    }
                  }
                  
                  // Reset form and close
                  setTrainingLogData({
                    type: 'Easy Run',
                    distance: '',
                    time: '',
                    feeling: 'Good',
                    effort: 'Easy',
                    notes: '',
                    weather: '',
                    location: ''
                  });
                  setShowTrainingLogForm(false);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Workout Type
                      </label>
                      <select
                        value={trainingLogData.type}
                        onChange={(e) => setTrainingLogData({...trainingLogData, type: e.target.value})}
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      >
                        <option value="Easy Run">Easy Run</option>
                        <option value="Tempo Run">Tempo Run</option>
                        <option value="Interval Training">Interval Training</option>
                        <option value="Long Run">Long Run</option>
                        <option value="Recovery Run">Recovery Run</option>
                        <option value="Race">Race</option>
                        <option value="Cross Training">Cross Training</option>
                        <option value="Strength Training">Strength Training</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Distance
                      </label>
                      <input
                        type="text"
                        value={trainingLogData.distance}
                        onChange={(e) => setTrainingLogData({...trainingLogData, distance: e.target.value})}
                        placeholder="e.g., 5K, 6 miles, 10K"
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Time
                      </label>
                      <input
                        type="text"
                        value={trainingLogData.time}
                        onChange={(e) => setTrainingLogData({...trainingLogData, time: e.target.value})}
                        placeholder="e.g., 25:00, 1:30:45"
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        How did you feel?
                      </label>
                      <select
                        value={trainingLogData.feeling}
                        onChange={(e) => setTrainingLogData({...trainingLogData, feeling: e.target.value})}
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Tired">Tired</option>
                        <option value="Struggled">Struggled</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Effort Level
                      </label>
                      <select
                        value={trainingLogData.effort}
                        onChange={(e) => setTrainingLogData({...trainingLogData, effort: e.target.value})}
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Comfortably Hard">Comfortably Hard</option>
                        <option value="Hard">Hard</option>
                        <option value="Very Hard">Very Hard</option>
                        <option value="Max Effort">Max Effort</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-medium mb-3" style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={trainingLogData.location}
                        onChange={(e) => setTrainingLogData({...trainingLogData, location: e.target.value})}
                        placeholder="e.g., Local park, Track, Treadmill"
                        className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                        style={{ 
                          borderColor: colors.gray,
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block font-medium mb-3" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-sm)'
                    }}>
                      Weather
                    </label>
                    <input
                      type="text"
                      value={trainingLogData.weather}
                      onChange={(e) => setTrainingLogData({...trainingLogData, weather: e.target.value})}
                      placeholder="e.g., Sunny 70°F, Rainy, Hot and humid"
                      className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                      style={{ 
                        borderColor: colors.gray,
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <label className="block font-medium mb-3" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-sm)'
                    }}>
                      Notes
                    </label>
                    <textarea
                      value={trainingLogData.notes}
                      onChange={(e) => setTrainingLogData({...trainingLogData, notes: e.target.value})}
                      placeholder="How did the workout go? Any observations, goals achieved, etc."
                      rows={4}
                      className="w-full p-3 border-2 rounded focus:outline-none transition-colors"
                      style={{ 
                        borderColor: colors.gray,
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      type="submit"
                      className="munich-btn munich-btn-primary relative"
                    >
                      Save Training Session
                      <div className="absolute top-0 right-0 w-4 h-4 geometric-diamond" style={{ 
                        backgroundColor: colors.lightGreen
                      }}></div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowTrainingLogForm(false)}
                      className="munich-btn munich-btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Blog/Articles Section - Munich 1972 Design */}
        {activeTab === 'blog' && !selectedArticle && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold" style={{ color: colors.black }}>
                Running Insights & Articles
              </h2>
              <p className="text-xl" style={{ color: colors.darkGreen }}>
                Evidence-based training articles and VDOT insights from professional coaches
              </p>
            </div>

            {/* Featured Articles */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold" style={{ color: colors.black }}>
                Featured Articles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <div key={article.id} className="munich-card relative overflow-hidden group cursor-pointer transition-all hover:shadow-xl" 
                       onClick={() => setSelectedArticle(article)}>
                    <div className="absolute top-2 right-2 w-6 h-6 geometric-diamond" style={{ 
                      backgroundColor: colors.lightBlue,
                      opacity: 0.7
                    }}></div>
                    
                    <div className="munich-card-body">
                      <div className="mb-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ 
                          backgroundColor: colors.lightBlue + '20',
                          color: colors.lightBlue
                        }}>
                          {article.category.toUpperCase()}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors" style={{ color: colors.black }}>
                        {article.title}
                      </h4>
                      
                      <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: colors.silver }}>
                          {article.readTime}
                        </span>
                        <button className="text-xs font-medium px-4 py-2 rounded-full transition-all hover:shadow-md" style={{
                          backgroundColor: colors.lightBlue,
                          color: colors.white
                        }}>
                          Read Article
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Articles */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold" style={{ color: colors.black }}>
                All Articles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <div key={article.id} className="munich-card relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg border-l-4" 
                       style={{ borderLeftColor: article.featured ? colors.orange : colors.lightGreen }}
                       onClick={() => setSelectedArticle(article)}>
                    
                    <div className="munich-card-body">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-medium px-2 py-1 rounded" style={{ 
                          backgroundColor: article.featured ? colors.orange + '20' : colors.lightGreen + '20',
                          color: article.featured ? colors.orange : colors.lightGreen
                        }}>
                          {article.category}
                        </span>
                        {article.featured && (
                          <Star className="w-4 h-4" style={{ color: colors.orange }} />
                        )}
                      </div>
                      
                      <h4 className="text-base font-bold mb-2 group-hover:text-blue-600 transition-colors" style={{ color: colors.black }}>
                        {article.title}
                      </h4>
                      
                      <p className="text-sm mb-3" style={{ color: colors.darkGreen }}>
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: colors.silver }}>
                          {article.readTime}
                        </span>
                        <span className="font-medium group-hover:underline" style={{ color: colors.lightBlue }}>
                          Read more →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Article Reader Modal */}
        {activeTab === 'blog' && selectedArticle && (
          <div className="space-y-6">
            {/* Article Header */}
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="munich-btn munich-btn-outline"
              >
                ← Back to Articles
              </button>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto">
              <div className="munich-card">
                <div className="munich-card-body space-y-6">
                  <div className="border-b pb-6" style={{ borderColor: colors.border }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ 
                        backgroundColor: colors.lightBlue + '20',
                        color: colors.lightBlue
                      }}>
                        {selectedArticle.category}
                      </span>
                      <span className="text-sm" style={{ color: colors.silver }}>
                        {selectedArticle.readTime}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.black }}>
                      {selectedArticle.title}
                    </h1>
                    <p className="text-lg" style={{ color: colors.darkGreen }}>
                      {selectedArticle.excerpt}
                    </p>
                  </div>

                  <div className="prose prose-lg max-w-none" style={{ color: colors.black }}>
                    <div 
                      className="article-content"
                      style={{ 
                        lineHeight: '1.8',
                        fontSize: '1.1rem'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: selectedArticle.content
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/^# (.*?)$/gm, '<h2 style="font-size: 1.8rem; font-weight: bold; margin: 2rem 0 1rem 0; color: ' + colors.black + ';">$1</h2>')
                          .replace(/^## (.*?)$/gm, '<h3 style="font-size: 1.4rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: ' + colors.darkGreen + ';">$1</h3>')
                          .replace(/^\* (.*?)$/gm, '<li>$1</li>')
                          .replace(/(<li>.*<\/li>)/gs, '<ul style="margin: 1rem 0; padding-left: 1.5rem; list-style: disc;">$1</ul>')
                          .replace(/^(?!<[hul])/gm, '<p>')
                          .replace(/$(?!<\/)/gm, '</p>')
                      }} 
                    />
                  </div>

                  {/* Article Actions */}
                  <div className="border-t pt-6 flex justify-between items-center" style={{ borderColor: colors.border }}>
                    <button 
                      onClick={() => setSelectedArticle(null)}
                      className="munich-btn munich-btn-outline"
                    >
                      ← Back to Articles
                    </button>
                    <div className="flex gap-2">
                      <button className="munich-btn munich-btn-primary">
                        Share Article
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}





In the Scudamore et al. (2018) study, researchers evaluated how well VDOT predicted VO2max and training paces. Here’s what they found:

* **VDOT underestimated VO2max** in recreational runners.
* **Interval paces** derived from VDOT (pIN) were often slower than actual VO2max pace.
* **Threshold paces** (pTH) were frequently overestimated, especially in trained athletes.

This misalignment can lead to real-world consequences: workouts that are too easy to stimulate adaptation or too hard to recover from. For the recreational runner, VDOT may suggest interval sessions that fail to elicit peak aerobic demand. For the competitive runner, it may push threshold sessions into anaerobic territory, sabotaging endurance development.

---

**Enter Brad Hudson: Adaptive and Specific Beats Prescriptive**

Brad Hudson’s training philosophy revolves around the simple idea that no one-size-fits-all training plan can capture the variability of real athletes. In his book *Run Faster*, Hudson outlines an adaptive model that:

* Divides training into **general preparation** and **race-specific phases**.
* Emphasizes **responsiveness to athlete feedback**, not adherence to static paces.
* Encourages **goal-pace specificity** in the final 4-6 weeks before a target race.

He writes, “Anything more than 10% off pace lacks specific endurance.” In other words, if you're running your reps 30 seconds faster or slower than race pace, you're not training for your race—you're just training.

This is a key insight for our philosophy. Rather than relying on a generic Interval pace calculated by VDOT, we tailor reps to align with each athlete's actual race performance, recent data, and physiological response.

---

**Lessons from the Oregon System: Balance, Variation, Intelligence**

Bill Dellinger and Bill Bowerman, architects of the famed Oregon system, knew that running success wasn't just about grinding out miles. Their method emphasized:

* **Alternating hard and easy days** to optimize recovery.
* **Progressive overload** with ample room for adaptation.
* **Race-pace integration**, especially during peak periods.

Bowerman once said, “The idea that the harder you work, the better you get is just garbage. The greatest improvement is made by the man who works most intelligently.”

This wisdom speaks to the heart of our approach. Smart training doesn’t just avoid burnout—it accelerates progress.

---

**Modern Voices and Community Insights**

Even outside academic circles, runners are calling for change. In Reddit forums like r/AdvancedRunning and r/Running, athletes express skepticism about VDOT’s one-size-fits-all model. Comments like “VDOT doesn’t account for weight, economy, or mental strength” and “It predicts times but lacks nuance” are common.

As GPS watches become more advanced, many runners notice discrepancies between VDOT predictions and actual performance. These observations confirm what science already suggests: formulas are helpful, but incomplete.

---

**How Unforgiving Minute Trains Smarter**

Here’s how we do it differently:

1. **Race-Based Calibration**: We anchor workouts to your actual race data, not just recent time trials.
2. **Adjustable Pace Targets**: Interval and Repetition paces are tailored based on your strengths and goals.
3. **Adaptation {"> "} Prescription**: We update your plan weekly based on performance, feedback, and life events.
4. **Intelligent Periodization**: We mirror the Oregon system's alternating load cycles and progression structure.

The result? You train for the runner you are today—and become the runner you want to be tomorrow.

---

**Conclusion: The New Standard**

VDOT was revolutionary in its time. But training science and athlete needs have evolved. With mounting evidence from physiology labs, elite coaches, and the runners themselves, it’s clear: **the future is personalized, adaptive, and race-specific**.

At Unforgiving Minute, we don’t just crunch your numbers. We understand your story. We guide you through your most unforgiving minutes and help you emerge stronger—with training that fits your life, not a table.

        {/* Premium Training Plans Section - Munich 1972 Design */}
        {activeTab === 'premium' && (
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
        )}
      </main>

      {/* Footer - Munich 1972 Geometric Style */}
      <footer className="py-6 sm:py-8 relative overflow-hidden" style={{ backgroundColor: colors.gray }}>
        {/* Progressive Melange Background */}
        <div className="absolute inset-0 progressive-melange opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3" style={{ color: colors.black }}>
                Unforgiving Minute Distance Running
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: colors.darkGreen }}>
                Professional distance running training with scientifically-based GoldenPace calculations.
              </p>
            </div>
            <div>
              <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3" style={{ color: colors.black }}>
                Quick Links
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <button 
                    onClick={() => setActiveTab('calculator')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    GoldenPace Calculator
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('plans')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Training Plans
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('blog')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Articles
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('premium')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Premium Plans
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className="transition-colors duration-200 hover:text-blue-600"
                    style={{ color: colors.darkGreen }}
                  >
                    Profile
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3" style={{ color: colors.black }}>
                Get Started
              </h4>
              <button
                onClick={() => setActiveTab('calculator')}
                className="munich-btn munich-btn-primary"
              >
                Calculate Your GoldenPace
              </button>
            </div>
          </div>
          <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6 text-center text-xs sm:text-sm" style={{ borderColor: colors.border }}>
            <p style={{ color: colors.darkGreen }}>
              &copy; 2024 Unforgiving Minute Distance Running. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="munich-card max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="munich-card-header relative overflow-hidden" style={{ 
              backgroundColor: colors.violet 
            }}>
              <div className="absolute inset-0 progressive-melange opacity-20"></div>
              <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                backgroundColor: colors.orange,
                opacity: 0.8
              }}></div>
              
              <div className="relative z-10">
                <h3 className="font-bold flex items-center justify-between" style={{ 
                  color: colors.white,
                  fontSize: 'var(--text-2xl)'
                }}>
                  <span className="flex items-center">
                    <BookOpen className="w-6 h-6 mr-3" />
                    Content Management Admin Panel
                  </span>
                  <button
                    onClick={() => setShowAdminPanel(false)}
                    className="text-white hover:text-gray-200"
                  >
                    ✕
                  </button>
                </h3>
                <p className="mt-2" style={{ 
                  color: colors.white,
                  opacity: 0.9,
                  fontSize: 'var(--text-base)'
                }}>Manage blog posts, premium training plans, and coaching services</p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-8">
                {/* Blog Posts Management */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-octagon" style={{ 
                    backgroundColor: colors.lightBlue,
                    opacity: 0.4
                  }}></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>Articles & Training Insights</h4>
                    
                    <div className="space-y-4">
                      <p style={{ color: colors.darkGreen, fontSize: 'var(--text-sm)' }}>
                        <strong>Current Location:</strong> Lines 2500-2650 in RunningTrainingApp.jsx
                      </p>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGray }}>
                        <h5 className="font-medium mb-2" style={{ color: colors.black }}>How to Add Blog Posts:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: colors.black }}>
                          <li>Find the "Featured Articles" section around line 2510</li>
                          <li>Copy the existing article card structure</li>
                          <li>Replace the content with your article details:</li>
                        </ol>
                        
                        <div className="mt-4 p-3 bg-gray-800 rounded text-green-400 font-mono text-xs overflow-x-auto">
{`<div className="munich-card relative overflow-hidden group">
  <div className="munich-card-body">
    <div className="mb-4">
      <span className="text-xs font-medium px-3 py-1" style={{ 
        backgroundColor: colors.lightBlue,
        color: colors.white 
      }}>
        YOUR_CATEGORY
      </span>
    </div>
    
    <h4 className="text-lg font-bold mb-3" style={{ color: colors.black }}>
      Your Article Title
    </h4>
    
    <p className="text-sm mb-4" style={{ color: colors.darkGreen }}>
      Your article description and preview text...
    </p>
    
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: colors.silver }}>
        X min read
      </span>
      <button className="munich-btn munich-btn-outline text-xs px-3 py-1">
        Read Article
      </button>
    </div>
  </div>
</div>`}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGreen, color: colors.white }}>
                        <h5 className="font-medium mb-2">💡 Pro Tip:</h5>
                        <p className="text-sm">Use categories like: TRAINING SCIENCE, NUTRITION, RACE STRATEGY, INJURY PREVENTION</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Training Plans Management */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-square" style={{ 
                    backgroundColor: colors.orange,
                    opacity: 0.4
                  }}></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>⭐ Premium Training Plans</h4>
                    
                    <div className="space-y-4">
                      <p style={{ color: colors.darkGreen, fontSize: 'var(--text-sm)' }}>
                        <strong>Current Location:</strong> Lines 2700-2850 in RunningTrainingApp.jsx
                      </p>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGray }}>
                        <h5 className="font-medium mb-2" style={{ color: colors.black }}>How to Add Premium Plans:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: colors.black }}>
                          <li>Find the "Premium Plans Grid" section around line 2700</li>
                          <li>Copy an existing plan card (like the "5K Mastery Program")</li>
                          <li>Customize the pricing, features, and benefits</li>
                          <li>Add payment integration to the button</li>
                        </ol>
                        
                        <div className="mt-4 p-3 bg-gray-800 rounded text-green-400 font-mono text-xs overflow-x-auto">
{`<div className="munich-card relative overflow-hidden group">
  <div className="munich-card-header">
    <div className="flex items-center justify-between">
      <h4 className="text-xl font-bold" style={{ color: colors.black }}>
        Your Plan Name
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
        <span className="text-3xl font-bold" style={{ color: colors.black }}>$XX</span>
        <span className="text-lg line-through ml-2" style={{ color: colors.silver }}>$XX</span>
      </div>
      <p className="text-sm" style={{ color: colors.darkGreen }}>XX-week program</p>
    </div>
    
    <ul className="space-y-2 mb-6 text-sm">
      <li className="flex items-start">
        <span style={{ color: colors.lightBlue }}>✓</span>
        <span className="ml-2" style={{ color: colors.black }}>Feature 1</span>
      </li>
      <!-- Add more features -->
    </ul>
    
    <button className="munich-btn munich-btn-primary w-full">
      Get Plan Name
    </button>
  </div>
</div>`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Coaching Management */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                    backgroundColor: colors.yellow,
                    opacity: 0.4
                  }}></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>Personal Coaching Services</h4>
                    
                    <div className="space-y-4">
                      <p style={{ color: colors.darkGreen, fontSize: 'var(--text-sm)' }}>
                        <strong>Current Location:</strong> Lines 2825-2870 in RunningTrainingApp.jsx
                      </p>
                      
                      <div className="p-4 rounded" style={{ backgroundColor: colors.lightGray }}>
                        <h5 className="font-medium mb-2" style={{ color: colors.black }}>Personal Coaching Features:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: colors.black }}>
                          <li>Monthly pricing: $297/month (currently set)</li>
                          <li>Features: Weekly sessions, custom plans, 24/7 support</li>
                          <li>Call-to-action: "Schedule Consultation" button</li>
                        </ul>
                        
                        <div className="mt-3 p-3" style={{ backgroundColor: colors.yellow, color: colors.black }}>
                          <h6 className="font-medium">💰 Payment Integration Needed:</h6>
                          <p className="text-sm mt-1">Add Stripe/PayPal integration to the coaching consultation button</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="munich-card relative overflow-hidden">
                  <div className="absolute inset-0 progressive-melange opacity-3"></div>
                  
                  <div className="munich-card-body relative z-10">
                    <h4 className="font-bold mb-4" style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-xl)'
                    }}>Quick Actions</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium" style={{ color: colors.black }}>Development Tasks:</h5>
                        <ul className="space-y-2 text-sm" style={{ color: colors.darkGreen }}>
                          <li>• Set up Django backend for dynamic content</li>
                          <li>• Add Stripe payment integration</li>
                          <li>• Create content upload interface</li>
                          <li>• Add user authentication system</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium" style={{ color: colors.black }}>Content Strategy:</h5>
                        <ul className="space-y-2 text-sm" style={{ color: colors.darkGreen }}>
                          <li>• Write 5-10 foundational articles</li>
                          <li>• Create 3-5 premium training plans</li>
                          <li>• Set up coaching intake form</li>
                          <li>• Add testimonials and success stories</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="munich-btn munich-btn-primary"
                >
                  Close Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="munich-card w-full max-w-md relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={closePurchaseModal}
                className="text-2xl font-bold leading-none"
                style={{ color: colors.silver }}
                disabled={purchaseLoading}
              >
                ×
              </button>
            </div>
            
            <div className="munich-card-header">
              <h3 className="text-xl font-bold pr-8" style={{ color: colors.black }}>
                Purchase {selectedPlanForPurchase?.name}
              </h3>
            </div>
            
            <div className="munich-card-body">
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold" style={{ color: colors.black }}>
                    ${selectedPlanForPurchase?.price}
                  </span>
                  {selectedPlanForPurchase?.id === 'personal-coaching' && (
                    <span className="ml-1 text-sm" style={{ color: colors.darkGreen }}>
                      /month
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: colors.silver }}>
                  {selectedPlanForPurchase?.id === 'personal-coaching' 
                    ? 'Monthly subscription - cancel anytime'
                    : 'One-time purchase - instant access'
                  }
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-3 rounded" style={{ backgroundColor: colors.lightBlue + '20' }}>
                  <p className="text-sm" style={{ color: colors.black }}>
                    ✓ Instant access after payment
                  </p>
                  <p className="text-sm" style={{ color: colors.black }}>
                    ✓ 30-day money back guarantee
                  </p>
                  <p className="text-sm" style={{ color: colors.black }}>
                    ✓ Access from your profile dashboard
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closePurchaseModal}
                  className="munich-btn munich-btn-outline flex-1"
                  disabled={purchaseLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={processPurchase}
                  className="munich-btn munich-btn-primary flex-1"
                  disabled={purchaseLoading}
                >
                  {purchaseLoading ? 'Processing...' : 'Purchase Now'}
                </button>
              </div>
              
              <p className="text-xs text-center mt-3" style={{ color: colors.silver }}>
                Secure payment processing • SSL encrypted
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Success Message */}
      {purchaseSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="munich-card" style={{ backgroundColor: colors.darkGreen }}>
            <div className="p-4 text-center">
              <p className="font-bold text-white">
                ✓ Purchase Successful!
              </p>
              <p className="text-sm text-white opacity-90">
                Check your profile for access
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunningTrainingApp;