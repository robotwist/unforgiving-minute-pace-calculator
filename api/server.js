const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "*.stripe.com"],
      connectSrc: ["'self'", "api.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 payment requests per windowMs
  message: 'Too many payment requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: [
    'https://unforgivingminute.netlify.app',
    'https://unforgiving-minute.netlify.app',
    'http://localhost:3000' // for development
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(limiter);
app.use(cors(corsOptions));
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Security logging
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400
}));

// Input validation middleware
const validateLead = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('source').trim().isLength({ max: 50 }).withMessage('Source must be less than 50 characters')
];

const validateCoachingApplication = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('phone').optional({ nullable: true }).trim().isLength({ max: 50 }).withMessage('Phone must be less than 50 characters'),
  body('goal').optional({ nullable: true }).trim().isLength({ max: 2000 }).withMessage('Goal must be less than 2000 characters'),
  body('primaryEvent').optional({ nullable: true }).trim().isLength({ max: 50 }).withMessage('Primary event must be less than 50 characters'),
  body('experience').optional({ nullable: true }).trim().isLength({ max: 2000 }).withMessage('Experience must be less than 2000 characters'),
  body('currentWeeklyMileage').optional({ nullable: true }).isInt({ min: 0, max: 300 }).withMessage('Weekly mileage must be between 0 and 300'),
  body('availability').optional({ nullable: true }).trim().isLength({ max: 1000 }).withMessage('Availability must be less than 1000 characters'),
  body('timeZone').optional({ nullable: true }).trim().isLength({ max: 80 }).withMessage('Time zone must be less than 80 characters'),
  body('notes').optional({ nullable: true }).trim().isLength({ max: 4000 }).withMessage('Notes must be less than 4000 characters'),
  body('referrer').optional({ nullable: true }).trim().isLength({ max: 200 }).withMessage('Referrer must be less than 200 characters'),
  body('consent').optional({ nullable: true }).isBoolean().withMessage('Consent must be a boolean'),
  body('source').optional({ nullable: true }).trim().isLength({ max: 50 }).withMessage('Source must be less than 50 characters'),
];

const validatePayment = [
  body('planId').trim().isLength({ min: 1, max: 50 }).withMessage('Plan ID is required'),
  body('amount').isInt({ min: 50, max: 100000 }).withMessage('Amount must be between $0.50 and $1000'),
  body('planName').trim().isLength({ min: 1, max: 100 }).withMessage('Plan name is required')
];

const validateCustomer = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters')
];

const validateSubscription = [
  body('customerId').trim().isLength({ min: 1, max: 100 }).withMessage('Customer ID is required'),
  body('priceId').trim().isLength({ min: 1, max: 100 }).withMessage('Price ID is required')
];

// Simple leads capture (temporary storage/logging)
const leads = [];

// Simple coaching application capture (temporary storage/logging)
const coachingApplications = [];

function safeStr(value) {
  return (value === undefined || value === null) ? '' : String(value);
}

async function sendSlackText(text) {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  try {
    const https = require('https');
    const payload = JSON.stringify({ text });
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
  } catch (e) {
    console.log('Slack integration error:', e.message);
  }
}

async function postJsonWebhook(webhookUrl, payloadObj, label) {
  if (!webhookUrl) return;
  try {
    const https = require('https');
    const url = new URL(webhookUrl);
    const payload = JSON.stringify(payloadObj);
    const options = {
      hostname: url.hostname,
      path: url.pathname + (url.search || ''),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    };
    const reqHook = https.request(options, (r) => r.on('data', () => {}));
    reqHook.on('error', (e) => console.log(`${label || 'webhook'} error:`, e.message));
    reqHook.write(payload);
    reqHook.end();
  } catch (e) {
    console.log(`${label || 'webhook'} integration error:`, e.message);
  }
}

async function upsertBrevoContact({ email, name }) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_LIST_ID) return;
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
  } catch (e) {
    console.log('Brevo integration error:', e.message);
  }
}

app.post('/api/leads', validateLead, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, name, source } = req.body;
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

app.post('/api/coaching-applications', validateCoachingApplication, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      email,
      name,
      phone,
      goal,
      primaryEvent,
      experience,
      currentWeeklyMileage,
      availability,
      timeZone,
      notes,
      referrer,
      consent,
      source,
    } = req.body || {};

    const application = {
      id: Date.now().toString(),
      email,
      name: name || '',
      phone: safeStr(phone).trim(),
      goal: safeStr(goal).trim(),
      primaryEvent: safeStr(primaryEvent).trim(),
      experience: safeStr(experience).trim(),
      currentWeeklyMileage: (currentWeeklyMileage === undefined || currentWeeklyMileage === null) ? null : Number(currentWeeklyMileage),
      availability: safeStr(availability).trim(),
      timeZone: safeStr(timeZone).trim(),
      notes: safeStr(notes).trim(),
      referrer: safeStr(referrer).trim(),
      consent: Boolean(consent),
      source: (source || 'coaching_application').toString().slice(0, 50),
      createdAt: new Date().toISOString(),
    };

    coachingApplications.push(application);
    console.log('New coaching application captured:', application);

    await upsertBrevoContact({ email: application.email, name: application.name });

    const slackLines = [
      `New coaching application: ${application.email}${application.name ? ` (${application.name})` : ''}`,
      `Event: ${application.primaryEvent || '--'} | Mileage: ${application.currentWeeklyMileage ?? '--'} | TZ: ${application.timeZone || '--'}`,
      `Goal: ${application.goal ? application.goal.slice(0, 500) : '--'}`,
      `Experience: ${application.experience ? application.experience.slice(0, 500) : '--'}`,
      `Availability: ${application.availability ? application.availability.slice(0, 500) : '--'}`,
      `Referrer: ${application.referrer || '--'} | Consent: ${application.consent ? 'yes' : 'no'} | Source: ${application.source}`,
    ];
    await sendSlackText(slackLines.join('\n'));

    await postJsonWebhook(process.env.ZAPIER_WEBHOOK_URL, application, 'Zapier webhook');

    return res.json({ ok: true, id: application.id });
  } catch (err) {
    console.error('Coaching application capture error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// Create payment intent for one-time purchases
app.post('/api/create-payment-intent', paymentLimiter, validatePayment, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

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
app.post('/api/create-customer', validateCustomer, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

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
app.post('/api/create-subscription', paymentLimiter, validateSubscription, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

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
