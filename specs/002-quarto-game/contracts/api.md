# API Contracts: Quarto Board Game

**Feature**: 002-quarto-game
**Date**: 2025-12-07 (Updated for PartyKit)

## Overview

The Quarto game uses **PartyKit** for all multiplayer functionality. Unlike traditional REST+WebSocket architectures, PartyKit handles room creation, joining, and game state entirely through WebSocket messages.

**Architecture**:
- Client connects directly to PartyKit server at `<PARTYKIT_HOST>/party/<roomId>`
- Room creation happens by connecting to a new room ID
- No separate REST API needed

**Environment Variable**:
- `VITE_PARTYKIT_HOST` - PartyKit server host (e.g., `localhost:1999` or `quarto-multiplayer.<user>.partykit.dev`)

---

## PartyKit Connection

### Connection URL

```
wss://<PARTYKIT_HOST>/party/<roomId>
```

**Parameters**:
- `roomId`: 6-character alphanumeric room code (e.g., `A3B7KP`)

### Connection Flow

**Creating a Room (Host)**:
1. Generate a random 6-character room code client-side
2. Connect to `wss://<host>/party/<roomId>`
3. Send `CREATE_ROOM` message with player name
4. Receive `ROOM_CREATED` with assigned `playerId`
5. Share room code with opponent

**Joining a Room (Guest)**:
1. Connect to `wss://<host>/party/<roomId>` (code from host)
2. Send `JOIN_ROOM` message with player name
3. Receive `ROOM_JOINED` with `playerId` and initial game state
4. Host receives `PLAYER_JOINED` notification
5. Both receive `STATE_UPDATE` to begin game

---

## Message Types

All messages are JSON with a `type` field.

### Client → Server

**CREATE_ROOM**: Host creates a new game room
```json
{
  "type": "CREATE_ROOM",
  "playerName": "string (1-20 chars)"
}
```

**JOIN_ROOM**: Guest joins existing room
```json
{
  "type": "JOIN_ROOM",
  "playerName": "string (1-20 chars)"
}
```

**SELECT_PIECE**: Player selects a piece to give opponent
```json
{
  "type": "SELECT_PIECE",
  "pieceId": 0-15
}
```

**PLACE_PIECE**: Player places received piece on board
```json
{
  "type": "PLACE_PIECE",
  "position": 0-15
}
```

**CALL_QUARTO**: Player claims victory
```json
{
  "type": "CALL_QUARTO"
}
```

**LEAVE_ROOM**: Player voluntarily leaves (forfeit if game in progress)
```json
{
  "type": "LEAVE_ROOM"
}
```

**RECONNECT**: Player reconnects after disconnect
```json
{
  "type": "RECONNECT",
  "playerId": "uuid"
}
```

---

### Server → Client

**ROOM_CREATED**: Room successfully created (sent to host)
```json
{
  "type": "ROOM_CREATED",
  "roomId": "A3B7KP",
  "playerId": "uuid"
}
```

**ROOM_JOINED**: Successfully joined room (sent to guest)
```json
{
  "type": "ROOM_JOINED",
  "playerId": "uuid",
  "game": { /* Game object */ }
}
```

**PLAYER_JOINED**: Opponent joined the room (sent to host)
```json
{
  "type": "PLAYER_JOINED",
  "playerName": "string",
  "game": { /* Game object */ }
}
```

**STATE_UPDATE**: Game state after every move
```json
{
  "type": "STATE_UPDATE",
  "game": {
    "id": "uuid",
    "mode": "online",
    "status": "waiting" | "playing" | "finished",
    "players": [
      { "id": "uuid", "type": "human-remote", "name": "Player 1" },
      { "id": "uuid", "type": "human-remote", "name": "Player 2" }
    ],
    "board": {
      "positions": [null, null, 5, null, ...]
    },
    "availablePieces": [0, 1, 2, 3, ...],
    "currentTurn": 0 | 1,
    "phase": "selecting" | "placing",
    "selectedPiece": null | 0-15,
    "winner": null | 0 | 1 | "draw",
    "winningLine": null | [0, 5, 10, 15],
    "history": [],
    "createdAt": 1701792000000,
    "updatedAt": 1701792000000
  }
}
```

**PLAYER_LEFT**: Opponent disconnected or left
```json
{
  "type": "PLAYER_LEFT",
  "reason": "disconnect" | "forfeit" | "timeout"
}
```

**GAME_OVER**: Game ended
```json
{
  "type": "GAME_OVER",
  "winner": 0 | 1 | "draw",
  "game": { /* Final game state */ }
}
```

**ERROR**: Invalid action or error condition
```json
{
  "type": "ERROR",
  "code": "NOT_YOUR_TURN" | "INVALID_PIECE" | "INVALID_POSITION" | "NO_QUARTO" | "ROOM_FULL" | "ROOM_NOT_FOUND",
  "message": "Human readable error"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `NOT_YOUR_TURN` | Action attempted when not player's turn |
| `INVALID_PIECE` | Piece ID invalid or already placed |
| `INVALID_POSITION` | Position invalid or already occupied |
| `WRONG_PHASE` | SELECT_PIECE during placing phase or vice versa |
| `NO_QUARTO` | Called Quarto but no winning alignment exists |
| `GAME_ENDED` | Action attempted after game finished |
| `ROOM_FULL` | Attempted to join room that already has two players |
| `ROOM_NOT_FOUND` | Room ID does not exist or has expired |

---

## Validation Rules

### Room Management
- Player name: 1-20 characters, trimmed
- Room ID: 6 uppercase alphanumeric characters (client-generated)
- Only first two connections to a room are accepted

### Game Moves
- SELECT_PIECE: Must be current player, selecting phase, piece must be available
- PLACE_PIECE: Must be current player, placing phase, position must be empty
- CALL_QUARTO: Must be current player's turn, valid winning alignment must exist

### Timeouts
- Room expires: 30 minutes of inactivity (no connections)
- Turn timeout: None (players can take unlimited time)
- Reconnection window: 2 minutes after disconnect
- Forfeit: Automatic win for remaining player after reconnection timeout

---

## PartyKit Server Implementation

### Room State Structure

```typescript
interface RoomState {
  game: Game;
  hostPlayerId: string;
  guestPlayerId: string | null;
  connections: Map<string, { connectionId: string; playerId: string }>;
  disconnectedPlayers: Map<string, { playerId: string; disconnectTime: number }>;
}
```

### Party Class Lifecycle

```typescript
export default class QuartoParty implements Party.Server {
  state: RoomState | null = null;

  onConnect(conn: Party.Connection) {
    // Track new connection
    // If reconnecting, restore player session
  }

  onMessage(message: string, sender: Party.Connection) {
    // Parse message type
    // Validate action is legal
    // Update game state
    // Broadcast STATE_UPDATE to all connections
  }

  onClose(conn: Party.Connection) {
    // Mark player as disconnected
    // Start 2-minute reconnection timer
    // If timer expires, forfeit game
  }
}
```

---

## Client Integration

### Using partysocket

```typescript
import PartySocket from 'partysocket';

const socket = new PartySocket({
  host: import.meta.env.VITE_PARTYKIT_HOST,
  room: roomId,
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  // Handle message by type
});

socket.send(JSON.stringify({
  type: 'CREATE_ROOM',
  playerName: 'Player 1'
}));
```

### Reconnection

The `partysocket` library automatically handles reconnection. On reconnect, send:

```json
{
  "type": "RECONNECT",
  "playerId": "<stored-player-id>"
}
```

Store `playerId` in `sessionStorage` for reconnection capability.
