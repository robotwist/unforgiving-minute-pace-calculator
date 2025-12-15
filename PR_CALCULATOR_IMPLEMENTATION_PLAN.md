# PR-Based Training Calculator - Implementation Plan

## Overview

Transform the PR-based training calculator concept into a second calculator option, accessible via a dedicated route/page. This calculator uses actual Personal Records (PRs) from multiple race distances to map training zones directly to proven race paces—eliminating formula-derived paces in favor of performance-proven zones.

---

## Technical Requirements

### 1. Core Calculation Logic

#### Distance Conversion (Riegel Formula)
```javascript
// utils/riegel.js
/**
 * Convert race time from one distance to another using Riegel formula
 * T2 = T1 * (D2/D1)^1.06
 */
export function convertRaceTime(knownTimeSeconds, knownDistanceMeters, targetDistanceMeters) {
  return knownTimeSeconds * Math.pow(targetDistanceMeters / knownDistanceMeters, 1.06);
}

/**
 * Convert seconds to pace per mile (MM:SS format)
 */
export function secondsToPace(secondsPerMile) {
  const minutes = Math.floor(secondsPerMile / 60);
  const seconds = Math.round(secondsPerMile % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get pace per mile from race time and distance
 */
export function getPacePerMile(timeSeconds, distanceMeters) {
  const miles = distanceMeters * 0.000621371;
  return timeSeconds / miles;
}
```

#### Standard Racing Distances Map
```javascript
// data/raceDistances.js
export const RACE_DISTANCES = {
  '100m': 100,
  '200m': 200,
  '400m': 400,
  '800m': 800,
  '1500m': 1500,
  'Mile': 1609.34,
  '5K': 5000,
  '10K': 10000,
  '15K': 15000,
  '10 Mile': 16093.4,
  'Half Marathon': 21097,
  'Marathon': 42195,
  '50K': 50000,
  '50 Mile': 80467,
  '100K': 100000,
  '100 Mile': 160934
};

export const STANDARD_DISTANCES = Object.keys(RACE_DISTANCES);
```

#### Training Zone Mapping
```javascript
// utils/prTrainingZones.js
/**
 * Map training zones to race distances based on primary goal distance
 */
export function getTrainingZoneMapping(goalDistance, prs) {
  const mappings = {
    '5K': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    '10K': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    'Half Marathon': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    'Marathon': {
      aerobic: 'Marathon',
      tempo: 'Half Marathon',
      threshold: '10K',
      interval: '5K',
      repetition: 'Mile'
    },
    // Add ultra mappings if needed
    '50K': {
      aerobic: 'Marathon',
      tempo: '50K',
      threshold: 'Half Marathon',
      interval: '10K',
      repetition: '5K'
    }
  };
  
  return mappings[goalDistance] || mappings['5K'];
}

/**
 * Calculate training paces from PRs
 */
export function calculatePRTrainingPaces(prs, goalDistance) {
  const mapping = getTrainingZoneMapping(goalDistance, prs);
  const trainingPaces = {};
  
  // Map each zone to its corresponding PR pace
  Object.entries(mapping).forEach(([zone, distance]) => {
    if (prs[distance]) {
      const timeSeconds = parseTimeToSeconds(prs[distance]);
      const distanceMeters = RACE_DISTANCES[distance];
      trainingPaces[zone] = secondsToPace(getPacePerMile(timeSeconds, distanceMeters));
    } else {
      // Project missing PR using Riegel formula from closest available PR
      trainingPaces[zone] = projectPR(prs, distance);
    }
  });
  
  return trainingPaces;
}

/**
 * Project missing PR from available PRs using Riegel
 */
function projectPR(prs, targetDistance) {
  // Find closest available PR
  const availablePRs = Object.entries(prs).filter(([_, time]) => time);
  if (availablePRs.length === 0) return null;
  
  // Use the longest available PR as base (most reliable for projections)
  const [baseDistance, baseTime] = availablePRs.sort((a, b) => 
    RACE_DISTANCES[b[0]] - RACE_DISTANCES[a[0]]
  )[0];
  
  const baseTimeSeconds = parseTimeToSeconds(baseTime);
  const baseDistanceMeters = RACE_DISTANCES[baseDistance];
  const targetDistanceMeters = RACE_DISTANCES[targetDistance];
  
  const projectedTime = convertRaceTime(baseTimeSeconds, baseDistanceMeters, targetDistanceMeters);
  return secondsToPace(getPacePerMile(projectedTime, targetDistanceMeters));
}
```

