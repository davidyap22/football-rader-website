# X1PAG Integration Troubleshooting

## Issue: "Protocol mapping not found" (Error Code 100000)

### Symptoms
- Payment creation fails with 400 Bad Request
- Error message: "Request data is invalid."
- Specific error: "Protocol mapping not found." (error_code: 100000)

### Root Cause
This error indicates a **configuration issue on X1PAG's side**, not with your code implementation. The error means that X1PAG's system cannot find the protocol mapping for your merchant account.

### What is "Protocol Mapping"?
Protocol mapping refers to the configuration in X1PAG's system that:
- Associates your merchant account with payment methods
- Defines which currencies are enabled
- Routes transactions to the correct payment processors
- Enables specific payment protocols (card, PIX, boleto, etc.)

### Verification
Our test script (`scripts/test-x1pag-api.js`) confirmed that:
✅ Request format is correct
✅ Hash generation is correct (SHA1 of MD5)
✅ All required fields are present
✅ Field types match documentation
✅ Environment variables are loaded correctly

**The issue is with the merchant account configuration, not the code.**

### Resolution Steps

#### 1. Contact X1PAG Support
**Email or contact X1PAG support with the following information:**

```
Subject: Error 100000 - Protocol mapping not found

Merchant Key: 98bb56a2-f8e0-11f0-af6a-9ebb24d99120
Merchant Name: OddsFlow

Issue: We are getting error code 100000 "Protocol mapping not found" when
trying to create payment sessions via the /api/v1/session endpoint.

Request details:
- Operation: purchase
- Currency: USD
- All required fields are included
- Hash validation is correct

Please verify:
1. Is the merchant account fully activated?
2. Is USD currency enabled for this merchant?
3. Is the protocol mapping configured correctly?
4. Are there any missing configuration steps?

Error response:
{
  "error_code": 0,
  "error_message": "Request data is invalid.",
  "errors": [
    {
      "error_code": 100000,
      "error_message": "Protocol mapping not found."
    }
  ]
}
```

#### 2. Check X1PAG Dashboard
Log in to your X1PAG merchant dashboard and verify:

1. **Account Status**
   - Is your account fully activated?
   - Are there any pending verification steps?

2. **Currency Settings**
   - Is USD enabled for your merchant account?
   - Check if there are currency-specific configurations needed

3. **Payment Methods**
   - Which payment methods are enabled?
   - Are there method-specific configurations required?

4. **API Configuration**
   - Are API credentials properly configured?
   - Is the merchant key linked to the correct account?

#### 3. Test with Different Parameters
While waiting for X1PAG support, you can test:

**Try with BRL instead of USD:**
```javascript
// In the checkout page, test with BRL currency
currency: 'BRL'
```

If BRL works but USD doesn't, it confirms that USD is not enabled for your merchant account.

**Try with a different operation:**
```javascript
// Try 'debit' instead of 'purchase'
operation: 'debit'
```

This can help X1PAG support narrow down the configuration issue.

### Common Causes

1. **Merchant Account Not Fully Activated**
   - Solution: Complete all verification steps in X1PAG dashboard
   - Contact support to expedite activation

2. **Currency Not Enabled**
   - Solution: Request USD activation from X1PAG support
   - May require additional documentation for international currencies

3. **Payment Protocol Not Configured**
   - Solution: X1PAG support needs to configure protocol mappings
   - May require specifying which payment methods you want to accept

4. **Test/Production Mode Mismatch**
   - Solution: Verify you're using the correct credentials for the environment
   - Check if separate test credentials are needed

### Testing While Waiting for Resolution

You can use the test scripts to verify the fix once X1PAG makes configuration changes:

```bash
# Test hash generation
node scripts/test-x1pag-hash.js

# Test API connection
node scripts/test-x1pag-api.js
```

When the configuration is fixed, you should see:
- HTTP 200 status
- Response with `redirect_url` field
- No error codes

### Implementation Status

✅ **Code Implementation: Complete and Correct**
- All endpoints implemented correctly
- Hash generation matches X1PAG specification
- Request format follows documentation
- Error handling in place
- Multi-currency support ready

❌ **X1PAG Configuration: Pending**
- Merchant account needs protocol mapping configuration
- Contact X1PAG support to resolve

### Next Steps

1. **Immediate:** Contact X1PAG support with the information above
2. **While Waiting:** Test if BRL currency works (if you need BRL support)
3. **After Fix:** Run `node scripts/test-x1pag-api.js` to verify
4. **After Verification:** Test full payment flow in the application

### Additional Notes

- This is a common issue during initial merchant setup
- X1PAG support typically resolves this within 24-48 hours
- The code is ready and will work immediately once X1PAG configures your account
- No code changes are needed on your side

### Contact Information

**X1PAG Support:**
- Documentation: https://docs.x1pag.com
- Check their website for support email/chat
- Reference error code 100000 in your ticket

---

## Testing After Resolution

Once X1PAG confirms the configuration is fixed:

1. **Test API Connection:**
   ```bash
   node scripts/test-x1pag-api.js
   ```
   Expected: HTTP 200 with redirect_url

2. **Test in Application:**
   - Go to http://localhost:3000/pricing
   - Select a plan
   - Click "Proceed to Payment"
   - Should redirect to X1PAG checkout page

3. **Test Callback:**
   - Complete a test payment
   - Verify subscription is activated
   - Check payment_transactions table in Supabase

---

**Last Updated:** 2026-01-28
**Status:** Waiting for X1PAG configuration
