/**
 * X1PAG API Test Script
 * Tests actual API connection with your credentials
 * Run with: node test-x1pag-api.js
 */

const crypto = require('crypto');

// Configuration from .env.local
const CONFIG = {
  merchantKey: '98bb56a2-f8e0-11f0-af6a-9ebb24d99120',
  password: '2287b31bed4d0eed2de071d1479ac5d5',
  host: 'https://pay.x1pag.com',
};

// Test order details (using small amount to minimize impact)
const TEST_ORDER = {
  number: `TEST-ORDER-${Date.now()}`,
  amount: '1.00',
  currency: 'USD',
  description: 'Test payment',
};

function generateHash(orderNumber, amount, currency, description, password) {
  const data = (orderNumber + amount + currency + description + password).toUpperCase();
  const md5Hash = crypto.createHash('md5').update(data).digest('hex');
  const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex');
  return sha1Hash;
}

async function testX1PAGAPI() {
  console.log('='.repeat(60));
  console.log('X1PAG API Test');
  console.log('='.repeat(60));
  console.log('');

  // Generate hash
  const hash = generateHash(
    TEST_ORDER.number,
    TEST_ORDER.amount,
    TEST_ORDER.currency,
    TEST_ORDER.description,
    CONFIG.password
  );

  console.log('Test Order Details:');
  console.log('  Order Number:', TEST_ORDER.number);
  console.log('  Amount:', TEST_ORDER.amount);
  console.log('  Currency:', TEST_ORDER.currency);
  console.log('  Description:', TEST_ORDER.description);
  console.log('');

  console.log('Hash Generation:');
  const concatenated = TEST_ORDER.number + TEST_ORDER.amount + TEST_ORDER.currency + TEST_ORDER.description + CONFIG.password;
  console.log('  Concatenated:', concatenated);
  console.log('  Uppercased:', concatenated.toUpperCase());
  console.log('  Generated Hash:', hash);
  console.log('');

  // Prepare request body (field order matches documentation)
  const requestBody = {
    merchant_key: CONFIG.merchantKey,
    operation: 'purchase',
    order: {
      number: TEST_ORDER.number,
      amount: TEST_ORDER.amount,
      currency: TEST_ORDER.currency,
      description: TEST_ORDER.description,
    },
    success_url: 'http://localhost:3000/payment/success',
    cancel_url: 'http://localhost:3000/payment/cancel',
    customer: {
      name: 'Test User',
      email: 'test@example.com',
    },
    hash: hash,
  };

  console.log('Request Body:');
  console.log(JSON.stringify(requestBody, null, 2));
  console.log('');

  try {
    console.log('Sending request to X1PAG...');
    console.log('URL:', `${CONFIG.host}/api/v1/session`);
    console.log('');

    const response = await fetch(`${CONFIG.host}/api/v1/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log('');

    const responseText = await response.text();
    console.log('Response Body:');
    console.log(responseText);
    console.log('');

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Parsed Response:');
      console.log(JSON.stringify(result, null, 2));
      console.log('');
    } catch (e) {
      console.error('Failed to parse response as JSON');
    }

    if (response.ok) {
      console.log('✅ SUCCESS: X1PAG API request succeeded');
      if (result.redirect_url) {
        console.log('Redirect URL:', result.redirect_url);
      }
    } else {
      console.log('❌ ERROR: X1PAG API returned error');
      if (result) {
        if (result.error_message) {
          console.log('Error Message:', result.error_message);
        }
        if (result.errors && Array.isArray(result.errors)) {
          console.log('Validation Errors:');
          result.errors.forEach((err, index) => {
            console.log(`  ${index + 1}. Code ${err.error_code}: ${err.error_message}`);
          });
        }
      }
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error.message);
  }

  console.log('');
  console.log('='.repeat(60));
}

// Run the test
testX1PAGAPI();
