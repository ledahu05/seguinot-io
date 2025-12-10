# Quarto Multiplayer Deployment Guide

**Production URL**: https://seguinot-io.vercel.app/games/quarto/play

This guide covers deploying the Quarto online multiplayer mode, which requires two separate services:
1. **Frontend**: TanStack Start app deployed on Vercel
2. **Backend**: PartyKit WebSocket server deployed on PartyKit cloud

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│   Browser                                   │
│   https://seguinot-io.vercel.app            │
│   - React + TanStack Start                  │
│   - PartySocket client                      │
└──────────────────┬──────────────────────────┘
                   │ WebSocket (wss://)
                   ▼
┌─────────────────────────────────────────────┐
│   PartyKit Cloud                            │
│   quarto-multiplayer.<username>.partykit.dev│
│   - Real-time game state                    │
│   - Room management                         │
│   - Player connections                      │
└─────────────────────────────────────────────┘
```

---

## Prerequisites

- Node.js 20+
- npm
- GitHub account (used for PartyKit authentication)
- Vercel account (free tier available)
- Git repository access

---

## Step 1: Deploy PartyKit Server

> **Note**: PartyKit uses GitHub for authentication. On your first deploy, you'll be prompted to authenticate via GitHub in your browser - no separate account creation or login command needed.

### 1.1 Install Dependencies

```bash
cd party
npm install
```

### 1.2 Test Locally First (Optional but Recommended)

```bash
# In one terminal - start PartyKit server
npm run dev
# Server runs at localhost:1999

# In another terminal - start the frontend
cd ..
npm run dev
# Frontend runs at localhost:3000
```

Test the multiplayer flow:
1. Open http://localhost:3000/games/quarto in two browser tabs
2. Create a room in tab 1, copy the room code
3. Join with the room code in tab 2
4. Verify both players can see each other

### 1.3 Deploy to PartyKit Cloud

```bash
cd party
npm run deploy
# Or directly: npx partykit deploy
```

**First-time deploy**: A browser window will open for GitHub authentication. Authorize PartyKit to continue.

**Expected output** (after authentication):
```
Deploying quarto-multiplayer...
✓ Deployed to quarto-multiplayer.<your-github-username>.partykit.dev
```

**Note your deployment URL** - you'll need it for Vercel configuration.

Format: `quarto-multiplayer.<your-github-username>.partykit.dev`

### 1.4 Verify Deployment

Visit https://quarto-multiplayer.<your-username>.partykit.dev in your browser.
You should see a basic PartyKit status page (not an error).

---

## Step 2: Configure Vercel Environment Variables

### 2.1 Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project (seguinot-io or equivalent)
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_PARTYKIT_HOST` | `quarto-multiplayer.<your-username>.partykit.dev` | Production, Preview, Development |

**Important**: Do NOT include `https://` or `wss://` - just the hostname.

### 2.2 Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Add environment variable
vercel env add VITE_PARTYKIT_HOST

# When prompted:
# - Value: quarto-multiplayer.<your-username>.partykit.dev
# - Environments: Production, Preview, Development (select all)
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 If Using Vercel Git Integration (Recommended)

Simply push to your main branch:

```bash
git add .
git commit -m "Configure PartyKit production host"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build the project
3. Use the environment variables you configured
4. Deploy to https://seguinot-io.vercel.app

### 3.2 If Using Vercel CLI

```bash
# From project root
vercel --prod
```

---

## Step 4: Verify Production Deployment

### 4.1 Test the Full Flow

1. Open https://seguinot-io.vercel.app/games/quarto
2. Select "Online Multiplayer" mode
3. Enter your name and create a room
4. Copy the room code (6 characters)
5. Open the same URL in an incognito window or different device
6. Enter a name and join with the room code
7. Verify:
   - Both players see the game board
   - Turn indicators work correctly
   - Moves sync between players

### 4.2 Check Browser Console

Open Developer Tools (F12) and check the Console tab. Look for:
- WebSocket connection: `Connected to wss://quarto-multiplayer.<username>.partykit.dev`
- No CORS errors
- No connection timeouts

### 4.3 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "WebSocket connection failed" | Wrong VITE_PARTYKIT_HOST | Check env variable doesn't include https:// |
| "Connection refused" | PartyKit not deployed | Run `npm run deploy` in party/ directory |
| "CORS error" | Old cached build | Clear Vercel cache and redeploy |
| "Room not found" | Room expired | Rooms expire after 30 min inactivity |

---

## Environment Configuration Reference

### Local Development (.env or .env.local)

```env
VITE_PARTYKIT_HOST=localhost:1999
```

### Production (Vercel Environment Variables)

```env
VITE_PARTYKIT_HOST=quarto-multiplayer.<your-username>.partykit.dev
```

### File Locations

| File | Purpose |
|------|---------|
| `.env.example` | Template for local development |
| `.env.local` | Local overrides (git-ignored) |
| Vercel Dashboard | Production environment variables |

---

## Updating the Deployment

### Updating PartyKit Server

When you make changes to the party server code:

```bash
cd party
npm run deploy
```

PartyKit deployments are instant - no rebuild needed on Vercel.

### Updating Frontend

Push changes to trigger Vercel rebuild:

```bash
git add .
git commit -m "Update multiplayer feature"
git push
```

---

## Monitoring & Debugging

### PartyKit Dashboard

1. Go to https://partykit.io/dashboard
2. View:
   - Active connections
   - Room count
   - Error logs

### Vercel Logs

1. Go to https://vercel.com/dashboard → Your project → Deployments
2. Click on a deployment → View Logs
3. Check for build errors or runtime issues

### Client-Side Debugging

Add this to browser console to monitor WebSocket:

```javascript
// Monitor all WebSocket messages
localStorage.debug = 'partysocket:*';
```

---

## PartyKit Tier Limits (Individual/Free)

| Limit | Value |
|-------|-------|
| Projects | 10 |
| Concurrent connections | 100 per room |
| Room state persistence | 24 hours |
| Bandwidth | Generous (suitable for games) |

For higher limits, consider PartyKit Pro tier.

---

## Quick Reference Commands

```bash
# Local development (both services)
npm run dev:all

# Deploy PartyKit only
cd party && npm run deploy

# Deploy Vercel (via CLI)
vercel --prod

# View live PartyKit logs
cd party && npx partykit tail
```

---

## Troubleshooting

### "Module not found" on PartyKit deploy

```bash
cd party
rm -rf node_modules
npm install
npm run deploy
```

### Environment variable not working

1. Verify in Vercel Dashboard that variable is set for Production
2. Trigger a new deployment (even empty commit works):
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

### WebSocket blocked by firewall/proxy

PartyKit uses standard HTTPS/WSS ports (443). If blocked:
- Try from a different network
- Check corporate firewall rules
- Use mobile data as a test

### Players can't see each other's moves

1. Check both are in the same room (same 6-char code)
2. Check connection status indicator in game UI
3. One player might be disconnected - refresh the page

---

## Support Resources

- PartyKit Documentation: https://docs.partykit.io
- PartyKit Discord: https://discord.gg/partykit
- Vercel Documentation: https://vercel.com/docs
