# Munich 1972 Design System Implementation Plan

**Created:** January 2025  
**Status:** Phases 1-3 Complete ✅  
**Goal:** Complete authentic Munich 1972 design implementation

---

## 📋 Phase Overview

### Phase 1: Design System Cleanup (Week 1)
**Goal:** Remove decorative elements, standardize geometric design  
**Status:** 🔄 In Progress  
**Estimated Time:** 6-8 hours

### Phase 2: Typography & Spacing (Week 1-2)
**Goal:** Update fonts and increase spacing for authentic Munich look  
**Status:** ⏳ Pending  
**Estimated Time:** 4-5 hours

### Phase 3: Documentation & Content (Week 2)
**Goal:** Update all documentation and content references  
**Status:** ⏳ Pending  
**Estimated Time:** 1-2 hours

### Phase 4: UX Enhancements (Week 2-3)
**Goal:** Improve user experience with explanations and mobile navigation  
**Status:** ⏳ Pending  
**Estimated Time:** 1-2 weeks

---

## 🎯 Phase 1: Design System Cleanup

### Task 1.1: Remove Progressive-Melange Overlays
**Files to Update:**
- [ ] `src/components/RunningTrainingApp.jsx` (21 instances)
- [ ] `src/components/onboarding/WelcomeFlow.jsx` (1 instance)
- [ ] `src/components/training/TrainingLogForm.jsx` (1 instance)
- [ ] `src/components/calculator/GoldenPaceResults.jsx` (2 instances)
- [ ] `src/components/calculator/GoldenPaceCalculatorForm.jsx` (1 instance)
- [ ] `src/components/blog/ArticleModal.jsx` (1 instance)
- [ ] `src/components/profile/ProfileDashboard.jsx` (8 instances)
- [ ] `src/index.css` (CSS class definition)

**Action:** Remove all `<div className="progressive-melange">` elements and related CSS

**Status:** ⏳ Pending

---

### Task 1.2: Standardize Border-Radius to 0
**Files to Update:**
- [ ] `src/index.css` - Update all border-radius values
  - Line 100: `border-radius: 4px;` → `0`
  - Line 618: `border-radius: 0.25rem;` → `0`
  - Line 700: `border-radius: 2px;` → `0`
  - Line 731: `border-radius: 50%;` → `0` (unless for circular avatars)
  - Line 764: `border-radius: 6px;` → `0`
- [ ] Component files - Check for inline `borderRadius` styles
- [ ] Tailwind classes - Replace `rounded-*` with `rounded-none` where needed

**Action:** Set all border-radius to 0 for strict geometric design

**Status:** ⏳ Pending

---

### Task 1.3: Remove Backup Files
**Files to Remove:**
- [ ] `src/components/RunningTrainingApp.jsx.backup`
- [ ] `src/components/RunningTrainingApp.jsx.backup-jsx-fix`
- [ ] `src/content/articles.js.bak`
- [ ] `src/content/trainingPlans.js.bak`

**Action:** Delete all backup files

**Status:** ⏳ Pending

---

### Task 1.4: Verify Build & Test
**Actions:**
- [ ] Run `npm run build` to verify no errors
- [ ] Check for any remaining `progressive-melange` references
- [ ] Verify all borders are geometric (no rounded corners)
- [ ] Visual check of key pages

**Status:** ⏳ Pending

---

## 🎨 Phase 2: Typography & Spacing

### Task 2.1: Update Typography to Univers-Inspired Font
**Files to Update:**
- [ ] `src/index.css` - Update `--font-geometric` variable
- [ ] Add web font import if using Univers Next or Avenir Next
- [ ] Fallback to system fonts if web font unavailable

**Options:**
1. **Univers Next** (if available via web font)
2. **Avenir Next** (close alternative, widely available)
3. **System font stack** (current Inter with Univers-inspired fallback)

**Status:** ⏳ Pending

---

### Task 2.2: Increase Spacing by 20-30%
**Files to Update:**
- [ ] `src/index.css` - Update spacing scale variables
- [ ] Component files - Increase padding/margins
- [ ] Review mobile spacing for touch targets

**Action:** Multiply all spacing values by 1.2-1.3

**Status:** ⏳ Pending

---

## 📝 Phase 3: Documentation & Content

### Task 3.1: Update README.md
**Changes:**
- [ ] Replace all "GoldenPace" with "Pace Index"
- [ ] Update feature descriptions
- [ ] Add Munich 1972 design system section
- [ ] Update sample calculations

**Status:** ⏳ Pending

---

### Task 3.2: Content File Review
**Files to Check:**
- [ ] `src/content/articles.js` - Verify all references updated
- [ ] Any other user-facing content files

**Status:** ⏳ Pending

---

## 🚀 Phase 4: UX Enhancements

### Task 4.1: Post-Calculator Explanation Modal
**Features:**
- [ ] Explain what Pace Index means
- [ ] Show how to use training paces
- [ ] Guide to next steps (view plans, track progress)

**Status:** ⏳ Pending

---

### Task 4.2: Mobile Navigation Improvements
**Features:**
- [ ] Bottom tab navigation for mobile
- [ ] Improved mobile layouts
- [ ] Touch-friendly spacing

**Status:** ⏳ Pending

---

## 📊 Progress Tracking

### Phase 1 Progress: 4/4 tasks complete ✅
- [x] Task 1.1: Remove Progressive-Melange Overlays ✅
- [x] Task 1.2: Standardize Border-Radius ✅
- [x] Task 1.3: Remove Backup Files ✅
- [x] Task 1.4: Verify Build & Test ✅

### Phase 2 Progress: 2/2 tasks complete ✅
- [x] Task 2.1: Update Typography ✅
- [x] Task 2.2: Increase Spacing ✅

### Phase 3 Progress: 2/2 tasks complete ✅
- [x] Task 3.1: Update README ✅
- [x] Task 3.2: Content Review ✅

### Phase 4 Progress: 0/2 tasks complete
- [ ] Task 4.1: Post-Calculator Modal
- [ ] Task 4.2: Mobile Navigation

---

## ✅ Definition of Done

### Phase 1 Complete When:
- ✅ Zero `progressive-melange` references in codebase
- ✅ All `border-radius` values are 0 (except circular avatars if needed)
- ✅ All backup files removed
- ✅ Build passes with no errors
- ✅ Visual verification of geometric design

### Phase 2 Complete When:
- ✅ Typography updated to Univers-inspired font
- ✅ Spacing increased by 20-30% throughout
- ✅ Mobile spacing verified for touch targets

### Phase 3 Complete When:
- ✅ README fully updated
- ✅ All content files reviewed and updated

### Phase 4 Complete When:
- ✅ Post-calculator modal implemented and tested
- ✅ Mobile navigation improved and tested

---

## 🎯 Success Criteria

**Design Authenticity:**
- No decorative overlays or blur effects
- Strict geometric borders (no rounded corners)
- Authentic Munich 1972 typography
- Generous spacing throughout

**Code Quality:**
- No backup files in repository
- Clean, maintainable code
- All builds passing
- No console errors

**User Experience:**
- Clear explanations for new users
- Mobile-friendly navigation
- Consistent design language

---

*This plan will be updated as tasks are completed.*

