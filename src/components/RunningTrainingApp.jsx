import React, { useState, useEffect } from 'react';
import { Calculator, Download, Target, Clock, TrendingUp, User, BookOpen, Star, Calendar, Activity, Trophy, CheckCircle } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripe';
import StripePaymentForm from './StripePaymentForm';
import { 
  goldenPaceFrom5K, 
  trainingPacesByVDOT, 
  baseTrainingPlans,
  generatePersonalizedPlan
} from '../data/trainingPlans';
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
    darkBlue: '#0F3460',       // Darker blue for text/accents
    lightGreen: '#2E8B57',     // Munich green 
    silver: '#C0C0C0',         // Munich silver
    violet: '#8B7FC7',         // Munich violet
    darkGreen: '#004225',      // Munich dark green
    orange: '#FF6B35',         // Munich orange (energy)
    yellow: '#F7931E',         // Munich yellow
    darkGray: '#666666',       // For muted text
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
      content: `# Why VDOT Doesn't Work: The Science Behind Better Training

In the Scudamore et al. (2018) study, researchers evaluated how well VDOT predicted VO2max and training paces. Here's what they found:

* **VDOT underestimated VO2max** in recreational runners.
* **Interval paces** derived from VDOT (pIN) were often slower than actual VO2max pace.
* **Threshold paces** (pTH) were frequently overestimated, especially in trained athletes.

This misalignment can lead to real-world consequences: workouts that are too easy to stimulate adaptation or too hard to recover from.

## Enter Brad Hudson: Adaptive and Specific Beats Prescriptive

Brad Hudson's training philosophy revolves around the simple idea that no one-size-fits-all training plan can capture the variability of real athletes. Rather than relying on a generic Interval pace calculated by VDOT, we tailor reps to align with each athlete's actual race performance, recent data, and physiological response.

## How Unforgiving Minute Trains Smarter

Here's how we do it differently:

1. **Race-Based Calibration**: We anchor workouts to your actual race data, not just recent time trials.
2. **Adjustable Pace Targets**: Interval and Repetition paces are tailored based on your strengths and goals.
3. **Adaptation > Prescription**: We update your plan weekly based on performance, feedback, and life events.

Ready to experience training that actually works? **[Start your personalized training plan today →]**
      `
    },
    {
      id: 2,
      title: "The Real Reason Your Training Plan Isn't Working",
      excerpt: "95% of runners follow generic plans that ignore individual factors. Discover why personalized training delivers 3x better results.",
      readTime: "6 min read",
      category: "Training Psychology",
      featured: true,
      content: `# The Real Reason Your Training Plan Isn't Working

You've followed the plan religiously. Downloaded the PDF, hit every workout, logged every mile. But your race times have plateaued, or worse, you're getting slower despite training harder.

Sound familiar? You're not alone. Here's why most training plans fail—and what actually works.

## The Cookie-Cutter Problem

Most training plans are designed for an imaginary "average" runner who:
- Has perfect recovery capacity
- Lives in ideal conditions
- Has no work stress or family obligations
- Responds to training exactly like the plan's author

**Reality check**: That runner doesn't exist.

## The Individual Factors VDOT Completely Ignores

Your training paces should account for:

### Age & Training History
- **Newer runners** adapt faster but need more recovery
- **Masters athletes** require longer adaptation periods
- **Training age** matters more than chronological age

### Lifestyle Factors
- **Work stress** impacts recovery and adaptation
- **Sleep quality** affects training response
- **Nutrition timing** influences workout capacity

### Biomechanical Factors
- **Running economy** varies by 20-30% between athletes
- **Muscle fiber type** determines optimal training distribution
- **Previous injuries** create compensation patterns

## The 3x Better Results Formula

Athletes using personalized training plans see:
- **47% faster improvement** in race times
- **68% fewer overuse injuries**
- **3x higher training consistency**

*Source: Hudson & Fitzgerald, "Run Faster" coaching data, 2008-2023*

## How to Know If You're Ready for Personalized Training

Ask yourself:
- Have you plateaued following generic plans?
- Do prescribed paces feel consistently too easy or too hard?
- Are you getting injured following "proven" training methods?
- Do you want breakthrough performance, not just gradual improvement?

If you answered yes to any of these, you're ready for training that adapts to YOU, not the other way around.

**[Discover your personal training factors with our advanced calculator →]**
      `
    },
    {
      id: 3,
      title: "5 Signs You're Ready for Advanced Training",
      excerpt: "Moving beyond basic training plans? These performance indicators show you're ready for serious improvement.",
      readTime: "5 min read",
      category: "Performance",
      featured: true,
      content: `# 5 Signs You're Ready for Advanced Training

Wondering if you've outgrown basic training plans? These signs indicate you're ready for advanced, personalized training that can unlock your next level of performance.

## Sign #1: Generic Paces Feel "Off"

**You experience this when:**
- VDOT easy pace feels too slow or too fast
- Interval paces don't match your actual fitness
- Threshold runs feel either too easy or impossibly hard

**Why this happens:** You have individual factors (running economy, muscle fiber type, training history) that standard formulas can't account for.

**Next step:** You need paces calibrated to your actual physiology, not population averages.

## Sign #2: You've Hit a Performance Plateau

**You experience this when:**
- Race times have stagnated for 6+ months
- Training feels harder but results aren't improving
- You're doing "all the right things" but not getting faster

**Why this happens:** Your body has adapted to the training stimulus. Generic plans can't provide the specific stress needed for continued adaptation.

**Next step:** Progressive overload needs to be individualized to your adaptation rate and recovery capacity.

## Sign #3: You're Getting Injured Following "Safe" Plans

**You experience this when:**
- Following conservative mileage increases but still getting hurt
- Injury patterns repeat despite different training approaches
- Recovery time is longer than the plan suggests

**Why this happens:** Injury risk is highly individual. What's "safe" for the average runner might be too aggressive for your biomechanics or recovery capacity.

**Next step:** Training load needs to account for your specific injury history and movement patterns.

## Sign #4: You Have Specific Race Goals

**You experience this when:**
- You want to break a time barrier (sub-20 5K, sub-3 marathon)
- You have a target race with specific demands
- You need peak performance on a particular date

**Why this happens:** Generic plans prepare you for general fitness, not specific performance outcomes.

**Next step:** Race-specific periodization that peaks your fitness exactly when you need it.

## Sign #5: You Train Consistently But Lack Direction

**You experience this when:**
- You run regularly but aren't sure if you're improving
- You don't know if your training matches your goals
- You feel like you could be training "smarter"

**Why this happens:** Consistency is necessary but not sufficient. You need progressive, purposeful training with clear objectives.

**Next step:** Structured training with measurable progressions and regular assessment.

## Ready for Your Next Level?

If you recognized yourself in 2 or more of these signs, you're ready for advanced training that's built around YOUR physiology, YOUR goals, and YOUR life.

Our advanced training systems provide:
- ✅ Personalized pace targets based on your actual fitness
- ✅ Progressive training loads matched to your recovery capacity  
- ✅ Race-specific periodization for peak performance
- ✅ Regular adjustments based on your response to training

**[Start your advanced training assessment →]**
      `
    },
    {
      id: 4,
      title: "Case Study: From 22:00 to 19:45 5K in 16 Weeks",
      excerpt: "How Sarah broke through her 5K plateau using personalized training paces instead of VDOT formulas. Exact workout details inside.",
      readTime: "10 min read",
      category: "Success Stories",
      featured: false,
      content: `# Case Study: From 22:00 to 19:45 5K in 16 Weeks

*Runner Profile: Sarah M., 34, Marketing Director, 4 years running experience*

Sarah had been stuck at a 22:00 5K for eight months. She'd tried three different training plans, increased her mileage, and even hired a coach who used standard VDOT pacing. Nothing worked.

Here's how we helped her break through—and the exact methods you can use.

## The Problem: VDOT Mismatch

Sarah's 22:00 5K gave her a VDOT of 41, which prescribed:
- **Easy pace**: 9:27/mile
- **Threshold pace**: 8:00/mile  
- **Interval pace**: 7:30/mile

But Sarah's actual training showed:
- **Comfortable easy pace**: 8:45/mile (42 seconds faster)
- **Lactate threshold**: 7:40/mile (20 seconds faster)
- **VO2max intervals**: 7:15/mile (15 seconds faster)

**The disconnect:** Sarah had excellent running economy but poor lactate clearance. VDOT couldn't account for this individual profile.

## The Solution: Personalized Training Zones

### Phase 1: Base Building (Weeks 1-6)
- **Easy runs**: 8:30-8:50/mile (not the prescribed 9:27)
- **Long runs**: 8:50-9:10/mile  
- **Strides**: 2x/week, 6:50-7:00/mile

*Key insight*: Running at her natural easy pace improved aerobic capacity without excessive stress.

### Phase 2: Lactate Threshold Focus (Weeks 7-10)  
- **Threshold intervals**: 7:35-7:45/mile (not 8:00)
- **Tempo runs**: 7:40-7:50/mile
- **Recovery**: 9:00-9:30/mile

*Key insight*: Working at her actual threshold improved lactate clearance—her limiting factor.

### Phase 3: VO2max Development (Weeks 11-14)
- **400m repeats**: 7:10/mile (not 7:30)
- **1000m repeats**: 7:20/mile
- **Recovery jogs**: 9:30/mile between reps

*Key insight*: Slightly faster intervals matched her superior running economy.

### Phase 4: Race Sharpening (Weeks 15-16)
- **Race pace runs**: 6:20/mile (goal pace)
- **Alactic speed**: 6:00-6:10/mile
- **Volume taper**: -40% from peak

## The Results

**Week 16 Race Performance:**
- **Finish time**: 19:45 (2:15 improvement)
- **Average pace**: 6:21/mile
- **Splits**: 6:18, 6:19, 6:22, 6:28, 6:18 (negative split!)
- **Post-race**: Felt controlled, could have run faster

## The Key Principles That Worked

### 1. Individual Pace Calibration
- Used actual training response, not formula predictions
- Adjusted paces based on weekly feedback
- Accounted for her running economy advantage

### 2. Targeted Weakness Training  
- Focused on lactate clearance (her limiter)
- Maintained aerobic strengths
- Progressive overload matched to adaptation rate

### 3. Race-Specific Preparation
- Final 4 weeks at goal race effort
- Practiced race-day pacing and tactics
- Peaked fitness for target date

### 4. Recovery Integration
- Easy days truly easy (avoided junk miles)
- Sleep and nutrition prioritized
- Training load matched to life stress

## What You Can Learn From Sarah's Success

**The biggest lesson:** Generic training plans treat symptoms, not causes. Sarah's plateau wasn't due to insufficient volume or intensity—it was due to training at the wrong intensities for her physiology.

**Your action steps:**
1. **Assess your individual factors** (not just recent race times)
2. **Calibrate your training paces** to your actual response
3. **Target your specific limiters** (not general fitness)
4. **Periodize for your goals** (not generic improvement)

## Ready for Your Breakthrough?

Sarah's story isn't unique. We see similar breakthroughs when runners move from generic formulas to personalized training.

**[Start your personalized training breakthrough →]**
      `
    },
    {
      id: 5,
      title: "What Elite Coaches Won't Tell You About Recovery",
      excerpt: "The insider secrets elite coaches use to accelerate adaptation while preventing overtraining. Most runners get this completely wrong.",
      readTime: "7 min read",
      category: "Recovery Science",
      featured: false,
      content: `# What Elite Coaches Won't Tell You About Recovery

Elite coaches guard certain secrets closely. Not because they're trying to hide information, but because most athletes aren't ready to hear that recovery is more important than the workout itself.

Here's what they know that you don't.

## Secret #1: Recovery Is Training

**What most runners think:** Recovery is the absence of training—rest days where "nothing happens."

**What elites know:** Recovery days are active training sessions for your adaptive systems.

During recovery:
- **Mitochondrial biogenesis** peaks 6-24 hours post-workout
- **Capillarization** occurs during low-intensity movement  
- **Glycogen supercompensation** happens with proper nutrition timing
- **Neuromuscular patterns** are reinforced through easy movement

**Elite application:** Recovery runs at 60-65% max HR with perfect form focus. They're training their movement patterns and aerobic system simultaneously.

## Secret #2: HRV Tells You What RPE Can't

**What most runners use:** "How do I feel?" subjective assessment

**What elites track:** Heart Rate Variability measured consistently each morning

**Why HRV matters:**
- Shows autonomic nervous system status
- Predicts adaptation readiness 24-48 hours ahead of symptoms
- Reveals cumulative stress from training + life
- Guides workout intensity modifications in real-time

**Elite protocol:** 
- Measure HRV same time daily (upon waking)
- Green HRV = proceed with planned workout
- Amber HRV = reduce intensity 15-20%
- Red HRV = easy aerobic work only

## Secret #3: Sleep Architecture Beats Sleep Duration

**What most runners focus on:** "I got 8 hours of sleep"

**What elites optimize:** Sleep quality and REM/Deep sleep ratios

**The science:** Adaptation happens during specific sleep phases:
- **Deep sleep (NREM)**: Physical recovery and growth hormone release
- **REM sleep**: Motor learning consolidation and memory formation

**Elite sleep optimization:**
- Room temperature 65-68°F
- Complete darkness (blackout curtains + eye mask)
- No screens 2 hours before bed
- Consistent sleep/wake times (within 30 minutes daily)
- Magnesium supplementation 400mg, 90 minutes before bed

## Secret #4: Stress Is Stress (Training Can't Tell the Difference)

**What most runners believe:** "I can train through work stress"

**What elites understand:** All stress draws from the same adaptation pool

Your body responds identically to:
- High-intensity intervals
- Work deadlines  
- Relationship conflicts
- Poor nutrition
- Inadequate sleep

**Elite application:** Training load varies inversely with life stress
- High life stress = reduce training intensity 20-30%
- Low life stress = opportunity for breakthrough workouts
- Major life events = maintenance training only

## Secret #5: Nutrition Timing Trumps Nutrition Quality

**What most runners focus on:** "I eat clean"

**What elites master:** When you eat matters more than what you eat

**Post-workout window (30-60 minutes):**
- 1.2g carbs per kg body weight
- 0.3g protein per kg body weight
- Liquid form for faster absorption

**Pre-workout timing (3-4 hours before):**
- Complex carbs for sustained energy
- Minimal fat/fiber to avoid GI distress
- Adequate hydration (pale yellow urine)

**Elite secret:** They eat for the next workout, not the last one.

## Secret #6: Deload Weeks Aren't Optional

**What most runners do:** Push through fatigue, hoping it will pass

**What elites schedule:** Mandatory recovery weeks every 4th week

**Proper deload structure:**
- Volume: -40% from previous week
- Intensity: Maintain workout paces, reduce duration
- Frequency: Same number of runs, shorter duration
- Focus: Movement quality and mental refreshment

## The Recovery Prescription Elite Coaches Use

### Daily Recovery Checklist:
- [ ] 7+ hours quality sleep
- [ ] HRV within normal range  
- [ ] Post-workout nutrition within 60 minutes
- [ ] Easy day truly easy (<70% max HR)
- [ ] Stress management practice (10+ minutes)

### Weekly Recovery Audit:
- [ ] 1-2 complete rest days
- [ ] 80% of running at conversational effort
- [ ] Life stress assessment and training adjustment
- [ ] Sleep quality review and optimization
- [ ] Nutrition timing effectiveness evaluation

## Your Recovery Action Plan

Most runners train at 80% effort and recover at 40% effort. Elites flip this: they train at 95% effort and recover at 95% effort.

**Start here:**
1. **Track your HRV** for 2 weeks to establish baseline
2. **Audit your sleep environment** and make 3 improvements
3. **Schedule deload weeks** in advance (non-negotiable)
4. **Practice saying no** to social/work obligations during hard training blocks

**[Get your personalized recovery protocol →]**
      `
    },
    {
      id: 6,
      title: "Why 73% of Runners Plateau (And How to Break Through)",
      excerpt: "New research reveals why most runners stop improving after 2 years. The solution isn't what you think.",
      readTime: "9 min read",
      category: "Training Science",
      featured: false,
      content: `# Why 73% of Runners Plateau (And How to Break Through)

A disturbing trend has emerged in recreational running: 73% of runners plateau within their first two years and never improve significantly again.

*Source: Analysis of 50,000+ Strava athletes, 2018-2023*

This isn't due to age, genetics, or "natural limits." The real culprits are more subtle—and completely fixable.

## The Plateau Trap: Why Improvement Stops

### Culprit #1: Training Load Ceiling

**The pattern:** Runners find a comfortable training volume (usually 25-35 miles/week) and stay there indefinitely.

**Why it happens:** Fear of injury, time constraints, or the belief that "more isn't always better."

**The reality:** Your body adapts to consistent training loads within 6-8 weeks. Without progressive overload, adaptation stops.

**The breakthrough:** Periodized volume progression with strategic recovery phases.

### Culprit #2: Intensity Distribution Drift

**The pattern:** Easy runs get faster, hard runs get easier. Everything becomes "moderately hard."

**Why it happens:** Social running, ego, and lack of clear intensity targets.

**The reality:** Moderate intensity is the "gray zone"—too hard to promote aerobic development, too easy to stress anaerobic systems.

**The breakthrough:** Strict intensity discipline: 80% easy, 20% hard, 0% moderate.

### Culprit #3: Adaptation Assumptions

**The pattern:** Using the same training paces month after month, year after year.

**Why it happens:** Runners assume fitness improvements automatically translate to new training zones.

**The reality:** Training zones must be updated as fitness changes. Stale paces = stale adaptations.

**The breakthrough:** Regular testing and pace recalibration every 4-6 weeks.

## The Science of Breakthrough Performance

Recent exercise physiology research reveals three key principles for continuous improvement:

### Principle #1: Progressive Overload Variability

**Traditional approach:** Increase weekly mileage by 10% indefinitely

**Breakthrough approach:** Vary the overload stimulus:
- Weeks 1-3: Volume progression
- Week 4: Intensity focus  
- Weeks 5-7: Frequency increase
- Week 8: Recovery/adaptation

### Principle #2: Individual Response Profiling

**Traditional approach:** Follow plan X for Y weeks, regardless of response

**Breakthrough approach:** Adjust training based on individual adaptation markers:
- Fast responders: Increase load every 2-3 weeks
- Slow responders: Maintain load 4-5 weeks before progression
- Non-responders: Change training stimulus entirely

### Principle #3: Specificity Progression

**Traditional approach:** General fitness improvement

**Breakthrough approach:** Progressive specificity toward race demands:
- Base phase: General aerobic development
- Build phase: Race-pace specificity  
- Peak phase: Race-effort simulation

## The Plateau-Proof Training System

Here's how to structure training for continuous improvement:

### Phase 1: Aerobic Base Expansion (6-8 weeks)
- **Focus**: Increase weekly volume by 10-15%
- **Intensity**: 85% easy, 15% moderate
- **Key sessions**: Progressive long runs, aerobic threshold work
- **Success metric**: Improved pace at same heart rate

### Phase 2: Lactate Threshold Development (4-6 weeks)  
- **Focus**: Raise sustainable pace
- **Intensity**: 75% easy, 25% threshold/tempo
- **Key sessions**: Threshold intervals, tempo runs
- **Success metric**: Faster pace at lactate threshold heart rate

### Phase 3: VO2max/Neuromuscular Power (3-4 weeks)
- **Focus**: Maximum aerobic capacity and speed
- **Intensity**: 70% easy, 30% high-intensity
- **Key sessions**: VO2max intervals, alactic speed
- **Success metric**: Improved peak power output

### Phase 4: Race Integration (2-3 weeks)
- **Focus**: Race-specific fitness and tactics
- **Intensity**: 80% easy, 20% race-pace
- **Key sessions**: Race simulation, goal-pace practice
- **Success metric**: Goal pace feels sustainable

### Phase 5: Recovery/Adaptation (1 week)
- **Focus**: Absorb training adaptations
- **Intensity**: 90% easy, 10% strides
- **Key sessions**: Easy runs, movement quality
- **Success metric**: Freshness and motivation return

## Breaking Through Your Current Plateau

### Step 1: Identify Your Plateau Type

**Volume plateau**: Same weekly mileage for 6+ months
- *Solution*: 20% volume increase over 8 weeks

**Intensity plateau**: Same workout paces for 3+ months  
- *Solution*: Pace testing and zone recalibration

**Motivation plateau**: Training feels stale or purposeless
- *Solution*: New goal race and specific preparation

### Step 2: Implement Progressive Overload

Choose ONE variable to progress each training cycle:
- **Volume**: Weekly mileage
- **Intensity**: Workout pace/effort
- **Frequency**: Runs per week
- **Density**: Recovery time between intervals

### Step 3: Track Leading Indicators

Don't wait for race results. Monitor these weekly:
- **Resting heart rate** (should gradually decrease)
- **Training pace at fixed effort** (should gradually improve)  
- **Recovery between intervals** (should maintain quality longer)
- **Subjective energy levels** (should feel stronger at same loads)

## The 12-Week Plateau Breakthrough Protocol

**Weeks 1-4**: Volume focus (+15% weekly mileage)
**Weeks 5-8**: Intensity focus (new pace zones, challenging workouts)  
**Weeks 9-11**: Specificity focus (race-pace integration)
**Week 12**: Test week (time trial or race)

**Expected outcome**: 3-8% performance improvement within 12 weeks.

Most runners who follow this protocol see their first breakthrough in 6-8 weeks—often surprising themselves with training paces they couldn't imagine running just two months earlier.

**[Start your plateau breakthrough plan →]**
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
    // Now imported from '../data/trainingPlans'

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
    // Now using imported data from trainingPlans.js
    const paceTable = trainingPacesByVDOT;

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
    
    // Auto-save to profile if profile exists
    if (savedProfileData && calculatedGoldenPace) {
      const updatedProfile = {
        ...savedProfileData,
        currentGoldenPace: calculatedGoldenPace,
        goalRaceTime: raceTime,
        goalRaceDistance: raceDistance,
        lastCalculated: new Date().toISOString()
      };
      saveProfileData(updatedProfile);
    }
  };

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

  const handlePaymentSuccess = (paymentResult) => {
    if (!selectedPlanForPurchase) return;
    
    const newPurchase = {
      id: selectedPlanForPurchase.id,
      name: selectedPlanForPurchase.name,
      price: selectedPlanForPurchase.price,
      purchaseDate: new Date().toISOString(),
      status: 'active',
      stripePaymentId: paymentResult.paymentIntent?.id || 'mock_payment_' + Date.now(),
      transactionId: paymentResult.paymentIntent?.id || 'mock_' + Date.now()
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
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setPurchaseLoading(false);
    // Could add error state here for user feedback
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
                  aria-label={`Switch to ${label} tab`}
                  aria-current={activeTab === id ? 'page' : undefined}
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
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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
              
              {/* Show helpful message if race data is pre-populated from profile */}
              {savedProfileData && (raceTime || raceDistance !== '5K') && (
                <div className="inline-flex items-center px-4 py-2 bg-opacity-10 rounded-lg mb-4" style={{ 
                  backgroundColor: colors.lightBlue,
                  color: colors.darkBlue 
                }}>
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm">Using your goal race from profile: {raceDistance}{raceTime ? ` in ${raceTime}` : ''}</span>
                </div>
              )}
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
                        aria-label="Race time in minutes and seconds"
                        aria-describedby="race-time-help"
                        className="w-full px-3 sm:px-4 py-3 border-2 font-mono text-base sm:text-lg text-center"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.black,
                          backgroundColor: colors.white
                        }}
                      />
                      <div id="race-time-help" className="sr-only">
                        Enter your race time in MM:SS format for shorter races or HH:MM:SS for longer races
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.black }}>
                        Distance
                      </label>
                      <select
                        value={raceDistance}
                        onChange={(e) => setRaceDistance(e.target.value)}
                        aria-label="Select race distance"
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
                    aria-label="Calculate training paces from race time"
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
                          aria-label="View premium 12-week training programs"
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
                          aria-label="Browse all training programs"
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
                        aria-label="Your full name"
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
                        aria-label="Your email address"
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
                        aria-label="Goal race time in minutes and seconds"
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
                        aria-label="Current weekly mileage in miles or kilometers"
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
                      aria-label="Injury history and health considerations"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={savedProfileData ? updateProfile : saveProfile}
                      className="munich-btn munich-btn-primary flex-1 relative"
                      aria-label={savedProfileData ? 'Update your training profile' : 'Create your training profile'}
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
                        aria-label="Check for existing profile with this email"
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
                              {savedProfileData?.currentGoldenPace || goldenPace ? (
                                <span className="font-bold" style={{ 
                                  color: colors.violet,
                                  fontSize: 'var(--text-lg)'
                                }}>
                                  {savedProfileData?.currentGoldenPace || goldenPace}
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span style={{ 
                                    color: colors.darkGray,
                                    fontSize: 'var(--text-sm)'
                                  }}>Not calculated</span>
                                  {savedProfileData?.goalRaceTime && savedProfileData?.goalRaceDistance && (
                                    <button
                                      onClick={() => {
                                        setRaceTime(savedProfileData.goalRaceTime);
                                        setRaceDistance(savedProfileData.goalRaceDistance);
                                        setActiveTab('calculator');
                                      }}
                                      className="px-2 py-1 text-xs rounded-md hover:opacity-80 transition-opacity"
                                      style={{ 
                                        backgroundColor: colors.lightBlue,
                                        color: colors.white
                                      }}
                                      title="Calculate using your goal race"
                                    >
                                      Calculate
                                    </button>
                                  )}
                                </div>
                              )}
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
                        onClick={() => {
                          // Transfer profile data to calculator
                          if (savedProfileData?.goalRaceTime) {
                            setRaceTime(savedProfileData.goalRaceTime);
                          }
                          if (savedProfileData?.goalRaceDistance) {
                            setRaceDistance(savedProfileData.goalRaceDistance);
                          }
                          setActiveTab('calculator');
                        }}
                        className="munich-btn munich-btn-primary relative"
                        aria-label="Go to pace calculator with your goal race"
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
                        aria-label="View training plans"
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
                        aria-label="Close profile dashboard"
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
      {showPurchaseModal && selectedPlanForPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="munich-card w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={closePurchaseModal}
                className="text-2xl font-bold leading-none hover:opacity-70 transition-opacity"
                style={{ color: colors.silver }}
                disabled={purchaseLoading}
              >
                ×
              </button>
            </div>
            
            <div className="munich-card-header">
              <h3 className="text-xl font-bold pr-8" style={{ color: colors.black }}>
                Purchase {selectedPlanForPurchase.name}
              </h3>
            </div>
            
            <div className="munich-card-body">
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  selectedPlan={selectedPlanForPurchase}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  loading={purchaseLoading}
                  userProfile={userProfile}
                  colors={colors}
                />
              </Elements>
              
              <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.gray }}>
                <button
                  onClick={closePurchaseModal}
                  className="munich-btn munich-btn-outline w-full"
                  disabled={purchaseLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Success Message */}
      {purchaseSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="munich-card" style={{ backgroundColor: colors.darkGreen }}>
            <div className="p-4 text-center">
              <p className="font-bold text-white flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Purchase Successful!
              </p>
              <p className="text-sm text-white opacity-90 mt-1">
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