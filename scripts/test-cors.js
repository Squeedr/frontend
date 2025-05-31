#!/usr/bin/env node

/**
 * CORS Configuration Test Script
 * Tests connectivity between frontend and Strapi backend
 */

const https = require('https');
const http = require('http');

// Configuration
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

console.log('🧪 Testing CORS Configuration...\n');
console.log(`Frontend URL: ${FRONTEND_URL}`);
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`API URL: ${API_URL}\n`);

/**
 * Test basic connectivity to Strapi
 */
async function testBasicConnectivity() {
  console.log('📡 Testing basic connectivity to Strapi...');
  
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_URL);
    const request = (url.protocol === 'https:' ? https : http).get(url, (res) => {
      console.log(`✅ Status: ${res.statusCode}`);
      console.log(`✅ Headers: ${JSON.stringify(res.headers, null, 2)}\n`);
      resolve(true);
    });
    
    request.on('error', (error) => {
      console.log(`❌ Connection failed: ${error.message}\n`);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log('❌ Connection timeout\n');
      resolve(false);
    });
  });
}

/**
 * Test CORS preflight request
 */
async function testCORSPreflight() {
  console.log('🌐 Testing CORS preflight request...');
  
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/auth/local`);
    const postData = '';
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    };
    
    const request = (url.protocol === 'https:' ? https : http).request(options, (res) => {
      console.log(`✅ Status: ${res.statusCode}`);
      console.log(`✅ Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
      console.log(`✅ Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
      console.log(`✅ Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}\n`);
      
      const corsEnabled = res.headers['access-control-allow-origin'] === FRONTEND_URL || 
                         res.headers['access-control-allow-origin'] === '*';
      
      if (corsEnabled) {
        console.log('✅ CORS is properly configured!\n');
        resolve(true);
      } else {
        console.log('❌ CORS configuration issue detected\n');
        resolve(false);
      }
    });
    
    request.on('error', (error) => {
      console.log(`❌ CORS preflight failed: ${error.message}\n`);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log('❌ CORS preflight timeout\n');
      resolve(false);
    });
    
    request.end();
  });
}

/**
 * Test authentication endpoint
 */
async function testAuthEndpoint() {
  console.log('🔐 Testing authentication endpoint...');
  
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/users/me`);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Origin': FRONTEND_URL,
        'Content-Type': 'application/json'
      }
    };
    
    const request = (url.protocol === 'https:' ? https : http).request(options, (res) => {
      console.log(`✅ Status: ${res.statusCode}`);
      
      if (res.statusCode === 401) {
        console.log('✅ Authentication endpoint accessible (401 Unauthorized expected without token)\n');
        resolve(true);
      } else if (res.statusCode === 403) {
        console.log('✅ Authentication endpoint accessible (403 Forbidden expected without token)\n');
        resolve(true);
      } else if (res.statusCode === 200) {
        console.log('✅ Authentication endpoint accessible\n');
        resolve(true);
      } else {
        console.log(`❌ Unexpected status code: ${res.statusCode}\n`);
        resolve(false);
      }
    });
    
    request.on('error', (error) => {
      console.log(`❌ Auth endpoint test failed: ${error.message}\n`);
      resolve(false);
    });
    
    request.setTimeout(5000, () => {
      console.log('❌ Auth endpoint timeout\n');
      resolve(false);
    });
    
    request.end();
  });
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting CORS Configuration Tests\n');
  
  const tests = [
    { name: 'Basic Connectivity', fn: testBasicConnectivity },
    { name: 'CORS Preflight', fn: testCORSPreflight },
    { name: 'Auth Endpoint', fn: testAuthEndpoint }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! CORS is properly configured.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check your Strapi CORS configuration.');
    console.log('💡 Refer to CORS-SETUP.md for configuration instructions.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testBasicConnectivity,
  testCORSPreflight,
  testAuthEndpoint,
  runTests
}; 