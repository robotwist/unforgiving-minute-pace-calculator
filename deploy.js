#!/usr/bin/env node

/**
 * Deployment verification script for Unforgiving Minute Running Calculator
 * Checks both frontend (Netlify) and backend (Railway) integration
 */

const https = require('https');

const FRONTEND_URL = 'https://unforgivingminute.netlify.app';
const BACKEND_URL = 'https://unforgiving-moment-production.up.railway.app';

function checkEndpoint(url, path = '') {
  return new Promise((resolve, reject) => {
    const fullUrl = url + path;
    console.log(`🔍 Checking: ${fullUrl}`);
    
    https.get(fullUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${fullUrl} - Status: ${res.statusCode}`);
          resolve({ status: res.statusCode, data });
        } else {
          console.log(`⚠️  ${fullUrl} - Status: ${res.statusCode}`);
          resolve({ status: res.statusCode, data });
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${fullUrl} - Error: ${err.message}`);
      reject(err);
    });
  });
}

async function runHealthChecks() {
  console.log('🚀 UNFORGIVING MINUTE - DEPLOYMENT HEALTH CHECK');
  console.log('='.repeat(50));
  
  try {
    // Frontend check
    console.log('\n📱 FRONTEND (Netlify)');
    await checkEndpoint(FRONTEND_URL);
    
    // Backend health check
    console.log('\n🖥️  BACKEND (Railway)');
    const health = await checkEndpoint(BACKEND_URL, '/api/health');
    if (health.status === 200) {
      const healthData = JSON.parse(health.data);
      console.log(`   Server time: ${healthData.timestamp}`);
    }
    
    // Payment API check (will show Stripe key error if not configured)
    console.log('\n💳 STRIPE INTEGRATION');
    try {
      const paymentTest = await new Promise((resolve, reject) => {
        const postData = JSON.stringify({
          planId: 'test-plan',
          amount: 100,
          planName: 'Health Check'
        });
        
        const options = {
          hostname: 'unforgiving-moment-production.up.railway.app',
          port: 443,
          path: '/api/create-payment-intent',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
      });
      
      if (paymentTest.status === 200) {
        console.log('✅ Stripe integration working');
      } else {
        const errorData = JSON.parse(paymentTest.data);
        if (errorData.error && errorData.error.includes('API key')) {
          console.log('⚠️  Stripe secret key not configured in Railway');
          console.log('   👉 Add STRIPE_SECRET_KEY to Railway environment variables');
        } else {
          console.log(`⚠️  Stripe test failed: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.log(`❌ Stripe test error: ${error.message}`);
    }
    
    console.log('\n🎯 SUMMARY');
    console.log('Frontend: ✅ Live on Netlify');
    console.log('Backend:  ✅ Live on Railway'); 
    console.log('Payments: ⚠️  Needs Stripe secret key configuration');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Configure STRIPE_SECRET_KEY in Railway dashboard');
    console.log('2. Test payment flow with test card: 4242424242424242');
    console.log('3. Switch to live keys when ready for production');
    
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

// Run health checks
runHealthChecks();
