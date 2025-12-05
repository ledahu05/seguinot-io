import { Suspense } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Board3D, PieceTray, GameStatus, GameControls } from '@/features/quarto/components';
import { useQuartoGame } from '@/features/quarto/hooks';
import { createEmptyBoard } from '@/features/quarto/utils';

export const Route = createFileRoute('/games/quarto/play')({
  component: QuartoPlayPage,
});

function QuartoPlayPage() {
  const navigate = useNavigate();
  const {
    game,
    board,
    currentPlayer,
    availablePieces,
    selectedPiece,
    selectedPieceDescription,
    canCallQuarto,
    winningPositions,
    isGameOver,
    isDraw,
    winnerPlayer,
    phase,
    status,
    isAIThinking,
    error,
    hoveredPosition,
    placePiece,
    selectPiece,
    callQuarto,
    hoverPosition,
    resetGame,
    clearError,
  } = useQuartoGame();

  // Redirect if no game is active
  if (!game) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
        <h1 className="mb-6 text-3xl font-bold text-white">No Active Game</h1>
        <button
          onClick={() => navigate({ to: '/games/quarto' })}
          className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-amber-400"
        >
          Start New Game
        </button>
      </div>
    );
  }

  const handlePositionClick = (position: number) => {
    if (phase === 'placing') {
      placePiece(position);
    }
  };

  const handlePieceSelect = (pieceId: number) => {
    if (phase === 'selecting') {
      selectPiece(pieceId);
    }
  };

  const handleNewGame = () => {
    resetGame();
    navigate({ to: '/games/quarto' });
  };

  const handleQuit = () => {
    resetGame();
    navigate({ to: '/games/quarto' });
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* 3D Canvas */}
      <div className="flex-1">
        <Canvas
          camera={{
            position: [8, 8, 8],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          shadows
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 15, 10]}
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[-10, 10, -10]} intensity={0.3} />

            {/* Environment */}
            <Environment preset="studio" />

            {/* Board */}
            <Board3D
              board={board ?? createEmptyBoard()}
              onPositionClick={handlePositionClick}
              onPositionHover={hoverPosition}
              hoveredPosition={hoveredPosition}
              winningLine={winningPositions}
            />

            {/* Piece Tray */}
            <PieceTray
              availablePieces={availablePieces}
              selectedPieceId={selectedPiece?.id}
              onPieceSelect={handlePieceSelect}
              disabled={phase !== 'selecting' || isAIThinking}
            />

            {/* Shadows */}
            <ContactShadows
              position={[0, -0.2, 0]}
              opacity={0.5}
              scale={15}
              blur={2}
              far={4}
            />

            {/* Camera Controls */}
            <OrbitControls
              enablePan={false}
              minDistance={6}
              maxDistance={20}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
              target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Side Panel */}
      <div className="flex w-80 flex-col gap-6 bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Quarto</h1>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg bg-red-500/20 p-3 text-red-300">
            <p>{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-sm text-red-400 underline hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Game Status */}
        <GameStatus
          status={status ?? 'playing'}
          phase={phase ?? 'selecting'}
          currentPlayer={currentPlayer}
          winner={winnerPlayer}
          isDraw={isDraw}
          isAIThinking={isAIThinking}
          selectedPieceName={selectedPieceDescription}
        />

        {/* Game Controls */}
        <GameControls
          canCallQuarto={canCallQuarto}
          onCallQuarto={callQuarto}
          onNewGame={handleNewGame}
          onQuit={handleQuit}
          isGameOver={isGameOver}
          disabled={isAIThinking}
        />

        {/* Instructions */}
        <div className="mt-auto rounded-lg bg-slate-700/50 p-4 text-sm text-slate-400">
          <h3 className="mb-2 font-semibold text-slate-300">How to Play</h3>
          <ol className="list-inside list-decimal space-y-1">
            <li>Select a piece for your opponent</li>
            <li>They place it on the board</li>
            <li>Get 4 in a row with any shared trait</li>
            <li>Call "Quarto!" to win</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
