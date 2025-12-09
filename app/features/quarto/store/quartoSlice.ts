import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Game, QuartoState, AIDifficulty, GameMove } from '../types/quarto.types';
import { createEmptyBoard, findWinningLine, isBoardFull } from '../utils/winDetection';

const initialState: QuartoState = {
  game: null,
  online: {
    roomId: null,
    playerId: null,
    playerIndex: null,
    isHost: false,
  },
  ui: {
    selectedPosition: null,
    hoveredPosition: null,
    isAIThinking: false,
    connectionStatus: 'disconnected',
    error: null,
  },
};

function generateId(): string {
  return crypto.randomUUID();
}

function getAllPieceIds(): number[] {
  return Array.from({ length: 16 }, (_, i) => i);
}

const quartoSlice = createSlice({
  name: 'quarto',
  initialState,
  reducers: {
    // Game Lifecycle
    startLocalGame(
      state,
      action: PayloadAction<{ player1Name: string; player2Name: string }>
    ) {
      const { player1Name, player2Name } = action.payload;
      const startingPlayer = Math.random() < 0.5 ? 0 : 1;
      const now = Date.now();

      state.game = {
        id: generateId(),
        mode: 'local',
        status: 'playing',
        players: [
          { id: 'player1', type: 'human-local', name: player1Name },
          { id: 'player2', type: 'human-local', name: player2Name },
        ],
        board: createEmptyBoard(),
        availablePieces: getAllPieceIds(),
        currentTurn: startingPlayer as 0 | 1,
        phase: 'selecting',
        selectedPiece: null,
        winner: null,
        winningLine: null,
        history: [],
        createdAt: now,
        updatedAt: now,
      };
      state.ui.error = null;
    },

    startAIGame(
      state,
      action: PayloadAction<{
        playerName: string;
        difficulty: AIDifficulty;
        playerGoesFirst: boolean;
      }>
    ) {
      const { playerName, difficulty, playerGoesFirst } = action.payload;
      const now = Date.now();

      state.game = {
        id: generateId(),
        mode: 'ai',
        status: 'playing',
        players: [
          { id: 'player1', type: 'human-local', name: playerName },
          { id: 'ai', type: 'ai', name: 'AI', difficulty },
        ],
        board: createEmptyBoard(),
        availablePieces: getAllPieceIds(),
        currentTurn: playerGoesFirst ? 0 : 1,
        phase: 'selecting',
        selectedPiece: null,
        winner: null,
        winningLine: null,
        history: [],
        createdAt: now,
        updatedAt: now,
      };
      state.ui.error = null;
    },

    setOnlineGame(state, action: PayloadAction<Game>) {
      state.game = action.payload;
      state.ui.error = null;
    },

    resetGame(state) {
      state.game = null;
      state.ui = {
        selectedPosition: null,
        hoveredPosition: null,
        isAIThinking: false,
        connectionStatus: state.ui.connectionStatus,
        error: null,
      };
    },

    // Game Moves
    selectPiece(state, action: PayloadAction<{ pieceId: number }>) {
      if (!state.game) return;
      if (state.game.phase !== 'selecting') return;
      if (!state.game.availablePieces.includes(action.payload.pieceId)) return;

      const move: GameMove = {
        type: 'select',
        player: state.game.currentTurn,
        pieceId: action.payload.pieceId,
        timestamp: Date.now(),
      };

      state.game.selectedPiece = action.payload.pieceId;
      state.game.phase = 'placing';
      state.game.currentTurn = state.game.currentTurn === 0 ? 1 : 0;
      state.game.history.push(move);
      state.game.updatedAt = Date.now();
    },

    placePiece(state, action: PayloadAction<{ position: number }>) {
      if (!state.game) return;
      if (state.game.phase !== 'placing') return;
      if (state.game.selectedPiece === null) return;
      if (state.game.board.positions[action.payload.position] !== null) return;

      const { position } = action.payload;
      const pieceId = state.game.selectedPiece;

      const move: GameMove = {
        type: 'place',
        player: state.game.currentTurn,
        pieceId,
        position,
        timestamp: Date.now(),
      };

      // Place the piece
      state.game.board.positions[position] = pieceId;
      state.game.availablePieces = state.game.availablePieces.filter(id => id !== pieceId);
      state.game.selectedPiece = null;
      state.game.phase = 'selecting';
      state.game.history.push(move);
      state.game.updatedAt = Date.now();

      // Check for draw (board full)
      if (isBoardFull(state.game.board)) {
        state.game.status = 'finished';
        state.game.winner = 'draw';
      }
    },

    callQuarto(state) {
      if (!state.game) return;

      const winResult = findWinningLine(state.game.board);

      const move: GameMove = {
        type: 'quarto',
        player: state.game.currentTurn,
        timestamp: Date.now(),
      };
      state.game.history.push(move);

      if (winResult) {
        state.game.status = 'finished';
        state.game.winner = state.game.currentTurn;
        state.game.winningLine = winResult.positions;
      } else {
        // Invalid Quarto call - could penalize in strict mode
        state.ui.error = 'No Quarto found! Invalid call.';
      }

      state.game.updatedAt = Date.now();
    },

    // AI Actions
    setAIThinking(state, action: PayloadAction<boolean>) {
      state.ui.isAIThinking = action.payload;
    },

    applyAIMove(
      state,
      action: PayloadAction<{
        type: 'select' | 'place';
        pieceId?: number;
        position?: number;
      }>
    ) {
      state.ui.isAIThinking = false;

      if (!state.game) return;

      if (action.payload.type === 'select' && action.payload.pieceId !== undefined) {
        // Inline selectPiece logic for AI
        if (state.game.phase !== 'selecting') return;
        if (!state.game.availablePieces.includes(action.payload.pieceId)) return;

        const move: GameMove = {
          type: 'select',
          player: state.game.currentTurn,
          pieceId: action.payload.pieceId,
          timestamp: Date.now(),
        };

        state.game.selectedPiece = action.payload.pieceId;
        state.game.phase = 'placing';
        state.game.currentTurn = state.game.currentTurn === 0 ? 1 : 0;
        state.game.history.push(move);
        state.game.updatedAt = Date.now();
      } else if (action.payload.type === 'place' && action.payload.position !== undefined) {
        // Inline placePiece logic for AI
        if (state.game.phase !== 'placing') return;
        if (state.game.selectedPiece === null) return;
        if (state.game.board.positions[action.payload.position] !== null) return;

        const position = action.payload.position;
        const pieceId = state.game.selectedPiece;

        const move: GameMove = {
          type: 'place',
          player: state.game.currentTurn,
          pieceId,
          position,
          timestamp: Date.now(),
        };

        state.game.board.positions[position] = pieceId;
        state.game.availablePieces = state.game.availablePieces.filter(id => id !== pieceId);
        state.game.selectedPiece = null;
        state.game.phase = 'selecting';
        state.game.history.push(move);
        state.game.updatedAt = Date.now();

        if (isBoardFull(state.game.board)) {
          state.game.status = 'finished';
          state.game.winner = 'draw';
        }
      }
    },

    // Online Multiplayer
    setConnectionStatus(
      state,
      action: PayloadAction<'disconnected' | 'connecting' | 'connected'>
    ) {
      state.ui.connectionStatus = action.payload;
    },

    setOnlineRoom(
      state,
      action: PayloadAction<{
        roomId: string;
        playerId: string;
        playerIndex: 0 | 1;
        isHost: boolean;
      }>
    ) {
      state.online = action.payload;
    },

    clearOnlineRoom(state) {
      state.online = {
        roomId: null,
        playerId: null,
        playerIndex: null,
        isHost: false,
      };
      state.ui.connectionStatus = 'disconnected';
      state.ui.error = null;
    },

    handlePlayerLeft(
      state,
      action: PayloadAction<{ reason: 'disconnect' | 'forfeit' | 'timeout' }>
    ) {
      if (!state.game) return;

      if (action.payload.reason === 'timeout' || action.payload.reason === 'forfeit') {
        // The remaining player wins
        state.game.status = 'finished';
        state.game.winner = state.game.currentTurn;
      }
    },

    // UI State
    setSelectedPosition(state, action: PayloadAction<number | null>) {
      state.ui.selectedPosition = action.payload;
    },

    setHoveredPosition(state, action: PayloadAction<number | null>) {
      state.ui.hoveredPosition = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.ui.error = action.payload;
    },
  },
});

export const {
  startLocalGame,
  startAIGame,
  setOnlineGame,
  resetGame,
  selectPiece,
  placePiece,
  callQuarto,
  setAIThinking,
  applyAIMove,
  setConnectionStatus,
  setOnlineRoom,
  clearOnlineRoom,
  handlePlayerLeft,
  setSelectedPosition,
  setHoveredPosition,
  setError,
} = quartoSlice.actions;

export const quartoReducer = quartoSlice.reducer;
