# PartyKit Integration Plan for Quarto Multiplayer

**Feature**: 002-quarto-game
**Date**: 2025-12-07

## Overview

This plan details how to integrate PartyKit into the Quarto game for online multiplayer support. PartyKit provides real-time WebSocket infrastructure that runs separately from the Vercel deployment.

### Key Decisions
- **Server Location**: Separate `/party` directory at project root
- **Deployment**: PartyKit Individual tier (free, hosted on partykit.dev)
- **Type Sharing**: Duplicate types in both locations (simpler, no build complexity)

---

## 1. Project Structure

### New Files to Create

```
portfolio-2025/
├── party/                              # PartyKit server (separate deployment)
│   ├── package.json
│   ├── tsconfig.json
│   ├── partykit.json
│   └── src/
│       ├── quarto.ts                   # Main Party class
│       ├── types.ts                    # Message types (duplicated)
│       └── game-logic.ts               # Server-side game logic
│
├── app/features/quarto/
│   └── online/                         # New: multiplayer client code
│       ├── usePartySocket.ts           # PartyKit connection hook
│       ├── useOnlineGame.ts            # Online game orchestration
│       ├── types.ts                    # WebSocket message types
│       └── index.ts
│
├── app/features/quarto/components/
│   └── ConnectionStatus.tsx            # New: connection indicator
│
├── app/routes/games/quarto/
│   └── online.tsx                      # New: lobby/waiting room page
```

### Files to Modify

| File | Changes |
|------|---------|
| `app/routes/games/quarto/index.tsx` | Enable online button, add room create/join UI |
| `app/routes/games/quarto/play.tsx` | Support online mode with turn indicators |
| `package.json` (root) | Add `partysocket` dependency and dev scripts |

---

## 2. PartyKit Server Implementation

### 2.1 Configuration Files

**`party/partykit.json`**:
```json
{
  "name": "quarto-multiplayer",
  "main": "src/quarto.ts",
  "compatibilityDate": "2024-01-01"
}
```

**`party/package.json`**:
```json
{
  "name": "quarto-party",
  "private": true,
  "scripts": {
    "dev": "partykit dev --port 1999",
    "deploy": "partykit deploy"
  },
  "dependencies": {
    "partykit": "^0.0.108"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

### 2.2 Message Types

**`party/src/types.ts`**:

```typescript
// Game types (duplicated from app/features/quarto/types)
export interface Game {
  id: string;
  mode: 'local' | 'ai' | 'online';
  status: 'waiting' | 'playing' | 'finished';
  players: [Player, Player];
  board: { positions: (number | null)[] };
  availablePieces: number[];
  currentTurn: 0 | 1;
  phase: 'selecting' | 'placing';
  selectedPiece: number | null;
  winner: 0 | 1 | 'draw' | null;
  winningLine: number[] | null;
  history: GameMove[];
  createdAt: number;
  updatedAt: number;
}

export interface Player {
  id: string;
  type: 'human-local' | 'human-remote' | 'ai';
  name: string;
}

export interface GameMove {
  type: 'select' | 'place' | 'quarto';
  player: 0 | 1;
  pieceId?: number;
  position?: number;
  timestamp: number;
}

// Client -> Server
export type ClientMessage =
  | { type: 'CREATE_ROOM'; playerName: string }
  | { type: 'JOIN_ROOM'; playerName: string }
  | { type: 'SELECT_PIECE'; pieceId: number }
  | { type: 'PLACE_PIECE'; position: number }
  | { type: 'CALL_QUARTO' }
  | { type: 'LEAVE_ROOM' }
  | { type: 'RECONNECT'; playerId: string };

// Server -> Client
export type ServerMessage =
  | { type: 'ROOM_CREATED'; roomId: string; playerId: string }
  | { type: 'ROOM_JOINED'; playerId: string; game: Game }
  | { type: 'PLAYER_JOINED'; playerName: string; game: Game }
  | { type: 'STATE_UPDATE'; game: Game }
  | { type: 'PLAYER_LEFT'; reason: 'disconnect' | 'forfeit' | 'timeout' }
  | { type: 'ERROR'; code: string; message: string }
  | { type: 'GAME_OVER'; winner: 0 | 1 | 'draw'; game: Game };
