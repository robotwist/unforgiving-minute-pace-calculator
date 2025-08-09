#!/usr/bin/env node

/**
 * Monitor Netlify deployment progress
 * Checks for updated file hashes and build timestamps
 */

const https = require('https');

const FRONTEND_URL = 'https://unforgivingminute.netlify.app';
const TARGET_JS_HASH = 'main.c54b6bba.js';
const TARGET_CSS_HASH = 'main.33d76f1d.css';
const TARGET_TIMESTAMP = '2025-08-09T17:10:00Z';

function checkDeployment() {
  return new Promise((resolve, reject) => {
    https.get(FRONTEND_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const jsMatch = data.match(/\/static\/js\/(main\.[a-f0-9]+\.js)/);
          const cssMatch = data.match(/\/static\/css\/(main\.[a-f0-9]+\.css)/);
          const timestampMatch = data.match(/Build timestamp: ([^-]+)/);
          
          const jsHash = jsMatch ? jsMatch[1] : 'Not found';
          const cssHash = cssMatch ? cssMatch[1] : 'Not found';
          const timestamp = timestampMatch ? timestampMatch[1] : 'Not found';
          
          const jsUpdated = jsHash === TARGET_JS_HASH;
          const cssUpdated = cssHash === TARGET_CSS_HASH;
          const timestampUpdated = timestamp.includes('17:10');
          
          console.log(`[${new Date().toISOString()}] Deployment Check:`);
          console.log(`  JS Hash: ${jsHash} ${jsUpdated ? '✅' : '❌'}`);
          console.log(`  CSS Hash: ${cssHash} ${cssUpdated ? '✅' : '❌'}`);
          console.log(`  Timestamp: ${timestamp} ${timestampUpdated ? '✅' : '❌'}`);
          
          if (jsUpdated && cssUpdated) {
            console.log(`  🎉 DEPLOYMENT SUCCESSFUL! Versions synchronized.`);
            resolve(true);
          } else {
            console.log(`  ⏳ Still deploying... (checking again in 30s)`);
            resolve(false);
          }
        } else {
          console.log(`  ❌ HTTP ${res.statusCode} - Site may be down`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`  ❌ Error: ${err.message}`);
      reject(err);
    });
  });
}

async function monitorDeployment() {
  console.log('🔄 MONITORING NETLIFY DEPLOYMENT...');
  console.log(`Target JS Hash: ${TARGET_JS_HASH}`);
  console.log(`Target CSS Hash: ${TARGET_CSS_HASH}`);
  console.log(`Target Timestamp: ${TARGET_TIMESTAMP}`);
  console.log(''.padEnd(50, '='));
  
  let attempts = 0;
  const maxAttempts = 20; // 10 minutes max
  
  while (attempts < maxAttempts) {
    try {
      const success = await checkDeployment();
      if (success) {
        console.log('\n🎯 DEPLOYMENT VERIFICATION COMPLETE!');
        console.log('✅ Local and deployed versions are synchronized.');
        break;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      }
    } catch (error) {
      console.error('Monitoring error:', error.message);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  if (attempts >= maxAttempts) {
    console.log('\n⏰ TIMEOUT: Deployment monitoring stopped after 10 minutes.');
    console.log('💡 Check Netlify dashboard for build status and logs.');
  }
}

// Start monitoring
monitorDeployment();
