# Quickstart: Room Share Link

**Feature**: 007-room-share-link
**Date**: 2025-12-12

## Overview

This feature enables Quarto multiplayer room creators to share a direct join link instead of verbally exchanging room codes. When a guest clicks the shared link, they're taken to a join page where they enter their name and automatically join the room.

## Prerequisites

- Existing codebase with TanStack Router file-based routing
- Quarto online multiplayer feature already implemented
- Node.js 20+, pnpm

## Quick Implementation Guide

### Step 1: Create Share Link Utility

**File**: `app/features/quarto/utils/shareLink.ts`

```typescript
export function generateShareLink(roomCode: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/games/quarto/join?room=${roomCode}`;
}
```

### Step 2: Create useShare Hook

**File**: `app/lib/hooks/useShare.ts`

```typescript
export function useShare() {
  const canNativeShare = typeof navigator !== 'undefined'
    && 'share' in navigator;

  const share = async (url: string, title?: string) => {
    try {
      if (canNativeShare && navigator.canShare?.({ url })) {
        await navigator.share({ url, title });
        return { status: 'shared' as const };
      }
      await navigator.clipboard.writeText(url);
      return { status: 'copied' as const };
    } catch {
      return { status: 'error' as const, message: 'Failed to share' };
    }
  };

  return { share, canNativeShare };
}
```

### Step 3: Create ShareRoomButton Component

**File**: `app/features/quarto/components/ShareRoomButton.tsx`

```typescript
import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { useShare } from '@/lib/hooks/useShare';
import { generateShareLink } from '../utils/shareLink';

interface Props {
  roomCode: string;
  className?: string;
}

export function ShareRoomButton({ roomCode, className = '' }: Props) {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');
  const { share, canNativeShare } = useShare();
  const shareLink = generateShareLink(roomCode);

  const handleShare = async () => {
    const result = await share(shareLink, 'Join my Quarto game!');
    if (result.status === 'copied') {
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share invite link"
      className={`flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-400 ${className}`}
    >
      {status === 'copied' ? (
        <>
          <Check className="h-5 w-5" />
          Link Copied!
        </>
      ) : (
        <>
          {canNativeShare ? <Share2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          {canNativeShare ? 'Share Link' : 'Copy Link'}
        </>
      )}
    </button>
  );
}
```

### Step 4: Create Join Route

**File**: `app/routes/games/quarto/join.tsx`

```typescript
import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  room: z.string().length(6).regex(/^[A-Z0-9]+$/),
});

export const Route = createFileRoute('/games/quarto/join')({
  validateSearch: searchSchema,
  component: JoinRoomPage,
});

function JoinRoomPage() {
  const { room } = Route.useSearch();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('Guest');

  const handleJoin = () => {
    if (!playerName.trim()) return;
    navigate({
      to: '/games/quarto/online',
      search: { room, host: false, name: playerName.trim() },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-white">Join Quarto Game</h1>

        <div className="rounded-lg bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Room Code</p>
          <p className="font-mono text-2xl text-emerald-400">{room}</p>
        </div>

        <div>
          <label className="block text-sm text-slate-400">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white"
            maxLength={20}
          />
        </div>

        <button
          onClick={handleJoin}
          disabled={!playerName.trim()}
          className="w-full rounded-lg bg-emerald-500 py-3 font-bold text-white hover:bg-emerald-400 disabled:opacity-50"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}
```

### Step 5: Add ShareRoomButton to Waiting Screen

**File**: `app/routes/games/quarto/online.tsx`

Add import and update the waiting screen section:

```typescript
import { ShareRoomButton } from '@/features/quarto/components';

// In the "Waiting for opponent" section (~line 177):
<div className="mb-8 rounded-lg bg-slate-800 p-6">
  <p className="mb-2 text-sm text-slate-400">Share this room code:</p>
  <p className="font-mono text-4xl tracking-widest text-emerald-400">{room}</p>
  <ShareRoomButton roomCode={room} className="mt-4 w-full justify-center" />
</div>
```

## Testing Checklist

- [ ] Create room → Share button appears on waiting screen
- [ ] Click share on mobile → Native share sheet opens
- [ ] Click share on desktop → "Link Copied!" feedback shown
- [ ] Open share link in new browser → Join page with room code displayed
- [ ] Enter name and join → Successfully connects to room
- [ ] Invalid room code in URL → Handled gracefully

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `app/features/quarto/utils/shareLink.ts` | CREATE | URL generation |
| `app/lib/hooks/useShare.ts` | CREATE | Share/clipboard abstraction |
| `app/features/quarto/components/ShareRoomButton.tsx` | CREATE | Share UI component |
| `app/routes/games/quarto/join.tsx` | CREATE | Join landing page |
| `app/routes/games/quarto/online.tsx` | MODIFY | Add share button |
| `app/features/quarto/components/index.ts` | MODIFY | Export ShareRoomButton |
