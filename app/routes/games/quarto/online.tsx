import { useEffect, useCallback, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSelector, useDispatch } from 'react-redux';

import { Board3D, PieceTray, Piece3D, GameStatus, WinCelebration, ShareRoomButton } from '@/features/quarto/components';
import { useResponsiveCamera, useWinAnimation } from '@/features/quarto/hooks';
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
import { resetGame, clearOnlineRoom, setConnectionStatus } from '@/features/quarto/store/quartoSlice';
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

  // Win animation state
  const { isAnimationPlaying, animationType, duration, handleAnimationComplete } =
    useWinAnimation();

  // Reset any previous game state on mount
  useEffect(() => {
    dispatch(resetGame());
    dispatch(clearOnlineRoom());
    dispatch(setConnectionStatus('disconnected')); // Clear stale connection status
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
    leaveRoom,
    reconnect,
  } = useOnlineGame({
    roomId: room,
    playerName: name,
    isHost: host,
  });

  // Track if we've attempted to create/join
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);
  // Track when socket actually opened (not just Redux state)
  const [socketReady, setSocketReady] = useState(false);

  // Track if the game is ready for interaction
  const gameReady = game?.status === 'playing' && playerIndex !== null;

  // Track when connection status changes to 'connected'
  useEffect(() => {
    if (connectionStatus === 'connected') {
      // Small delay to ensure socket is fully ready
      const timer = setTimeout(() => {
        setSocketReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSocketReady(false);
    }
  }, [connectionStatus]);

  // Create or join room when socket is actually ready
  useEffect(() => {
    if (socketReady && !hasAttemptedConnect) {
      // First try to reconnect
      const didReconnect = reconnect();
      if (!didReconnect) {
        // No existing session, create or join
        if (host) {
          createRoom();
        } else {
          joinRoom();
        }
      }
      setHasAttemptedConnect(true);
    }
  }, [socketReady, hasAttemptedConnect, host, createRoom, joinRoom, reconnect]);

  // Handle piece selection
  const handlePieceSelect = useCallback(
    (pieceId: number) => {
      if (!gameReady) return;
      if (game?.phase !== 'selecting') return;
      if (game?.currentTurn !== playerIndex) return;
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

  // Handle leaving
  const handleLeave = useCallback(() => {
    leaveRoom();
    navigate({ to: '/games/quarto' });
  }, [leaveRoom, navigate]);

  // Connection status display
  if (connectionStatus === 'connecting' || connectionStatus === 'disconnected') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Waiting for Opponent</h2>

          <div className="mb-6 rounded-lg bg-slate-800 p-6">
            <p className="mb-2 text-sm text-slate-400">Room Code:</p>
            <p className="font-mono text-4xl tracking-widest text-emerald-400">{room}</p>
            <ShareRoomButton roomCode={room} className="mt-4 w-full" />
          </div>

          <p className="mb-8 text-sm text-slate-500">
            Share the link or give your friend the code to join.
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
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

  // Main game view
  return (
    <div className="flex h-screen flex-col bg-slate-900 md:flex-row">
      {/* Win/Defeat Animation Overlay */}
      <WinCelebration
        animationType={animationType}
        isPlaying={isAnimationPlaying}
        duration={duration}
        winnerName={winnerPlayer?.name}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Main game area (board + tray) */}
      <div className="flex flex-1 flex-col">
        {/* Board Canvas */}
        <div className="relative min-h-0 flex-[7]">
          {/* Selected piece preview - top right corner */}
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
          <Canvas
            camera={cameraConfig.board}
            shadows
            style={{ background: '#e5e5e5' }}
          >
            <ambientLight intensity={0.4} />
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

        {/* Tray Canvas */}
        <div className="min-h-0 flex-[3]">
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

      {/* Side Panel */}
      <div className="flex w-full flex-col gap-4 overflow-y-auto bg-slate-800 p-4 md:w-80 md:gap-6 md:overflow-visible md:p-6">
        <h1 className="text-xl font-bold text-white md:text-2xl">Quarto Online</h1>

        {/* Game Status */}
        <GameStatus
          playerIndex={playerIndex ?? 0}
          isOnline={true}
          roomCode={room}
        />

        {/* Turn indicator / Game Over message */}
        <div className="text-center">
          {isGameOver ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-amber-400">
                {winner === 'draw'
                  ? "It's a Draw!"
                  : winner === playerIndex
                    ? 'You Win!'
                    : 'You Lose!'}
              </h2>
              {winnerPlayer && winner !== 'draw' && (
                <p className="text-sm text-slate-400">{winnerPlayer.name} wins the game!</p>
              )}
              {!isAnimationPlaying && (
                <button
                  onClick={() => navigate({ to: '/games/quarto' })}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white hover:from-emerald-400 hover:to-teal-400"
                >
                  Back to Menu
                </button>
              )}
            </div>
          ) : (
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
          )}
        </div>

        {/* Game Controls */}
        <div className="mt-auto space-y-3">
          {/* Leave Button */}
          <button
            onClick={handleLeave}
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
          >
            Leave Game
          </button>
        </div>

        {/* Instructions - hidden on mobile */}
        <div className="mt-4 hidden space-y-4 md:block">
          <div className="rounded-lg bg-slate-700/50 p-4 text-sm text-slate-400">
            <h3 className="mb-2 font-semibold text-slate-300">How to Play</h3>
            <ol className="list-inside list-decimal space-y-1">
              <li>Select a piece for your opponent</li>
              <li>They place it on the board</li>
              <li>Get 4 in a row with any shared trait to win!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
