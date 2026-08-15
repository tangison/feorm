# Feorm

Forms and workflow product serving feorm.tangison.com.

**Live:** [feorm.tangison.com](https://feorm.tangison.com)  
**Status:** Production site  
**Visibility:** Public

## What this is

Feorm product site and application with magic-link authentication, user roles and onboarding flows.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Radix UI primitives
- lucide-react icons

## Getting started

```bash
git clone https://github.com/tangison/feorm.git
cd feorm
npm install
npm run dev
```

The dev server runs on http://localhost:3000.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run postinstall` | See `package.json`. |

## Routes

14 page routes.

```
/
/admin
/booking/success
/dashboard
/journeys
/landing
/listing/[id]
/listing/[id]/book
/listing/new
/marketplace
/profile
/settings
/support
/verification
```

## Environment

Create `.env.local` for local secrets. Never commit it.

> **Security note.** This repository currently has `.env.local` committed to the default branch. It must be removed from the working tree and from git history, and any live value it contains must be rotated first. See `SECURITY.md` in the audit workspace for the full finding and the remediation order.

## Deployment

Deployed on Vercel. Production domains:

- `feorm.tangison.com`

## Maintainer

Built and maintained by **Tangison Technologies**, Windhoek, Namibia.

| | |
|---|---|
| Main line | [+264 83 411 522](tel:+264813411522) (`083411522`) |
| Email | contact@tangison.com |
| Web | https://tangison.com |

## Licence

Proprietary. Copyright Tangison Technologies. All rights reserved.