### 2. PR Profile Validation & Consistency Checking

```javascript
// utils/prValidation.js
/**
 * Check consistency of PRs - flag outliers
 */
export function validatePRConsistency(prs) {
  const issues = [];
  const sortedPRs = Object.entries(prs)
    .filter(([_, time]) => time)
    .map(([dist, time]) => ({
      distance: dist,
      time: parseTimeToSeconds(time),
      meters: RACE_DISTANCES[dist]
    }))
    .sort((a, b) => a.meters - b.meters);
  
  // Check each PR against projections from others
  sortedPRs.forEach((pr, index) => {
    if (index === 0) return; // Skip first
    
    const previousPR = sortedPRs[index - 1];
    const projectedTime = convertRaceTime(
      previousPR.time,
      previousPR.meters,
      pr.meters
    );
    
    // Allow 5% variance (accounting for individual strengths/weaknesses)
    const variance = Math.abs(pr.time - projectedTime) / projectedTime;
    if (variance > 0.05) {
      issues.push({
        distance: pr.distance,
        actualTime: pr.time,
        projectedTime: projectedTime,
        variance: variance,
        type: pr.time > projectedTime ? 'slower' : 'faster'
      });
    }
  });
  
  return issues;
}
```

---

## Component Architecture

### Component Structure

```
src/
├── components/
│   ├── calculator/
│   │   ├── GoldenPaceCalculatorSection.jsx (existing)
│   │   ├── GoldenPaceResults.jsx (existing)
│   │   ├── pr-calculator/
│   │   │   ├── PRCalculatorSection.jsx          # Main calculator component
│   │   │   ├── PRInputForm.jsx                  # PR entry interface
│   │   │   ├── PRProfileGraph.jsx               # Visual PR profile (chart)
│   │   │   ├── PRTrainingPacesResults.jsx       # Results display
│   │   │   ├── PRConsistencyAlert.jsx           # Validation warnings
│   │   │   └── PRPaceCard.jsx                   # Individual pace zone card
│   │   └── shared/
│   │       ├── TimeInput.jsx                    # Reusable time input
│   │       └── DistanceSelector.jsx             # Reusable distance selector
├── pages/
│   ├── PRCalculator.jsx                         # Dedicated PR calculator page
├── utils/
│   ├── riegel.js                                # Riegel formula utilities
│   ├── prTrainingZones.js                       # Zone mapping logic
│   └── prValidation.js                          # PR validation logic
└── data/
    └── raceDistances.js                         # Distance constants
```

### Key Components

#### 1. PRCalculatorSection.jsx
**Purpose**: Main container component (similar structure to GoldenPaceCalculatorSection)

**Props**:
- `colors` - Design system colors
- `savedProfileData` - Optional saved PRs from profile
- `onCalculate` - Callback with calculated training paces

**Features**:
- Hero section explaining PR-based approach
- PR input form (multiple distances)
- PR profile visualization
- Results display
- Integration with existing design system

#### 2. PRInputForm.jsx
**Purpose**: Multi-PR entry interface

**State**:
```javascript
const [prs, setPRs] = useState({
  '5K': '',
  '10K': '',
  'Half Marathon': '',
  'Marathon': '',
  // ... other distances
});
const [goalDistance, setGoalDistance] = useState('5K');
const [validationErrors, setValidationErrors] = useState({});
```

