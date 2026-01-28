/**
 * Test X1PAG Hash Generation
 * Run with: node test-x1pag-hash.js
 */

const crypto = require('crypto');

// Test data from X1PAG documentation example
const testData = {
  orderNumber: 'order-1234',
  amount: '0.19',
  currency: 'USD',
  description: 'Important gift',
  password: 'test_password', // Replace with actual password for testing
};

// Real data from your setup
const realData = {
  orderNumber: 'ODDSFLOW-PRO-12345678-1234567890',
  amount: '17.99',
  currency: 'USD',
  description: 'Pro Plan - 1 month',
  password: '2287b31bed4d0eed2de071d1479ac5d5',
};

function generateHash(orderNumber, amount, currency, description, password) {
  // Concatenate and uppercase
  const data = (orderNumber + amount + currency + description + password).toUpperCase();

  console.log('Step 1 - Concatenated and uppercased:');
  console.log(data);
  console.log('Length:', data.length);
  console.log('');

  // MD5 hash
  const md5Hash = crypto.createHash('md5').update(data).digest('hex');
  console.log('Step 2 - MD5 hash:');
  console.log(md5Hash);
  console.log('');

  // SHA1 of MD5
  const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex');
  console.log('Step 3 - SHA1 of MD5:');
  console.log(sha1Hash);
  console.log('');

  return sha1Hash;
}

console.log('='.repeat(60));
console.log('TEST DATA (from documentation example)');
console.log('='.repeat(60));
const testHash = generateHash(
  testData.orderNumber,
  testData.amount,
  testData.currency,
  testData.description,
  testData.password
);
console.log('Final Hash:', testHash);
console.log('');

console.log('='.repeat(60));
console.log('REAL DATA (your actual configuration)');
console.log('='.repeat(60));
const realHash = generateHash(
  realData.orderNumber,
  realData.amount,
  realData.currency,
  realData.description,
  realData.password
);
console.log('Final Hash:', realHash);
console.log('');

console.log('='.repeat(60));
console.log('VERIFICATION');
console.log('='.repeat(60));
console.log('If X1PAG returns "Hash is not valid" error,');
console.log('check if the hash generated matches what you are sending.');
console.log('');
console.log('Common issues:');
console.log('1. Password is incorrect');
console.log('2. Field order is wrong (must be: number + amount + currency + description + password)');
console.log('3. Amount format is wrong (must be string with correct decimals)');
console.log('4. Currency is not uppercase');
console.log('5. Extra spaces or special characters in any field');
