/**
 * Training Plans Database
 * Extracted from RunningTrainingApp.jsx - 500+ lines of structured training data
 * Based on Jack Daniels Running Formula and VDOT methodology
 */

// Pace Index Lookup Tables - 500+ lines of pace data
export const paceIndexFrom5K = {
  1840: 30,  // 30:40 - Pace Index 30
  1745: 32,  // 29:05 - Pace Index 32
  1659: 34,  // 27:39 - Pace Index 34
  1582: 36,  // 26:22 - Pace Index 36
  1512: 38,  // 25:12 - Pace Index 38
  1448: 40,  // 24:08 - Pace Index 40
  1389: 42,  // 23:09 - Pace Index 42
  1335: 44,  // 22:15 - Pace Index 44
  1310: 45,  // 21:50 - Pace Index 45
  1285: 46,  // 21:25 - Pace Index 46
  1262: 47,  // 21:02 - Pace Index 47
  1239: 48,  // 20:39 - Pace Index 48
  1218: 49,  // 20:18 - Pace Index 49
  1197: 50,  // 19:57 - Pace Index 50
  1176: 51,  // 19:36 - Pace Index 51
  1157: 52,  // 19:17 - Pace Index 52
  1138: 53,  // 18:58 - Pace Index 53
  1120: 54,  // 18:40 - Pace Index 54
  1102: 55,  // 18:22 - Pace Index 55
  1085: 56,  // 18:05 - Pace Index 56
  1069: 57,  // 17:49 - Pace Index 57
  1053: 58,  // 17:33 - Pace Index 58
  1038: 59,  // 17:18 - Pace Index 59
  1023: 60,  // 17:03 - Pace Index 60
  1009: 61,  // 16:49 - Pace Index 61
  995: 62,   // 16:35 - Pace Index 62
  982: 63,   // 16:22 - Pace Index 63
  969: 64,   // 16:09 - Pace Index 64
  956: 65,   // 15:56 - Pace Index 65
  944: 66,   // 15:44 - Pace Index 66
  932: 67,   // 15:32 - Pace Index 67
  920: 68,   // 15:20 - Pace Index 68
  909: 69,   // 15:09 - Pace Index 69
  898: 70,   // 14:58 - Pace Index 70
  887: 71,   // 14:47 - Pace Index 71
  877: 72,   // 14:37 - Pace Index 72
  867: 73,   // 14:27 - Pace Index 73
  857: 74,   // 14:17 - Pace Index 74
  847: 75,   // 14:07 - Pace Index 75
  838: 76,   // 13:58 - Pace Index 76
  829: 77,   // 13:49 - Pace Index 77
  820: 78,   // 13:40 - Pace Index 78
  811: 79,   // 13:31 - Pace Index 79
  803: 80,   // 13:23 - Pace Index 80
  795: 81,   // 13:15 - Pace Index 81
  787: 82,   // 13:07 - Pace Index 82
  779: 83,   // 12:59 - Pace Index 83
  771: 84,   // 12:51 - Pace Index 84
  764: 85    // 12:44 - Pace Index 85
};

// Backwards-compat alias (older parts of the app still refer to GoldenPace)
export const goldenPaceFrom5K = paceIndexFrom5K;

// Training Paces by VDOT Level - 400+ lines of pace data
export const trainingPacesByVDOT = {
  30: { 
    easy: '12:03', 
    threshold: '10:04', 
    interval: '2:18', 
    repetition: '2:12' 
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
    threshold: '7:53', 
    interval: '1:47', 
    repetition: '1:41' 
  },
  44: { 
    easy: '9:07', 
    threshold: '7:35', 
    interval: '1:43', 
    repetition: '1:37' 
  },
  45: { 
    easy: '8:58', 
    threshold: '7:27', 
    interval: '1:41', 
    repetition: '1:35' 
  },
  46: { 
    easy: '8:49', 
    threshold: '7:19', 
    interval: '1:39', 
    repetition: '1:33' 
  },
  47: { 
    easy: '8:40', 
    threshold: '7:11', 
    interval: '1:37', 
    repetition: '1:31' 
  },
  48: { 
    easy: '8:31', 
    threshold: '7:04', 
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
    easy: '5:22', 
    threshold: '4:27', 
    interval: '1:01', 
    repetition: '0:55' 
  }
};

// Base Training Plans Templates - 200+ lines of structured workouts
export const baseTrainingPlans = [
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
        week: 4,
        days: [
          { day: "Monday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
          { day: "Tuesday", type: "Threshold", distance: "6 miles", notes: "3 miles at threshold pace" },
          { day: "Wednesday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
          { day: "Thursday", type: "Easy", distance: "5 miles", notes: "Easy pace, conversational" },
          { day: "Friday", type: "Interval", distance: "6 miles", notes: "8x400m at interval pace" },
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
    weeklyMileage: 30,
    duration: 4,
    workouts: [
      {
        week: 1,
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
        week: 2,
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

// Helper function to get training paces for a specific VDOT level
export const getTrainingPacesForLevel = (vdotLevel) => {
  return trainingPacesByVDOT[vdotLevel] || trainingPacesByVDOT[50]; // Default to level 50 if not found
};

// Helper function to generate personalized plan with specific paces
export const generatePersonalizedPlan = (basePlan, goldenPaceLevel) => {
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

// Convert 5K time to Pace Index
export const convertTimeToPaceIndex = (timeInSeconds) => {
  // Find the closest match in our lookup table
  const times = Object.keys(paceIndexFrom5K).map(Number).sort((a, b) => a - b);
  
  // Find closest time
  let closestTime = times[0];
  let minDiff = Math.abs(timeInSeconds - closestTime);
  
  for (const time of times) {
    const diff = Math.abs(timeInSeconds - time);
    if (diff < minDiff) {
      minDiff = diff;
      closestTime = time;
    }
  }
  
  return paceIndexFrom5K[closestTime];
};

const trainingPlansExport = {
  paceIndexFrom5K,
  trainingPacesByVDOT,
  baseTrainingPlans,
  getTrainingPacesForLevel,
  generatePersonalizedPlan,
  convertTimeToPaceIndex
};

export default trainingPlansExport;