**Features**:
- Toggleable distance inputs (show/hide less common distances)
- Time format validation (MM:SS or HH:MM:SS)
- Real-time consistency checking
- "Mark as Estimated" toggle for projected PRs
- Save PRs to profile option

#### 3. PRProfileGraph.jsx
**Purpose**: Visual representation of PR profile

**Library Options**:
- **Recharts** (lightweight, React-native)
- **Victory** (declarative, good animations)
- **Chart.js with react-chartjs-2** (familiar, feature-rich)
- **Custom SVG** (full control, no dependencies)

**Visualization**:
- X-axis: Distance (log scale from 100m to 100 miles)
- Y-axis: Pace per mile (MM:SS format)
- Data points: Actual PRs (solid dots)
- Projected points: Estimated PRs (hollow dots, different color)
- Line: Smooth curve showing fitness profile
- Highlight gaps: "No marathon PR - shows projected"

#### 4. PRTrainingPacesResults.jsx
**Purpose**: Display calculated training paces

**Layout**:
- Grid of training zone cards (similar to GoldenPaceResults)
- Each card shows:
  - Zone name (Aerobic, Tempo, Threshold, Interval, Repetition)
  - Pace per mile (from PR)
  - Source PR distance ("Your Marathon PR pace")
  - Icon/color coding
  - Brief description of zone purpose
- Visual indicator if pace is projected vs. actual PR
- Consistency warnings if PRs are outliers

---

## UI/UX Design Approach

### Modern Yet Timeless Aesthetic

#### Design Principles
1. **Clarity First**: Large, readable typography. Clear hierarchy.
2. **Minimal Gestalt**: Clean layouts with generous whitespace.
3. **Purposeful Color**: Use Munich 1972 palette strategically, not decoratively.
4. **Progressive Disclosure**: Show advanced options on demand.
5. **Feedback Loops**: Immediate validation, clear error states.

#### Visual Treatment

**Hero Section**:
```
┌─────────────────────────────────────────────┐
│  [Geometric accent - subtle, not dominant] │
│                                             │
│  PR-Based Training Calculator               │
│  (Large, bold, clean typography)            │
│                                             │
│  Use your actual race performances to set   │
│  training paces. No formulas. No guessing.  │
│                                             │
│  [Value prop badges: "Proven Paces" |       │
│   "Multi-Distance" | "Simplified"]          │
└─────────────────────────────────────────────┘
```

**PR Input Form**:
- **Card-based layout**: Each distance in its own subtle card
- **Progressive disclosure**: Core distances (5K, 10K, Half, Marathon) visible by default
- **Expandable section**: "Add more distances" reveals 100m-100mi
- **Inline validation**: Green checkmark when valid, subtle error below field
- **Time input**: Large, centered, monospace font (like GoldenPace calculator)

**PR Profile Graph**:
- **Minimal chart design**: Clean axes, subtle grid
- **Color coding**: 
  - Actual PRs: Primary color (lightBlue)
  - Projected PRs: Secondary color (lightGreen) with dashed line
  - Outliers: Warning color (orange) with marker
- **Interactive tooltips**: Hover shows distance, time, pace, date

**Training Paces Results**:
- **Card grid**: 5 cards (Aerobic, Tempo, Threshold, Interval, Repetition)
- **Each card structure**:
  ```
  ┌─────────────────────────┐
  │ [Icon]  AEROBIC         │
  │                         │
  │      7:26 /mile         │  ← Large, prominent
  │                         │
  │ Your Marathon PR pace   │  ← Source indicator
  │                         │
  │ Builds aerobic base...  │  ← Brief description
  └─────────────────────────┘
  ```
- **Visual hierarchy**: Pace is most prominent, source is secondary
- **Projected indicator**: Small badge "Projected" if using estimated PR

