# Vercel CLI Guide

Quick reference for deploying and managing the portfolio site using Vercel CLI.

---

## Installation

```bash
npm i -g vercel
# or
yarn global add vercel
```

---

## Authentication

```bash
# Interactive login (opens browser)
vercel login

# Check who you're logged in as
vercel whoami

# Logout
vercel logout
```

For CI/CD environments, create a token at https://vercel.com/account/tokens and use:
```bash
vercel --token <your-token>
```

---

## First-Time Setup (Link Project)

```bash
cd /home/chris/workspace/portfolio-2025
vercel link
```

This connects your local directory to an existing Vercel project. It will:
1. Ask you to select your Vercel account/team
2. Ask which project to link to (or create new)
3. Create a `.vercel` directory with project settings

---

## Deploy Commands

```bash
# Preview deployment (default)
vercel

# Production deployment
vercel --prod

# Deploy and skip domain assignment (staged production)
vercel --prod --skip-domain

# Promote a staged deployment to production
vercel promote <deployment-url>
```

---

## Environment Variables

```bash
# Pull env vars from Vercel to local .env file
vercel env pull

# Pull to a specific file
vercel env pull .env.local

# Add a new env variable
vercel env add VITE_PARTYKIT_HOST

# List env variables
vercel env ls

# Remove an env variable
vercel env rm VITE_PARTYKIT_HOST
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `vercel` | Deploy preview |
| `vercel --prod` | Deploy to production |
| `vercel logs <url>` | View deployment logs |
| `vercel inspect <url>` | Inspect a deployment |
| `vercel list` | List recent deployments |
| `vercel rollback` | Rollback to previous deployment |
| `vercel dev` | Run local dev server (mimics Vercel) |
| `vercel project ls` | List your projects |
| `vercel open` | Open project dashboard in browser |
| `vercel whoami` | Show current logged-in user |

---

## Typical Workflow

```bash
# 1. Install CLI (one time)
npm i -g vercel

# 2. Login (one time)
vercel login

# 3. Link your project (one time)
cd /home/chris/workspace/portfolio-2025
vercel link
# Select your account, then "seguinot-io" project

# 4. Pull existing env vars (optional, for local dev)
vercel env pull .env.local

# 5. Add PartyKit host env var (for multiplayer)
vercel env add VITE_PARTYKIT_HOST
# Enter: quarto-multiplayer.<your-github-username>.partykit.dev
# Select: Production, Preview, Development

# 6. Deploy to production
vercel --prod
```

---

## Checking Deployment Status

```bash
# List recent deployments
vercel list

# View logs for a specific deployment
vercel logs https://seguinot-io-abc123.vercel.app

# Open project dashboard in browser
vercel open
```

---

## Resources

- [Vercel CLI Overview](https://vercel.com/docs/cli)
- [Deploying from CLI](https://vercel.com/docs/cli/deploying-from-cli)
- [vercel deploy command](https://vercel.com/docs/cli/deploy)