```

### 2.3 Game Logic

**`party/src/game-logic.ts`**:

Copy pure functions from existing codebase:
- From `app/features/quarto/utils/winDetection.ts`: `findWinningLine()`, `isBoardFull()`, `checkLine()`, `WINNING_LINES`
- Create server-specific: `createGame()`, `selectPiece()`, `placePiece()`, `checkQuarto()`

Key functions:
```typescript
export function createGame(hostPlayerId: string, hostName: string): Game;
export function selectPiece(game: Game, pieceId: number): Game;
export function placePiece(game: Game, position: number): Game;
export function checkQuarto(game: Game, callerId: string): { valid: boolean; game: Game };
```

### 2.4 Main Party Class

**`party/src/quarto.ts`**:

```typescript
import type * as Party from "partykit/server";

export default class QuartoParty implements Party.Server {
  state: RoomState | null = null;

  onConnect(conn: Party.Connection) { /* track connection */ }

  onMessage(message: string, sender: Party.Connection) {
    // Handle: CREATE_ROOM, JOIN_ROOM, SELECT_PIECE, PLACE_PIECE, CALL_QUARTO, LEAVE_ROOM, RECONNECT
  }

  onClose(conn: Party.Connection) {
    // Handle disconnect, start 2-min reconnection timer
  }
}
```

Room state structure:
```typescript
interface RoomState {
  game: Game;
  hostPlayerId: string;
  guestPlayerId: string | null;
  connections: Map<string, { connectionId: string; playerId: string }>;
  disconnectedPlayers: Map<string, { playerId: string; disconnectTime: number }>;
}
```

---

## 3. Client Integration

### 3.1 PartySocket Hook

**`app/features/quarto/online/usePartySocket.ts`**:

```typescript
import PartySocket from 'partysocket';

export function usePartySocket({ roomId, onMessage, onConnect, onDisconnect }) {
  // Connect to PartyKit server
  // Return: { send, isConnected, socket }
}
```

Environment variable: `VITE_PARTYKIT_HOST` (defaults to `localhost:1999` for dev)

### 3.2 Online Game Hook

**`app/features/quarto/online/useOnlineGame.ts`**:

Orchestrates:
- Connection lifecycle (create/join room)
- Message handling → Redux dispatch (`setOnlineGame`, `setConnectionStatus`, `handlePlayerLeft`)
- Game actions → PartyKit messages (`SELECT_PIECE`, `PLACE_PIECE`, `CALL_QUARTO`)
- Turn detection (`isMyTurn` based on `localPlayerId`)
- Session storage for reconnection

Returns same shape as `useQuartoGame` plus online-specific state:
```typescript
{
  game, phase, isConnected, isMyTurn, localPlayerId, roomId, waitingForOpponent,
  canCallQuarto, isGameOver, opponent,
  selectPiece, placePiece, callQuarto, leaveRoom
}
```

---

## 4. UI Changes

### 4.1 Menu Page (`index.tsx`)

**Enable online button** (currently disabled at lines 71-78):
```tsx
<button onClick={() => setSelectedMode('online')} className="...">
  Online Multiplayer
