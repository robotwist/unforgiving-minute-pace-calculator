// Analytics utility functions
export const trackEvent = (eventName, eventCategory, eventLabel, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: value,
    });
  }
};

export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Specific tracking functions for our app
export const trackCalculatorUsage = (raceDistance, raceTime, goldenPace) => {
  trackEvent('calculate_golden_pace', 'engagement', 'calculator_usage', 1);
  trackEvent('race_distance_used', 'calculator', raceDistance, 1);
};

export const trackProfileCreation = (experience, goalDistance) => {
  trackEvent('profile_created', 'user_engagement', 'profile_creation', 1);
  trackEvent('user_experience_level', 'demographics', experience, 1);
  trackEvent('goal_race_distance', 'goals', goalDistance, 1);
};

export const trackPurchaseAttempt = (planId, planName, price) => {
  trackEvent('purchase_initiated', 'ecommerce', planName, price);
  trackEvent('plan_interest', 'conversion', planId, 1);
};

export const trackPurchaseSuccess = (planId, planName, price, transactionId) => {
  // Enhanced ecommerce tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: price,
      currency: 'USD',
      items: [{
        item_id: planId,
        item_name: planName,
        category: 'training_plans',
        price: price,
        quantity: 1,
      }]
    });
  }
};

export const trackTabNavigation = (tabName) => {
  trackEvent('tab_navigation', 'navigation', tabName, 1);
};

export const trackPlanPreview = (planId, planName) => {
  trackEvent('plan_preview', 'engagement', planName, 1);
};

export const trackPlanDownload = (planId, planName) => {
  trackEvent('plan_download', 'engagement', planName, 1);
};

// Retention tracking
export const trackWeeklyCheckInSubmitted = () => {
  trackEvent('weekly_checkin_submitted', 'retention', 'weekly_checkin', 1);
};

export const trackWeeklyRecapCopied = () => {
  trackEvent('weekly_recap_copied', 'retention', 'share_week', 1);
};

export const trackActivityLogged = (activityType) => {
  trackEvent('activity_logged', 'retention', activityType || 'unknown', 1);
};