#### Color Usage
- **Primary actions**: `lightBlue` (consistent with existing)
- **Success/valid**: `lightGreen`
- **Warnings**: `orange`
- **Backgrounds**: `white` with subtle `progressive-melange` overlay
- **Text**: `black` (dark mode: `offWhite`)
- **Borders**: `border` (subtle, low contrast)

#### Typography
- **Headlines**: Munich 3xl/4xl, bold, tight tracking
- **Body**: Inter/system font stack, 16px base, 1.6 line-height
- **Paces**: Monospace font, large (2xl-3xl), bold
- **Labels**: Small (sm), medium weight, uppercase tracking

#### Spacing & Layout
- **Container**: Max-width 1200px, centered
- **Card padding**: 24px (sm: 32px lg: 40px)
- **Grid gaps**: 16px (sm: 24px)
- **Section spacing**: 48px vertical (sm: 64px)

---

## Routing & Navigation

### New Route Structure

```javascript
// src/App.js
<Routes>
  <Route path="/" element={<RunningTrainingApp />} />
  <Route path="/calculator" element={<RunningTrainingApp />} />  // Default (GoldenPace)
  <Route path="/calculator/pr" element={<PRCalculator />} />     // New PR calculator
  <Route path="/coach" element={<Coach />} />
  // ... other routes
</Routes>
```

### Navigation Integration

#### Option 1: Separate Tab (Recommended)
Add "PR Calculator" as a new tab in the main navigation:
```javascript
const tabs = [
  { id: 'calculator', label: 'Optimal Progress Pace', icon: Calculator },
  { id: 'pr-calculator', label: 'PR-Based Paces', icon: Trophy },  // New
  { id: 'plans', label: 'Training Plans', icon: Target },
  // ...
];
```

#### Option 2: Calculator Mode Toggle
Within the calculator tab, add a toggle:
```
[Optimal Progress Pace] [PR-Based Paces]  ← Toggle between modes
```

#### Option 3: Dedicated Page Link
Add link in header/navigation: "PR Calculator" → `/calculator/pr`

**Recommendation**: Option 1 (separate tab) provides clearest UX and doesn't complicate existing calculator.

### Breadcrumbs/Navigation Context
```
Home > Calculators > PR-Based Training Paces
```

---

## Data Persistence

### localStorage Schema

```javascript
// Save PRs to profile
const prProfile = {
  prs: {
    '5K': '18:30',
    '10K': '39:00',
    'Half Marathon': '1:28:00',
    'Marathon': '3:05:00'
  },
  lastUpdated: '2025-12-11T12:00:00Z',
  goalDistance: '5K',
  consistencyIssues: [] // Validation warnings
};

localStorage.setItem('prProfile', JSON.stringify(prProfile));
```

### Integration with Existing Profile

Extend existing `runningProfile` structure:
```javascript
{
  // ... existing profile fields
  prs: {
    '5K': '18:30',
    // ...
  },
  prTrainingPaces: {
    aerobic: '7:26',
    tempo: '6:43',
    // ...
  },
  calculatorPreference: 'pr' // or 'goldenpace'
}
```

---

## Integration Points

### 1. Training Plans Integration

When generating training plans, use PR-based paces if available:
```javascript
// In TrainingPlansSection or plan generation
const trainingPaces = savedProfileData?.prTrainingPaces 
  || calculateTrainingPaces(goldenPace); // Fallback to GoldenPace
```

### 2. Progress Dashboard

Show PR progression over time:
- Track PR improvements
- Visualize training pace evolution
- Compare current PRs to projected times

### 3. Lead Capture

After PR calculator results, offer:
- "Save PRs to Profile" (requires email)
- "Get personalized plan based on your PRs"
- Same freemium flow as GoldenPace calculator

---

## Implementation Steps