</button>
```

**Add online setup form**:
- Player name input
- "Create New Room" button → generates room code, navigates to `/games/quarto/online?action=create&roomId=ABC123`
- Room code input + "Join" button → navigates to `/games/quarto/online?action=join&roomId=...`

Room code format: 6 uppercase alphanumeric characters (e.g., `A3B7KP`)

### 4.2 Online Lobby Page (`online.tsx`)

New route: `/games/quarto/online`

Displays:
- Connection status indicator
- Room code (large, copyable) for host
- "Waiting for opponent..." animation
- "Opponent joined!" message when guest connects
- Auto-navigate to `/games/quarto/play?online=true&roomId=...` when game starts
- Leave button

### 4.3 Play Page Modifications (`play.tsx`)

Add route search params: `online?: boolean, roomId?: string`

Conditional logic:
- If `online=true`: use `useOnlineGame` hook instead of `useQuartoGame`
- Add turn indicator: "Your Turn" (green) / "Opponent's Turn" (gray)
- Add `ConnectionStatus` component
- Disable piece/board interaction when not player's turn

### 4.4 ConnectionStatus Component

Small indicator showing: Connected (green) / Connecting (yellow pulse) / Disconnected (red)

---

## 5. Redux Integration

**No changes needed to `quartoSlice.ts`** - existing actions work:

| Action | Usage |
|--------|-------|
| `setOnlineGame(game)` | Receives full game state from `STATE_UPDATE` |
| `setConnectionStatus(status)` | Tracks WebSocket connection |
| `handlePlayerLeft({ reason })` | Handles opponent disconnect/forfeit/timeout |
| `setError(message)` | Displays error messages |
| `resetGame()` | Cleans up on leave |

---

## 6. Deployment

### 6.1 PartyKit Deployment

```bash
cd party
npm install
npx partykit deploy
```

Creates URL: `quarto-multiplayer.<username>.partykit.dev`

### 6.2 Environment Configuration

**Vercel project settings**:
```
VITE_PARTYKIT_HOST=quarto-multiplayer.<username>.partykit.dev
```

**Local `.env.local`**:
```
VITE_PARTYKIT_HOST=localhost:1999
```

### 6.3 Root Package.json Scripts

```json
{
  "scripts": {
    "party:dev": "cd party && npx partykit dev --port 1999",
    "party:deploy": "cd party && npx partykit deploy",
    "dev:full": "concurrently \"npm run dev\" \"npm run party:dev\""
  },
  "dependencies": {
    "partysocket": "^1.0.1"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

---

## 7. Testing Strategy

### Local Development

```bash
# Terminal 1: Vite + PartyKit
npm run dev:full

# Or separately:
npm run dev          # Terminal 1
npm run party:dev    # Terminal 2
```

Open two browser tabs to test create/join flow.

### Unit Tests

- `party/src/__tests__/game-logic.test.ts` - Test `selectPiece`, `placePiece`, `checkQuarto`
- `app/features/quarto/online/__tests__/` - Test hooks with mocked PartySocket

### E2E Tests (Playwright)

Test flow:
1. Player 1 creates room, gets room code
2. Player 2 joins with room code
3. Both see game board
4. Complete a game with alternating moves

---

## 8. Implementation Phases

### Phase 1: PartyKit Server
1. Create `/party` directory structure
2. Implement types and game logic
3. Implement QuartoParty class
4. Test locally with `npx partykit dev`

### Phase 2: Client Hooks
1. Add `partysocket` dependency
2. Create `/app/features/quarto/online/` directory
3. Implement `usePartySocket` and `useOnlineGame` hooks
4. Add message types

### Phase 3: UI Updates
1. Enable online button in menu
2. Add room create/join form
3. Create `/games/quarto/online` lobby route
4. Modify play page for online mode
5. Add ConnectionStatus component

### Phase 4: Polish & Deploy
1. Test full flow locally
2. Handle edge cases (reconnection, errors)
3. Deploy PartyKit to partykit.dev
4. Configure Vercel env vars
5. E2E testing

---

## 9. Critical Files Reference

| File | Purpose |
|------|---------|
| `app/features/quarto/store/quartoSlice.ts` | Has `setOnlineGame`, `setConnectionStatus` ready |
| `app/features/quarto/types/quarto.types.ts` | Source for types to duplicate to PartyKit |
| `app/features/quarto/utils/winDetection.ts` | Game logic to copy to PartyKit server |
| `app/routes/games/quarto/index.tsx` | Menu page - enable online button (lines 71-78) |
| `app/features/quarto/hooks/useQuartoGame.ts` | Pattern to follow for `useOnlineGame` |
| `specs/002-quarto-game/contracts/api.md` | Existing WebSocket protocol spec (reference) |

---

## 10. Notes

- **PartyKit Individual tier limits**: 10 projects, storage clears every 24h (fine for game state since games are ephemeral)
- **Room expiration**: 30 minutes of inactivity (matching existing spec)
- **Reconnection window**: 2 minutes after disconnect
- **No REST API needed**: PartyKit handles room creation via WebSocket messages directly
