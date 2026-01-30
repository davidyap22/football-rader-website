# Scripts

This folder contains utility scripts and tests.

## Contents

### X1PAG Payment Testing
- `test-x1pag-api.js` - Test X1PAG API connectivity and session creation
- `test-x1pag-hash.js` - Test X1PAG hash generation algorithm

---

**Usage:**
```bash
# Test X1PAG hash generation
node scripts/test-x1pag-hash.js

# Test X1PAG API connection
node scripts/test-x1pag-api.js
```

**Note:** Make sure `.env.local` is configured with X1PAG credentials before running tests.
