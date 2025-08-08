# Stripe Backend API Example

This directory contains example backend code for processing Stripe payments.

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install express stripe cors dotenv
   ```

2. **Create `.env` file:**
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

3. **Run the server:**
   ```bash
   node server.js
   ```

## API Endpoints

- `POST /api/create-payment-intent` - Create payment intent for one-time purchases
- `POST /api/create-subscription` - Create subscription for recurring payments
- `POST /api/create-customer` - Create Stripe customer
- `POST /api/webhook` - Handle Stripe webhooks

## Integration Steps

1. Deploy this backend to Heroku, Railway, or Vercel
2. Update `REACT_APP_API_URL` in your frontend `.env`
3. Add your Stripe keys to the backend environment
4. Test with Stripe test cards: `4242424242424242`

## Price IDs (Create these in your Stripe Dashboard)

- 5K Mastery Plan: `price_5k_mastery`
- Marathon Breakthrough: `price_marathon_breakthrough`  
- Personal Coaching: `price_personal_coaching` (recurring monthly)

## Security Notes

- Never expose secret keys in frontend code
- Always validate webhooks with Stripe signatures
- Use HTTPS in production
- Validate payment amounts on the backend
