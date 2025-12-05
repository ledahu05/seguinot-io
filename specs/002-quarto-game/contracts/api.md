# API Contracts: Quarto Board Game

**Feature**: 002-quarto-game
**Date**: 2025-12-05

## Overview

The Quarto game uses a hybrid API approach:
- **REST endpoints** for room management (create, join, leave)
- **WebSocket** for real-time game state synchronization

Base path: `/api/games/quarto`

## REST Endpoints

### Create Room

Creates a new multiplayer game room.

```
POST /api/games/quarto/rooms
```

**Request Body**:
```json
{
  "playerName": "string (1-20 chars)"
}
```

**Response 201**:
```json
{
  "roomId": "ABC123",
  "gameId": "uuid",
  "playerId": "uuid",
  "wsUrl": "/api/games/quarto/ws/ABC123"
}
```

**Response 400**:
```json
{
  "error": "INVALID_NAME",
  "message": "Player name must be 1-20 characters"
}
```

---

### Join Room

Joins an existing game room as the second player.

```
POST /api/games/quarto/rooms/:roomId/join
```

**Path Parameters**:
- `roomId`: 6-character room code

**Request Body**:
```json
{
  "playerName": "string (1-20 chars)"
}
```

**Response 200**:
```json
{
  "roomId": "ABC123",
  "gameId": "uuid",
  "playerId": "uuid",
  "wsUrl": "/api/games/quarto/ws/ABC123"
}
```

**Response 404**:
```json
{
  "error": "ROOM_NOT_FOUND",
  "message": "Room ABC123 does not exist or has expired"
}
```

**Response 409**:
```json
{
  "error": "ROOM_FULL",
  "message": "Room already has two players"
}
```

---

### Get Room Status

Gets current room status (for reconnection).

```
GET /api/games/quarto/rooms/:roomId
```

**Response 200**:
```json
{
  "roomId": "ABC123",
  "gameId": "uuid",
  "hostName": "Player 1",
  "guestName": "Player 2 | null",
  "status": "waiting | playing | finished",
  "createdAt": 1701792000000
}
```

---

### Leave Room

Player voluntarily leaves room (forfeit if game in progress).

```
POST /api/games/quarto/rooms/:roomId/leave
```

**Request Body**:
```json
{
  "playerId": "uuid"
}
```

**Response 200**:
```json
{
  "success": true
}
```

---

## WebSocket Protocol

### Connection

```
WebSocket /api/games/quarto/ws/:roomId?playerId={playerId}
```

**Query Parameters**:
- `playerId`: UUID received from create/join response

**Connection Handshake**:
1. Client connects with playerId
2. Server validates player belongs to room
3. Server sends `CONNECTED` message
4. Server sends current `STATE_UPDATE`

---

### Message Types

All messages are JSON with a `type` field.

#### Client → Server

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

**PING**: Keep-alive (every 30s)
```json
{
  "type": "PING"
}
```

---

#### Server → Client

**CONNECTED**: Connection confirmed
```json
{
  "type": "CONNECTED",
  "playerId": "uuid",
  "playerIndex": 0 | 1
}
```

**STATE_UPDATE**: Full game state (sent after every move)
```json
{
  "type": "STATE_UPDATE",
  "game": {
    "id": "uuid",
    "mode": "online",
    "status": "playing",
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
    "winningLine": null | [0, 5, 10, 15]
  }
}
```

**PLAYER_JOINED**: Opponent joined (sent to host)
```json
{
  "type": "PLAYER_JOINED",
  "playerName": "string"
}
```

**PLAYER_LEFT**: Opponent disconnected
```json
{
  "type": "PLAYER_LEFT",
  "playerId": "uuid",
  "reason": "disconnect" | "forfeit" | "timeout"
}
```

**GAME_OVER**: Game ended
```json
{
  "type": "GAME_OVER",
  "winner": 0 | 1 | "draw",
  "reason": "quarto" | "draw" | "forfeit" | "timeout",
  "winningLine": [0, 5, 10, 15] | null
}
```

**ERROR**: Invalid action
```json
{
  "type": "ERROR",
  "code": "NOT_YOUR_TURN" | "INVALID_PIECE" | "INVALID_POSITION" | "NO_QUARTO",
  "message": "Human readable error"
}
```

**PONG**: Keep-alive response
```json
{
  "type": "PONG"
}
```

---

### Error Codes

| Code | Description |
|------|-------------|
| `NOT_YOUR_TURN` | Action attempted when not player's turn |
| `INVALID_PIECE` | Piece ID invalid or already placed |
| `INVALID_POSITION` | Position invalid or already occupied |
| `WRONG_PHASE` | SELECT_PIECE during placing phase or vice versa |
| `NO_QUARTO` | Called Quarto but no winning alignment exists |
| `GAME_ENDED` | Action attempted after game finished |
| `UNAUTHORIZED` | PlayerId doesn't match room participants |

---

## Validation Rules

### Room Creation
- Player name: 1-20 characters, trimmed
- Room ID: Auto-generated 6 uppercase alphanumeric

### Game Moves
- SELECT_PIECE: Must be current player, selecting phase, piece must be available
- PLACE_PIECE: Must be current player, placing phase, position must be empty
- CALL_QUARTO: Must be current player's turn, valid winning alignment must exist

### Timeouts
- Room expires: 30 minutes of inactivity (no WS connections)
- Turn timeout: None (players can take unlimited time)
- Reconnection window: 2 minutes after disconnect
