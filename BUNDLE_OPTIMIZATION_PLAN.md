# 🎯 Bundle Optimization Plan

**Based on:** Bundle Analysis (December 11, 2025)  
**Current Total:** 532KB JS + 40KB CSS  
**Target:** < 400KB JS total, < 150KB per chunk

---

## 📊 Current State

```
212KB  chunk-427 (RunningTrainingApp - ALL features)
188KB  main bundle (App, routing, shared code)
 45KB  chunk-578 (Route)
 35KB  chunk-539 (Route)
 15KB  chunk-930 (Route)
 15KB  chunk-432 (Route)
```

---

## 🎯 Optimization Strategy

### Phase 1: Feature-Based Splitting (High Impact, Medium Effort)

**Goal:** Break 212KB chunk into feature chunks

#### 1.1 Split RunningTrainingApp by Tab/Feature

```jsx
// RunningTrainingApp.jsx - Lazy load feature tabs
const CalculatorTab = lazy(() => import('./features/CalculatorTab'));
const PlansTab = lazy(() => import('./features/PlansTab'));
const DashboardTab = lazy(() => import('./features/DashboardTab'));
const BlogTab = lazy(() => import('./features/BlogTab'));
const PremiumTab = lazy(() => import('./features/PremiumTab'));
```

**Expected Results:**
- 212KB chunk → 5 chunks of ~40-50KB each
- Only load what user needs
- Faster initial load

**Implementation Steps:**
1. Create `src/features/` directory structure
2. Extract calculator logic → `features/CalculatorTab`
3. Extract plans logic → `features/PlansTab`
4. Extract dashboard → `features/DashboardTab`
5. Extract blog → `features/BlogTab`
6. Extract premium → `features/PremiumTab`

**Files to Create:**
- `src/features/CalculatorTab/index.jsx`
- `src/features/PlansTab/index.jsx`
- `src/features/DashboardTab/index.jsx`
- `src/features/BlogTab/index.jsx`
- `src/features/PremiumTab/index.jsx`

**Estimated Impact:** 212KB → ~5 × 45KB chunks = Better code splitting

---

### Phase 2: Heavy Component Lazy Loading (Medium Impact, Low Effort)

#### 2.1 Lazy Load Heavy Components Within Features

**Candidates:**
- `GoldenPaceResults` - Only shown after calculation
- `PRTrainingPacesResults` - Only shown after PR calculation
- `TrainingPlansSection` - Large list component
- `BlogTabSection` - Article lists

```jsx
// Within CalculatorTab
const GoldenPaceResults = lazy(() => import('../../components/calculator/GoldenPaceResults'));
const PRTrainingPacesResults = lazy(() => import('../../components/calculator/pr-calculator/PRTrainingPacesResults'));
```

**Expected Impact:** Further reduce chunk sizes by 10-20KB each

---

### Phase 3: Icon Optimization (Low Impact, Low Effort)

#### 3.1 Lazy Load Icons Per Route

**Current:** 24 files import lucide-react (tree-shaken, but could be better)

**Optimization:**
- Icons are already tree-shaken ✅
- Consider lazy loading icon bundles per route if needed
- Current approach is fine for now

**Impact:** Minor (icons are already optimized)

---

### Phase 4: Data/Utility Optimization (Medium Impact, Low Effort)

#### 4.1 Split Large Data Files

**Check for:**
- `trainingPlans.js` - Could be large
- `articles.js` - Could be large
- `publishedVDOTChart.js` - Check size

**If large (>50KB), consider:**
- Code splitting data loading
- Lazy load on demand
- API-based loading (future)

---

## 📈 Expected Results

### After Phase 1 (Feature Splitting):
```
Before: 212KB chunk (all features)
After:
  45KB  CalculatorTab
  40KB  PlansTab
  35KB  DashboardTab
  30KB  BlogTab
  25KB  PremiumTab
  37KB  Shared code
```

### After Phase 2 (Heavy Component Lazy Loading):
- Additional 10-20KB savings per feature
- Better initial load performance

### Final Target:
- **Initial Load:** < 200KB (main + Calculator)
- **Total JS:** < 400KB (down from 532KB)
- **Largest Chunk:** < 150KB

---

## 🛠️ Implementation Order

### Week 1: Feature Splitting
1. ✅ Create feature directory structure
2. Extract CalculatorTab (highest priority - main feature)
3. Extract PlansTab
4. Extract DashboardTab
5. Test and verify chunk sizes

### Week 2: Component Lazy Loading
1. Identify heavy components
2. Add lazy loading
3. Test performance

### Week 3: Polish & Optimize
1. Review bundle analysis again
2. Fine-tune based on actual data
3. Remove any unused code

---

## 🔍 How to Track Progress

### After Each Phase:
```bash
npm run build
bash scripts/analyze-bundle.sh
npm run analyze  # Visual inspection
```

### Key Metrics:
- Chunk sizes (target: < 150KB each)
- Total JS size (target: < 400KB)
- Initial load (main + first chunk)
- Lighthouse Performance score

---

## ✅ Quick Wins (Do First)

1. **Extract CalculatorTab** (2-3 hours)
   - Biggest single feature
   - Most important for initial load
   - Immediate impact

2. **Lazy Load Results Components** (1 hour)
   - GoldenPaceResults
   - PRTrainingPacesResults
   - Only load when needed

3. **Verify Data File Sizes** (30 min)
   - Check trainingPlans.js size
   - Check articles.js size
   - Split if > 50KB

---

## 📚 References

- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
- [Bundle Size Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

---

**Next Step:** Run `npm run analyze` to see visual breakdown, then start with CalculatorTab extraction.
