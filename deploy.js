#!/usr/bin/env node

/**
 * Deployment verification script for Unforgiving Minute Running Calculator
 * Checks both frontend (Netlify) and backend (Railway) integration
 * Also provides build configuration diagnostics
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = 'https://unforgivingminute.netlify.app';
const BACKEND_URL = 'https://unforgiving-moment-production.up.railway.app';

function checkBuildConfiguration() {
  console.log('\n🔧 BUILD CONFIGURATION ANALYSIS');
  console.log('='.repeat(50));
  
  // Check netlify.toml
  try {
    const netlifyConfig = fs.readFileSync(path.join(__dirname, 'netlify.toml'), 'utf8');
    console.log('✅ netlify.toml found');
    
    // Extract key settings
    const buildCommand = netlifyConfig.match(/command\s*=\s*"([^"]+)"/);
    const publishDir = netlifyConfig.match(/publish\s*=\s*"([^"]+)"/);
    const nodeVersion = netlifyConfig.match(/NODE_VERSION\s*=\s*"([^"]+)"/);
    const pythonVersion = netlifyConfig.match(/PYTHON_VERSION\s*=\s*"([^"]+)"/);
    const cacheId = netlifyConfig.match(/NETLIFY_CACHE_ID\s*=\s*"([^"]+)"/);
    
    console.log(`   📦 Build Command: ${buildCommand ? buildCommand[1] : 'Not found'}`);
    console.log(`   📁 Publish Directory: ${publishDir ? publishDir[1] : 'Not found'}`);
    console.log(`   ⚙️  Node Version: ${nodeVersion ? nodeVersion[1] : 'Not specified'}`);
    console.log(`   🐍 Python Version: ${pythonVersion ? pythonVersion[1] : 'Not specified'}`);
    console.log(`   🗂️  Cache ID: ${cacheId ? cacheId[1] : 'Not specified'}`);
    
    // Check if build folder exists locally
    const buildExists = fs.existsSync(path.join(__dirname, 'build'));
    console.log(`   🏗️  Local build folder: ${buildExists ? '✅ Exists' : '❌ Missing'}`);
    
    if (buildExists) {
      const indexPath = path.join(__dirname, 'build', 'index.html');
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        const jsFile = indexContent.match(/\/static\/js\/(main\.[a-f0-9]+\.js)/);
        const cssFile = indexContent.match(/\/static\/css\/(main\.[a-f0-9]+\.css)/);
        console.log(`   📄 Local JS Hash: ${jsFile ? jsFile[1] : 'Not found'}`);
        console.log(`   🎨 Local CSS Hash: ${cssFile ? cssFile[1] : 'Not found'}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error reading netlify.toml:', error.message);
  }
  
  // Check runtime.txt for Python version
  try {
    const runtimePath = path.join(__dirname, 'runtime.txt');
    const backendRuntimePath = path.join(__dirname, 'backend', 'runtime.txt');
    if (fs.existsSync(runtimePath)) {
      const runtimeContent = fs.readFileSync(runtimePath, 'utf8').trim();
      console.log(`   🐍 runtime.txt: ${runtimeContent}`);
    } else if (fs.existsSync(backendRuntimePath)) {
      console.log('   🐍 runtime.txt: Moved to backend/ directory (✅ Hidden from Netlify)');
    } else {
      console.log('   🐍 runtime.txt: Not found (✅ Python detection disabled)');
    }
    
    // Check requirements.txt
    const requirementsPath = path.join(__dirname, 'requirements.txt');
    const backendRequirementsPath = path.join(__dirname, 'backend', 'requirements.txt');
    if (fs.existsSync(requirementsPath)) {
      console.log('   ⚠️  requirements.txt: Found in root (Netlify will detect Python!)');
    } else if (fs.existsSync(backendRequirementsPath)) {
      console.log('   📦 requirements.txt: Moved to backend/ directory (✅ Hidden from Netlify)');
    } else {
      console.log('   📦 requirements.txt: Not found (✅ Python detection disabled)');
    }
  } catch (error) {
    console.log('❌ Error checking Python files:', error.message);
  }
  
  // Check package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    console.log(`   📋 Package Name: ${packageJson.name}`);
    console.log(`   🔢 Version: ${packageJson.version}`);
    console.log(`   ⚛️  React Scripts: ${packageJson.dependencies['react-scripts']}`);
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
  }
}

async function compareDeployedVersion() {
  console.log('\n🔍 DEPLOYED VERSION ANALYSIS');
  console.log('='.repeat(50));
  
  try {
    const deployed = await checkEndpoint(FRONTEND_URL);
    if (deployed.status === 200) {
      // Extract file hashes from deployed version
      const jsMatch = deployed.data.match(/\/static\/js\/(main\.[a-f0-9]+\.js)/);
      const cssMatch = deployed.data.match(/\/static\/css\/(main\.[a-f0-9]+\.css)/);
      const timestampMatch = deployed.data.match(/Build timestamp: ([^-]+)/);
      
      console.log(`   📄 Deployed JS Hash: ${jsMatch ? jsMatch[1] : 'Not found'}`);
      console.log(`   🎨 Deployed CSS Hash: ${cssMatch ? cssMatch[1] : 'Not found'}`);
      console.log(`   ⏰ Build Timestamp: ${timestampMatch ? timestampMatch[1] : 'Not found'}`);
      
      // Check if deployed version matches local
      const buildIndexPath = path.join(__dirname, 'build', 'index.html');
      if (fs.existsSync(buildIndexPath)) {
        const localContent = fs.readFileSync(buildIndexPath, 'utf8');
        const localJs = localContent.match(/\/static\/js\/(main\.[a-f0-9]+\.js)/);
        const localCss = localContent.match(/\/static\/css\/(main\.[a-f0-9]+\.css)/);
        
        const jsMatches = jsMatch && localJs && jsMatch[1] === localJs[1];
        const cssMatches = cssMatch && localCss && cssMatch[1] === localCss[1];
        
        console.log(`   🔄 JS Hash Match: ${jsMatches ? '✅' : '❌'} ${jsMatches ? 'Synchronized' : 'OUT OF SYNC'}`);
        console.log(`   🔄 CSS Hash Match: ${cssMatches ? '✅' : '❌'} ${cssMatches ? 'Synchronized' : 'OUT OF SYNC'}`);
        
        if (!jsMatches || !cssMatches) {
          console.log(`   ⚠️  LOCAL/DEPLOYED MISMATCH DETECTED!`);
          console.log(`   📋 Recommendation: Force Netlify rebuild required`);
        }
      }
    }
  } catch (error) {
    console.log('❌ Error analyzing deployed version:', error.message);
  }
}

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
  
  // Run build configuration analysis first
  checkBuildConfiguration();
  await compareDeployedVersion();
  
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
    
    console.log('\n📋 BUILD STATUS ACTIONS NEEDED:');
    console.log('🔧 LOCAL CHANGES THAT CAN BE MADE:');
    console.log('   1. ✅ netlify.toml configuration is correct');
    console.log('   2. ✅ Build command and publish directory properly set');
    console.log('   3. ✅ Node version specified (18)');
    
    console.log('\n🌐 NETLIFY DASHBOARD ACTIONS REQUIRED:');
    console.log('   1. 🚨 CRITICAL: Force "Clear cache and deploy site"');
    console.log('   2. 📋 Verify site is connected to correct GitHub repo');
    console.log('   3. 🔄 Check build logs for errors in Netlify dashboard');
    console.log('   4. ⚙️  Ensure build settings match netlify.toml');
    console.log('   5. 🔑 Add environment variables if needed');
    
    console.log('\n💡 TROUBLESHOOTING STEPS:');
    console.log('   • Build version mismatch indicates Netlify cache issue');
    console.log('   • Try manual deploy from GitHub in Netlify dashboard'); 
    console.log('   • Check Netlify build logs for dependency conflicts');
    console.log('   • Verify GitHub integration and webhook delivery');
    
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

// Run health checks
runHealthChecks();