### Phase 1: Foundation (Week 1)
1. ✅ Create utility functions (`riegel.js`, `prTrainingZones.js`, `prValidation.js`)
2. ✅ Create data constants (`raceDistances.js`)
3. ✅ Create basic PR input form component (`PRInputForm.jsx`)
4. ✅ Implement time parsing/validation (reuse from GoldenPace calculator)
5. ✅ Implement core calculation logic

### Phase 2: UI Components (Week 1-2)
1. ✅ Create `PRCalculatorSection.jsx` (main container)
2. ✅ Create `PRTrainingPacesResults.jsx` (results display)
3. ✅ Create `PRPaceCard.jsx` (individual zone cards)
4. ✅ Create `PRConsistencyAlert.jsx` (validation warnings)
5. ✅ Implement responsive layouts

### Phase 3: Visualization (Week 2)
1. ✅ Choose charting library (Recommendation: Recharts)
2. ✅ Create `PRProfileGraph.jsx` component
3. ✅ Implement log-scale distance axis
4. ✅ Add interactive tooltips
5. ✅ Style chart to match design system

### Phase 4: Integration (Week 2-3)
1. ✅ Create `/calculator/pr` route in `App.js`
2. ✅ Add navigation link/tab
3. ✅ Integrate with existing profile system
4. ✅ Add localStorage persistence
5. ✅ Connect to training plans (optional Phase 2)

### Phase 5: Polish & Testing (Week 3)
1. ✅ Dark mode support
2. ✅ Accessibility audit (keyboard nav, screen readers, ARIA labels)
3. ✅ Mobile optimization
4. ✅ Error handling & edge cases
5. ✅ Performance optimization
6. ✅ User testing & feedback iteration

---

## Estimated Timeline

**Total: 2-3 weeks** (assuming part-time development)

- **Week 1**: Foundation + Core UI (40-50 hours)
- **Week 2**: Visualization + Integration (30-40 hours)
- **Week 3**: Polish + Testing (20-30 hours)

**Critical Path**: Utility functions → Input form → Calculation logic → Results display → Chart → Integration

---

## Dependencies

### New npm Packages
```json
{
  "recharts": "^2.10.3"  // For PR profile chart (or Victory, Chart.js)
}
```

### Existing Dependencies (Already Installed)
- React Router DOM ✓
- Lucide React (icons) ✓
- React (state management) ✓

---

## Accessibility Considerations

1. **Form Labels**: All inputs have explicit `<label>` associations
2. **Error Messages**: ARIA `aria-describedby` linking errors to inputs
3. **Keyboard Navigation**: Tab order logical, all interactive elements focusable
4. **Screen Readers**: 
   - Chart data available in table format (hidden, accessible)
   - Results announced on calculation
   - Validation errors announced
5. **Color Contrast**: All text meets WCAG AA (4.5:1)
6. **Focus Indicators**: Visible focus rings on all interactive elements

---

## Mobile Optimization

### Responsive Breakpoints
- **Mobile** (< 768px): Single column, stacked inputs, simplified chart
- **Tablet** (768px - 1024px): 2-column grid, full chart
- **Desktop** (> 1024px): Full layout, side-by-side form/results

### Mobile-Specific Considerations
- **Time Input**: Use `input[type="time"]` or numeric keyboard
- **Distance Selector**: Native `<select>` or custom dropdown (touch-friendly)
- **Chart**: Simplified version on mobile (key data points only)
- **Results**: Scrollable card list, large touch targets

---

## Testing Checklist

### Functional Tests
- [ ] Single PR input → Projects all other distances correctly
- [ ] Multiple PR inputs → Uses actual PRs, projects missing ones
- [ ] Invalid time formats → Shows clear error messages
- [ ] PR consistency check → Flags outliers appropriately
- [ ] Goal distance change → Updates training zone mapping
- [ ] Save to profile → Persists PRs correctly
- [ ] Load from profile → Pre-fills form correctly

### UI/UX Tests
- [ ] Dark mode works correctly
- [ ] All interactive elements have hover/focus states
- [ ] Chart renders correctly on all screen sizes
- [ ] Mobile layout is usable
- [ ] Loading states shown during calculation
- [ ] Error states are clear and actionable

