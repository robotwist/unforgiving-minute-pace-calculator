import React, { useState } from 'react';
import { Calculator, Download, Target, Clock, TrendingUp, User } from 'lucide-react';

const RunningTrainingApp = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [raceTime, setRaceTime] = useState('');
  const [raceDistance, setRaceDistance] = useState('5K');
  const [goldenPace, setGoldenPace] = useState(null);
  const [trainingPaces, setTrainingPaces] = useState(null);
  const [userProfile, setUserProfile] = useState({ name: '', email: '', experience: 'beginner' });

  // Use global Munich 1972 CSS variables for consistent design system
  const colors = {
    lightBlue: 'var(--munich-light-blue)',
    lightGreen: 'var(--munich-light-green)',
    silver: 'var(--munich-silver)',
    violet: 'var(--munich-violet)',
    darkGreen: 'var(--munich-dark-green)',
    orange: 'var(--munich-orange)',
    yellow: 'var(--munich-yellow)',
    white: 'var(--munich-white)',
    black: 'var(--munich-black)',
    gray: 'var(--munich-gray)',
    border: 'var(--munich-border)'
  };

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
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Geometric logo background */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 geometric-octagon flex items-center justify-center" style={{ 
                  backgroundColor: colors.lightBlue,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {/* Olympic Runner Icon */}
                  <img 
                    src="/olympicrunner72icon.png" 
                    alt="Olympic Runner" 
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain running-pictogram"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: colors.black }}>
                  Unforgiving Minute
                </h1>
                <p className="text-xs sm:text-sm font-medium" style={{ color: colors.lightBlue }}>
                  Distance Running
                </p>
              </div>
            </div>
            
            {/* Navigation - Munich 1972 Style */}
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-1">
              {[
                { id: 'calculator', label: 'GoldenPace Calculator', icon: Calculator },
                { id: 'plans', label: 'Training Plans', icon: Target },
                { id: 'profile', label: 'Profile', icon: User }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
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
              
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: colors.black }}>
                GoldenPace Calculator
              </h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto px-4" style={{ color: colors.black }}>
                Enter a recent race time to get an effort-tested training paces using the GoldenPace system
              </p>
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
                    { name: 'Easy', pace: trainingPaces.easy, icon: Clock, color: colors.lightBlue },
                    { name: 'Threshold', pace: trainingPaces.threshold, icon: TrendingUp, color: colors.lightGreen },
                    { name: 'Interval', pace: trainingPaces.interval, icon: Clock, color: colors.darkGreen },
                    { name: 'Repetition', pace: trainingPaces.repetition, icon: TrendingUp, color: colors.violet }
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
                
                {/* Get Training Programs Button */}
                <div className="text-center mt-6 sm:mt-8">
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="inline-flex items-center px-6 py-3 font-bold text-white text-lg sm:text-xl relative overflow-hidden group transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg"
                    style={{ 
                      backgroundColor: colors.lightGreen,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: `2px solid ${colors.darkGreen}`
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                      Get Personalized Training Programs
                    </span>
                  </button>
                  <p className="text-sm text-gray-600 mt-3">
                    Access 12-week training plans tailored to your GoldenPace {goldenPace}
                  </p>
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
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">
                          🎯 Personalized for GoldenPace {plan.goldenPaceLevel}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
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
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        Download Plan
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowPlanDetails(true);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
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
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Download Plan
                    </button>
                    <button 
                      onClick={() => setShowPlanDetails(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
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
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Your Profile</h2>
              <p className="text-xl text-gray-600">Customize your training experience</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <User className="w-6 h-6 mr-3" />
                  Profile Settings
                </h3>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Experience Level</label>
                  <select
                    value={userProfile.experience}
                    onChange={(e) => setUserProfile({...userProfile, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="advanced">Advanced (3+ years)</option>
                    <option value="elite">Elite/Competitive</option>
                  </select>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl">
                  Save Profile
                </button>
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
                className="px-3 sm:px-4 py-2 font-medium transition-all duration-200 hover:shadow-sm btn-high-contrast"
                style={{ 
                  backgroundColor: colors.lightBlue,
                  color: colors.white
                }}
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
    </div>
  );
};

export default RunningTrainingApp;