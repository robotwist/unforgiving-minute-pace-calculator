import { loadStripe } from '@stripe/stripe-js';

// This is your test publishable API key.
// In production, replace with your live publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...');

export default stripePromise;
