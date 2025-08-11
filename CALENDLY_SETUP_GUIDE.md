# Calendly Integration Setup Guide

## Overview
Your consultation system is now integrated with Calendly. Users who purchase the Personal Coaching plan ($297) can now schedule actual consultations with you.

## Setup Steps

### 1. Create Your Calendly Account
1. Go to [calendly.com](https://calendly.com) 
2. Sign up for a free account (or upgrade to paid for more features)
3. Set up your availability and preferences

### 2. Create a Consultation Event Type
1. In your Calendly dashboard, click "Create" → "Event Type"
2. Choose "One-on-One" meeting type
3. Configure your consultation:
   - **Event Name**: "Personal Coaching Consultation" 
   - **Duration**: 45 minutes (recommended)
   - **Description**: "Comprehensive assessment of your running goals, current fitness level, and personalized training recommendations"
   - **Location**: Zoom/Google Meet/Phone (your preference)

### 3. Update the Integration Code
Replace the placeholder URL in the code with your actual Calendly link:

**File to edit**: `/src/components/consultation/CalendlyModal.jsx`
**Line 15**: Change `'https://calendly.com/your-calendly-username/consultation'` to your actual Calendly URL

**Example**: If your username is "robwistrand" and event is "coaching-consultation":
```javascript
url: 'https://calendly.com/robwistrand/coaching-consultation',
```

**Line 76**: Also update the fallback link with the same URL

### 4. How It Works Now

**For New Customers:**
1. User clicks "Schedule Consultation" button
2. Stripe payment form appears for $297 payment
3. After successful payment, they can access the scheduling system

**For Existing Coaching Customers:**
1. Button shows "Schedule Session" 
2. Clicking opens Calendly modal directly (no payment required)
3. They can book follow-up sessions

### 5. Email Notifications
Calendly automatically sends:
- **To You**: New booking notifications with attendee details
- **To Customer**: Confirmation email with meeting details
- **To Both**: Calendar invites and reminders

### 6. Customization Options

**Free Calendly Features:**
- Basic scheduling and notifications
- Calendar integration (Google, Outlook, etc.)
- Email confirmations
- Time zone detection

**Paid Calendly Features ($8-12/month):**
- Custom branding and colors
- Workflow automations
- Payment integration (though you already have Stripe)
- Advanced analytics
- Multiple event types

### 7. Testing the Integration

1. Deploy your changes: `npm run build` and push to git
2. Visit your site and try purchasing the Personal Coaching plan
3. Complete a test purchase with Stripe test cards
4. Verify the Calendly modal opens correctly

### 8. Stripe Test Cards for Testing
- **Successful payment**: 4242 4242 4242 4242
- **Card declined**: 4000 0000 0000 0002
- Any future expiry date and any 3-digit CVC

## Your Current Pricing Structure
- **Basic Training Plan**: $49 (12-week program)
- **Advanced Training Plan**: $97 (16-week program) 
- **Personal Coaching**: $297 (includes consultation scheduling)

## Next Steps
1. Set up your Calendly account and event
2. Update the URLs in CalendlyModal.jsx
3. Test the complete flow
4. Consider adding consultation prep questions in Calendly

The integration is complete - you just need to plug in your actual Calendly URL and you'll have a fully functional consultation booking system!