### Integration Tests
- [ ] Navigation to PR calculator works
- [ ] PRs saved to profile accessible from other tabs
- [ ] Training plans can use PR-based paces (if integrated)
- [ ] Lead capture flow works after PR calculation

---

## Success Metrics

### User Engagement
- % of users who try PR calculator
- % who enter 2+ PRs (indicating understanding)
- % who save PRs to profile

### Technical Performance
- Page load time < 2s
- Calculation time < 100ms
- Chart render time < 500ms

### User Satisfaction
- User feedback on clarity of concept
- Ease of use (time to first result)
- Perceived value vs. GoldenPace calculator

---

## Future Enhancements (Post-MVP)

1. **PR History Tracking**: Track PR improvements over time
2. **Race Predictor**: Use PR profile to predict times at new distances
3. **Training Load Calculator**: Combine PR paces with volume for stress score
4. **Comparison Mode**: Compare PR profile to ideal curve (identify weaknesses)
5. **Export/Share**: Download PR profile as PDF, share training paces
6. **Mobile App Integration**: Sync PRs from Strava/Garmin/Apple Health
7. **Coach Insights**: AI suggestions based on PR profile inconsistencies

---

## Design Mockups Reference

### Key Visual Elements (Text Description)

**Hero Section**:
- Centered layout, generous padding
- Large headline: "PR-Based Training Calculator"
- Subheadline: "Use your actual race performances. No formulas."
- 3 value prop badges (Proven Paces, Multi-Distance, Simplified)
- Geometric accent (subtle, Munich-style)

**PR Input Form**:
- Card container with subtle border
- Grid of distance inputs (2-3 columns on desktop)
- Each input: Large time field, distance label, optional "estimated" toggle
- "Add More Distances" expandable section
- Primary goal distance selector (prominent, top of form)

**PR Profile Graph**:
- Clean line chart
- Log scale X-axis (100m to 100 miles)
- Y-axis: Pace per mile
- Actual PRs: Solid dots, primary color
- Projected PRs: Hollow dots, secondary color
- Smooth curve connecting points
- Interactive tooltips on hover

**Training Paces Results**:
- Grid of 5 cards (Aerobic, Tempo, Threshold, Interval, Repetition)
- Each card: Icon, zone name, pace (large), source PR, description
- Visual indicator if projected
- Consistency warnings (if applicable)
- CTA buttons: "Save to Profile", "Get Training Plan", "Apply for Coaching"

---

## Questions & Decisions Needed

1. **Chart Library**: Which library? (Recommendation: Recharts for React-native, lightweight)
2. **Default Distances**: Which 4-5 distances shown by default? (Recommendation: 5K, 10K, Half, Marathon, Mile)
3. **Ultra Distances**: Include 50K-100mi in default or advanced only? (Recommendation: Advanced only)
4. **Integration Priority**: Should training plans use PR paces immediately, or Phase 2? (Recommendation: Phase 2)
5. **Navigation**: Separate tab or mode toggle? (Recommendation: Separate tab for clarity)
6. **Naming**: "PR-Based Calculator" vs "Race Pace Calculator" vs "Performance-Based Calculator"? (Recommendation: "PR-Based Training Calculator")

---

## Summary

This implementation plan provides a complete roadmap for building the PR-based training calculator as a second calculator option. The approach prioritizes:

1. **Simplicity**: Clear, focused UI that explains the concept
2. **Visual Appeal**: Modern yet timeless aesthetic using Munich 1972 design system
3. **Functionality**: Robust calculation logic with validation and consistency checking
4. **Integration**: Seamless connection with existing profile and training plan systems
5. **Accessibility**: WCAG AA compliant, keyboard navigable, screen reader friendly

**Estimated Effort**: 2-3 weeks (90-120 hours) for a polished, production-ready feature.
