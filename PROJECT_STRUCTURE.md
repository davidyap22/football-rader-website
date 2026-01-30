# OddsFlow Project Structure

## 📁 Directory Organization

```
odds_flow/
├── docs/              # Documentation and guides
├── database/          # SQL scripts and database setup
├── scripts/           # Utility scripts and tests
├── src/               # Source code
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   └── lib/           # Utility libraries
├── public/            # Static assets
└── node_modules/      # Dependencies
```

---

## 📚 docs/

Documentation, guides, and development logs.

**Contents:**
- SEO guides (SEO_SETUP_GUIDE.md, SEO_SSR_FIX_SUMMARY.md, VERIFICATION_HUB_IMPLEMENTATION.md)
- X1PAG payment integration docs (X1PAG_*.md)
- Feature documentation (NEWS_COMMENTS_FIX.md, PAYMENT_SETUP_TROUBLESHOOTING.md)
- Development logs (CHAT_HISTORY, CONVERSATION_LOG)

See [docs/README.md](docs/README.md) for detailed index.

---

## 🗄️ database/

SQL scripts for Supabase database setup and maintenance.

**Contents:**
- Payment system tables (`create_payment_tables.sql`)
- News system (`supabase_news_comments.sql`, `update_news_comments_table.sql`)
- User management (`supabase_user_subscriptions.sql`, `supabase_user_predictions.sql`)
- Performance tracking (`supabase_performance_functions.sql`)

See [database/README.md](database/README.md) for usage instructions.

---

## 🔧 scripts/

Utility scripts and test tools.

**Contents:**
- X1PAG payment testing (`test-x1pag-api.js`, `test-x1pag-hash.js`)

**Usage:**
```bash
# Test X1PAG hash generation
node scripts/test-x1pag-hash.js

# Test X1PAG API connection
node scripts/test-x1pag-api.js
```

See [scripts/README.md](scripts/README.md) for more details.

---

## 📄 Root Directory Files

**Project Documentation:**
- `README.md` - Project overview and quick start
- `CLAUDE.md` - Instructions for Claude Code (AI assistant)
- `PROJECT_STRUCTURE.md` - This file

**Configuration:**
- `package.json` - Node.js dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

**Environment:**
- `.env.local` - Local environment variables (not in git)
- `.env.x1pag.example` - X1PAG environment template
- `.gitignore` - Git ignore rules

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📖 Documentation Index

| Topic | Location | Description |
|-------|----------|-------------|
| Project Setup | `README.md` | Quick start guide |
| SEO Configuration | `docs/SEO_SETUP_GUIDE.md` | Complete SEO setup |
| SSR Fix | `docs/SEO_SSR_FIX_SUMMARY.md` | Server-side rendering fix |
| Verification Hub | `docs/VERIFICATION_HUB_IMPLEMENTATION.md` | Official data verification |
| Payment Integration | `docs/X1PAG_INTEGRATION_GUIDE.md` | X1PAG payment setup |
| Payment Troubleshooting | `docs/X1PAG_TROUBLESHOOTING.md` | Common payment issues |
| Database Setup | `database/README.md` | SQL scripts usage |
| Testing Scripts | `scripts/README.md` | Test utilities |

---

**Last Updated:** 2026-01-30
