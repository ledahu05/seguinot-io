import { useEffect, useCallback, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSelector, useDispatch } from 'react-redux';

import { Board3D, PieceTray, Piece3D, GameStatus } from '@/features/quarto/components';
import { useResponsiveCamera } from '@/features/quarto/hooks';
import { useOnlineGame } from '@/features/quarto/online';
import {
  selectGame,
  selectBoard,
  selectAvailablePieces,
  selectSelectedPiece,
  selectIsGameOver,
  selectWinner,
  selectWinnerPlayer,
  selectGameStatus,
  selectOnlinePlayerIndex,
  selectConnectionStatus,
  selectError,
} from '@/features/quarto/store/selectors';
import { resetGame, clearOnlineRoom } from '@/features/quarto/store/quartoSlice';
import { createEmptyBoard } from '@/features/quarto/utils/winDetection';

const searchSchema = z.object({
  room: z.string().length(6),
  host: z.boolean(),
  name: z.string().default('Player'),
});

export const Route = createFileRoute('/games/quarto/online')({
  validateSearch: searchSchema,
  component: OnlineGamePage,
});

function OnlineGamePage() {
  const { room, host, name } = Route.useSearch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cameraConfig = useResponsiveCamera();

  // Reset any previous game state on mount
  useEffect(() => {
    console.log('[Online] Component mounted, resetting game and online state');
    dispatch(resetGame());
    dispatch(clearOnlineRoom());
    return () => {
      console.log('[Online] Component unmounting');
    };
  }, [dispatch]);

  // Redux state
  const game = useSelector(selectGame);
  const board = useSelector(selectBoard);
  const availablePieces = useSelector(selectAvailablePieces);
  const selectedPiece = useSelector(selectSelectedPiece);
  const isGameOver = useSelector(selectIsGameOver);
  const winner = useSelector(selectWinner);
  const winnerPlayer = useSelector(selectWinnerPlayer);
  const gameStatus = useSelector(selectGameStatus);
  // Note: We don't use the derived isMyTurn selector here to avoid race conditions
  // Instead, we compute it directly: game?.currentTurn === playerIndex
  const playerIndex = useSelector(selectOnlinePlayerIndex);
  const connectionStatus = useSelector(selectConnectionStatus);
  const error = useSelector(selectError);

  // Online game hook
  const {
    createRoom,
    joinRoom,
    selectPiece: sendSelectPiece,
    placePiece: sendPlacePiece,
    callQuarto: sendCallQuarto,
    leaveRoom,
    reconnect,
  } = useOnlineGame({
    roomId: room,
    playerName: name,
    isHost: host,
  });

  // Track if we've attempted to create/join
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);

  // Track if the game is ready for interaction
  const gameReady = game?.status === 'playing' && playerIndex !== null;

  // Create or join room on connection
  useEffect(() => {
    console.log('[Online] Connection effect triggered', {
      connectionStatus,
      hasAttemptedConnect,
      host,
      room,
    });
    if (connectionStatus === 'connected' && !hasAttemptedConnect) {
      // First try to reconnect
      console.log('[Online] Attempting to reconnect or create/join...');
      const didReconnect = reconnect();
      if (!didReconnect) {
        // No existing session, create or join
        if (host) {
          console.log('[Online] Creating room as host');
          createRoom();
        } else {
          console.log('[Online] Joining room as guest');
          joinRoom();
        }
      } else {
        console.log('[Online] Reconnection attempted');
      }
      setHasAttemptedConnect(true);
    }
  }, [connectionStatus, hasAttemptedConnect, host, room, createRoom, joinRoom, reconnect]);

  // Handle piece selection
  const handlePieceSelect = useCallback(
    (pieceId: number) => {
      console.log('[Online] handlePieceSelect called', {
        pieceId,
        gameReady,
        phase: game?.phase,
        status: game?.status,
        playerIndex,
        currentTurn: game?.currentTurn,
      });
      // Multiple guards to prevent invalid selections
      if (!gameReady) {
        console.log('[Online] handlePieceSelect - game not ready');
        return;
      }
      if (game?.phase !== 'selecting') {
        console.log('[Online] handlePieceSelect - wrong phase');
        return;
      }
      if (game?.currentTurn !== playerIndex) {
        console.log('[Online] handlePieceSelect - not my turn');
        return;
      }
      console.log('[Online] handlePieceSelect - sending SELECT_PIECE');
      sendSelectPiece(pieceId);
    },
    [game, gameReady, playerIndex, sendSelectPiece]
  );

  // Handle piece placement
  const handleBoardClick = useCallback(
    (position: number) => {
      if (!gameReady || game?.phase !== 'placing' || game?.currentTurn !== playerIndex) return;
      if (game?.board.positions[position] !== null) return;
      sendPlacePiece(position);
    },
    [gameReady, game, playerIndex, sendPlacePiece]
  );

  // Handle Quarto call
  const handleCallQuarto = useCallback(() => {
    if (!gameReady || game?.currentTurn !== playerIndex) return;
    sendCallQuarto();
  }, [gameReady, game, playerIndex, sendCallQuarto]);

  // Handle leaving
  const handleLeave = useCallback(() => {
    leaveRoom();
    navigate({ to: '/games/quarto' });
  }, [leaveRoom, navigate]);

  // Debug logging for conditional rendering
  console.log('[Online] Render state:', {
    connectionStatus,
    gameStatus,
    game: game ? { status: game.status, playersCount: game.players.length, mode: game.mode } : null,
    playerIndex,
    error,
  });

  // Connection status display
  if (connectionStatus === 'connecting' || connectionStatus === 'disconnected') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">
            {connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </h2>
          {connectionStatus === 'disconnected' && (
            <button
              onClick={() => navigate({ to: '/games/quarto' })}
              className="rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-600"
            >
              Back to Menu
            </button>
          )}
        </div>
      </div>
    );
  }

  // Waiting for opponent
  if (gameStatus === 'waiting' || !game || game.players.length < 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Waiting for Opponent</h2>

          <div className="mb-8 rounded-lg bg-slate-800 p-6">
            <p className="mb-2 text-sm text-slate-400">Share this room code:</p>
            <p className="font-mono text-4xl tracking-widest text-emerald-400">{room}</p>
          </div>

          <p className="mb-8 text-slate-400">
            Give this code to your friend so they can join the game.
          </p>

          <button
            onClick={handleLeave}
            className="rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Error display
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Error</h2>
          <p className="mb-8 text-slate-400">{error}</p>
          <button
            onClick={() => navigate({ to: '/games/quarto' })}
            className="rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-600"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Game over screen
  if (isGameOver) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-amber-400">
            {winner === 'draw'
              ? "It's a Draw!"
              : winner === playerIndex
                ? 'You Win!'
                : 'You Lose!'}
          </h2>
          {winnerPlayer && winner !== 'draw' && (
            <p className="mb-8 text-lg text-slate-400">{winnerPlayer.name} wins the game!</p>
          )}
          <button
            onClick={() => navigate({ to: '/games/quarto' })}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-lg font-bold text-white hover:from-emerald-400 hover:to-teal-400"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Main game view
  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Game Status Header */}
      <div className="absolute left-0 right-0 top-0 z-10 p-4">
        <div className="mx-auto max-w-2xl">
          <GameStatus
            playerIndex={playerIndex ?? 0}
            isOnline={true}
            roomCode={room}
          />

          {/* Turn indicator */}
          <div className="mt-2 text-center">
            <span
              className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${
                game?.currentTurn === playerIndex
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {game?.currentTurn === playerIndex
                ? game?.phase === 'selecting'
                  ? 'Select a piece for your opponent'
                  : 'Place the piece on the board'
                : "Opponent's turn"}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Piece Preview */}
      {selectedPiece && (
        <div className="absolute right-2 top-2 z-10 h-24 w-24 rounded-lg border border-slate-600 bg-slate-800/80">
          <Canvas
            camera={{
              position: [0, 0.5, 3],
              fov: 45,
              near: 0.1,
              far: 100,
            }}
          >
            <ambientLight intensity={1.0} />
            <directionalLight position={[2, 4, 2]} intensity={1.2} />
            <Piece3D piece={selectedPiece} position={[0, -0.5, 0]} isSelected={false} />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      )}

      {/* Quarto Button */}
      {gameReady && game?.currentTurn === playerIndex && game?.phase === 'selecting' && (
        <div className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2">
          <button
            onClick={handleCallQuarto}
            className="rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-3 text-lg font-bold text-black transition-all hover:from-amber-400 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/25"
          >
            Call Quarto!
          </button>
        </div>
      )}

      {/* Leave Button */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={handleLeave}
          className="rounded-lg bg-slate-700/80 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
        >
          Leave Game
        </button>
      </div>

      {/* Main Canvas - Board (70%) */}
      <div className="h-[70%] w-full">
        <Canvas camera={cameraConfig.board}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          <Board3D
            board={board ?? createEmptyBoard()}
            onPositionClick={handleBoardClick}
          />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
            minDistance={8}
            maxDistance={20}
          />
        </Canvas>
      </div>

      {/* Piece Tray Canvas (30%) */}
      <div className="h-[30%] w-full border-t border-slate-700">
        <Canvas
          camera={{
            position: cameraConfig.tray.position as [number, number, number],
            fov: cameraConfig.tray.fov,
            near: 0.1,
            far: 100,
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[0, 10, 5]} intensity={0.8} />
          <PieceTray
            availablePieces={availablePieces}
            selectedPieceId={selectedPiece?.id ?? null}
            onPieceSelect={handlePieceSelect}
            disabled={!gameReady || game?.phase !== 'selecting' || game?.currentTurn !== playerIndex}
            layout="bottom"
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={15}
            target={cameraConfig.tray.target as [number, number, number]}
          />
        </Canvas>
      </div>
    </div>
  );
}
