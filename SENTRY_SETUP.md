# 🔍 Sentry Error Tracking Setup Guide

**Status:** Ready to implement  
**Free Tier:** 5,000 errors/month, 5GB logs, 5M spans

---

## 📋 Setup Steps

### 1. Create Sentry Account
- Visit: https://sentry.io/for/react/
- Sign up (free Developer plan)
- Create new project → Select "React"

### 2. Install Sentry SDK
```bash
npm install @sentry/react
```

### 3. Get Your DSN
- From Sentry dashboard → Project Settings → Client Keys (DSN)
- Copy your DSN (format: `https://xxx@sentry.io/xxx`)

### 4. Initialize Sentry

**Update `src/index.js`:**
```jsx
import * as Sentry from "@sentry/react";

// Initialize Sentry (only in production or when DSN is provided)
if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // 100% in dev, lower in prod
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% when errors occur
    // Filter out localhost
    beforeSend(event) {
      if (event.request?.url?.includes('localhost')) {
        return null; // Don't send localhost errors
      }
      return event;
    }
  });
}

// ... rest of index.js
```

### 5. Update ErrorBoundary

**Update `src/components/common/ErrorBoundary.jsx`:**
```jsx
import * as Sentry from "@sentry/react";

componentDidCatch(error, errorInfo) {
  logger.error('Error boundary caught an error:', error, errorInfo);
  
  // Send to Sentry if initialized
  if (window.Sentry) {
    Sentry.captureException(error, {
      contexts: { react: errorInfo }
    });
  }
}
```

### 6. Add Environment Variable

**Create/Update `.env.production`:**
```bash
REACT_APP_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
```

**Note:** Don't commit `.env` files with real DSN to git. Add to Netlify environment variables instead.

### 7. Add to Netlify

**Netlify Dashboard → Site Settings → Environment Variables:**
- Key: `REACT_APP_SENTRY_DSN`
- Value: Your Sentry DSN
- Scope: Production (or All)

---

## 🎯 Usage Examples

### Manual Error Reporting
```jsx
import * as Sentry from "@sentry/react";

try {
  // Some operation
} catch (error) {
  Sentry.captureException(error);
  // Or with context
  Sentry.captureException(error, {
    tags: { feature: 'calculator' },
    extra: { raceTime, raceDistance }
  });
}
```

### Custom Events
```jsx
Sentry.captureMessage('User completed calculation', 'info');
```

### Performance Monitoring
```jsx
const transaction = Sentry.startTransaction({
  name: "Calculate GoldenPace",
  op: "calculation"
});

// Your code here

transaction.finish();
```

---

## 🎁 Free Tier Benefits

✅ **5,000 errors/month** - Plenty for most apps  
✅ **5GB logs/month** - Application logging  
✅ **5M spans/month** - Performance monitoring  
✅ **50 session replays** - See what users did before errors  
✅ **1 cron monitor** - Scheduled checks  
✅ **1 uptime monitor** - Site availability

---

## 🔒 Security Best Practices

1. **Don't commit DSN** - Use environment variables
2. **Filter sensitive data** - Use `beforeSend` to remove PII
3. **Limit sample rates** - Lower in production
4. **Filter localhost** - Don't send development errors

---

## 📊 What You'll Get

- **Real-time error alerts** - Email/Slack when errors occur
- **Error context** - Stack traces, user actions, browser info
- **Performance data** - Slow operations, bottlenecks
- **Session replays** - See exactly what users did
- **Release tracking** - Which version has issues

---

## 🚀 Quick Start

Once you have your DSN:

1. Install: `npm install @sentry/react`
2. Add DSN to `.env.production` (or Netlify env vars)
3. Initialize in `index.js` (see code above)
4. Deploy and test

**Estimated time:** 15-20 minutes

---

## 📚 Resources

- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Free Tier Details](https://sentry.io/pricing/)
- [Best Practices](https://docs.sentry.io/product/best-practices/)
