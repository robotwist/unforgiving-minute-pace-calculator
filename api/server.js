const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Simple leads capture (temporary storage/logging)
const leads = [];

app.post('/api/leads', async (req, res) => {
  try {
    const { email, name, source } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    const lead = {
      id: Date.now().toString(),
      email,
      name: name || '',
      source: source || 'unknown',
      createdAt: new Date().toISOString(),
    };
    leads.push(lead);
    console.log('New lead captured:', lead);

    // Optional: Slack webhook
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const https = require('https');
        const payload = JSON.stringify({ text: `New lead: ${email}${name ? ` (${name})` : ''} — source: ${lead.source}` });
        const url = new URL(process.env.SLACK_WEBHOOK_URL);
        const options = {
          hostname: url.hostname,
          path: url.pathname + (url.search || ''),
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
        };
        const reqSlack = https.request(options, (r) => r.on('data', () => {}));
        reqSlack.on('error', (e) => console.log('Slack webhook error:', e.message));
        reqSlack.write(payload);
        reqSlack.end();
      } catch (e) { console.log('Slack integration error:', e.message); }
    }

    // Optional: Brevo contact upsert
    if (process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID) {
      try {
        const https = require('https');
        const payload = JSON.stringify({
          email,
          attributes: { FIRSTNAME: name || '' },
          listIds: [parseInt(process.env.BREVO_LIST_ID, 10)].filter(Boolean),
          updateEnabled: true
        });
        const options = {
          hostname: 'api.brevo.com',
          path: '/v3/contacts',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
            'api-key': process.env.BREVO_API_KEY
          }
        };
        const reqBrevo = https.request(options, (r) => r.on('data', () => {}));
        reqBrevo.on('error', (e) => console.log('Brevo error:', e.message));
        reqBrevo.write(payload);
        reqBrevo.end();
      } catch (e) { console.log('Brevo integration error:', e.message); }
    }

    // Optional: Zapier/Make webhook
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        const https = require('https');
        const url = new URL(process.env.ZAPIER_WEBHOOK_URL);
        const payload = JSON.stringify(lead);
        const options = {
          hostname: url.hostname,
          path: url.pathname + (url.search || ''),
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
        };
        const reqZap = https.request(options, (r) => r.on('data', () => {}));
        reqZap.on('error', (e) => console.log('Zapier webhook error:', e.message));
        reqZap.write(payload);
        reqZap.end();
      } catch (e) { console.log('Zapier integration error:', e.message); }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Lead capture error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Create payment intent for one-time purchases
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { planId, amount, planName } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      metadata: {
        planId,
        planName,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});

// Create customer
app.post('/api/create-customer', async (req, res) => {
  try {
    const { email, name } = req.body;

    const customer = await stripe.customers.create({
      email,
      name,
    });

    res.send({ customerId: customer.id });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).send({ error: error.message });
  }
});

// Create subscription for recurring payments (Personal Coaching)
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { customerId, priceId } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId, // e.g., 'price_personal_coaching'
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).send({ error: error.message });
  }
});

// Webhook to handle Stripe events
app.post('/api/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // TODO: Update your database with successful payment
      // Grant access to the purchased plan
      
      break;
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Subscription payment succeeded:', invoice.id);
      
      // TODO: Update subscription status in your database
      
      break;
      
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      // TODO: Revoke access to subscription-based features
      
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Stripe webhook endpoint: /api/webhook`);
});

module.exports = app;
