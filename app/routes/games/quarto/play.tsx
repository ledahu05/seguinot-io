import { Suspense } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import {
    Board3D,
    PieceTray,
    GameStatus,
    GameControls
} from '@/features/quarto/components';
import { useQuartoGame, useResponsiveCamera, useKeyboardNavigation, useAI } from '@/features/quarto/hooks';
import { createEmptyBoard } from '@/features/quarto/utils';

export const Route = createFileRoute('/games/quarto/play')({
    component: QuartoPlayPage
});

function QuartoPlayPage() {
    const navigate = useNavigate();
    const cameraConfig = useResponsiveCamera();
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
        clearError
    } = useQuartoGame();

    // Keyboard navigation
    const {
        focusedPieceIndex,
        focusedBoardPosition,
        isKeyboardActive
    } = useKeyboardNavigation({
        availablePieces,
        phase: phase ?? null,
        disabled: isAIThinking || isGameOver,
        onSelectPiece: selectPiece,
        onPlacePiece: placePiece,
        onCallQuarto: callQuarto,
        canCallQuarto,
        board: board?.positions ?? []
    });

    // Determine if it's AI's turn
    const isAIGame = game?.mode === 'ai';
    const aiPlayer = game?.players.find(p => p.type === 'ai');
    const aiPlayerIndex = game?.players.findIndex(p => p.type === 'ai') as 0 | 1 | undefined;
    const isAITurn = isAIGame && aiPlayerIndex !== undefined && game?.currentTurn === aiPlayerIndex;

    // AI hook - handles automatic AI moves
    useAI({
        enabled: isAIGame,
        isAITurn: isAITurn ?? false,
        board,
        availablePieces: availablePieces.map(p => p.id),
        selectedPiece: selectedPiece?.id ?? null,
        phase,
        difficulty: aiPlayer?.difficulty ?? 'medium',
        gameStatus: status,
    });

    // Redirect if no game is active
    if (!game) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4 sm:p-8'>
                <h1 className='mb-6 text-2xl font-bold text-white sm:text-3xl'>
                    No Active Game
                </h1>
                <button
                    onClick={() => navigate({ to: '/games/quarto' })}
                    className='rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-amber-400'
                >
                    Start New Game
                </button>
            </div>
        );
    }

    const handlePositionClick = (position: number) => {
        if (isAITurn || isAIThinking) {
            return;
        }
        if (phase === 'placing') {
            placePiece(position);
        }
    };

    const handlePieceSelect = (pieceId: number) => {
        if (isAITurn || isAIThinking) {
            return;
        }
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
        <div className='flex h-screen flex-col bg-slate-900 md:flex-row'>
            {/* Main game area (board + tray) */}
            <div className='flex flex-1 flex-col'>
                {/* Board Canvas */}
                <div className='flex-[7] min-h-0'>
                    <Canvas
                        camera={{
                            position: cameraConfig.board.position,
                            fov: cameraConfig.board.fov,
                            near: 0.1,
                            far: 100
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
                            <Environment preset='studio' />

                            {/* Board */}
                            <Board3D
                                board={board ?? createEmptyBoard()}
                                onPositionClick={handlePositionClick}
                                onPositionHover={hoverPosition}
                                hoveredPosition={hoveredPosition}
                                focusedPosition={isKeyboardActive ? focusedBoardPosition : null}
                                winningLine={winningPositions}
                            />

                            {/* Shadows */}
                            <ContactShadows
                                position={[0, -0.2, 0]}
                                opacity={0.5}
                                scale={10}
                                blur={2}
                                far={4}
                            />

                            {/* Camera Controls */}
                            <OrbitControls
                                enablePan={false}
                                minDistance={4}
                                maxDistance={20}
                                minPolarAngle={Math.PI / 6}
                                maxPolarAngle={Math.PI / 2.5}
                                target={cameraConfig.board.target}
                            />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Piece Tray Canvas - perspective angled view */}
                <div className='flex-[3] min-h-0 border-t border-slate-700 bg-slate-800/50'>
                    <Canvas
                        camera={{
                            position: cameraConfig.tray.position,
                            fov: cameraConfig.tray.fov,
                            near: 0.1,
                            far: 100
                        }}
                    >
                        <Suspense fallback={null}>
                            {/* Lighting for tray */}
                            <ambientLight intensity={0.6} />
                            <directionalLight
                                position={[0, 10, 5]}
                                intensity={0.8}
                            />

                            {/* Piece Tray */}
                            <PieceTray
                                availablePieces={availablePieces}
                                selectedPieceId={selectedPiece?.id}
                                onPieceSelect={handlePieceSelect}
                                disabled={phase !== 'selecting' || isAIThinking}
                                focusedIndex={isKeyboardActive ? focusedPieceIndex : null}
                                layout='bottom'
                            />

                            {/* Camera Controls for tray */}
                            <OrbitControls
                                enablePan={false}
                                minDistance={4}
                                maxDistance={15}
                                target={cameraConfig.tray.target}
                            />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            {/* Side Panel */}
            <div className='flex w-full flex-col gap-4 overflow-y-auto bg-slate-800 p-4 md:w-80 md:gap-6 md:overflow-visible md:p-6'>
                <h1 className='text-xl font-bold text-white md:text-2xl'>
                    Quarto
                </h1>

                {/* Error Display */}
                {error && (
                    <div className='rounded-lg bg-red-500/20 p-3 text-red-300'>
                        <p>{error}</p>
                        <button
                            onClick={clearError}
                            className='mt-2 text-sm text-red-400 underline hover:text-red-300'
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

                {/* Instructions - hidden on mobile to save space */}
                <div className='mt-auto hidden space-y-4 md:block'>
                    <div className='rounded-lg bg-slate-700/50 p-4 text-sm text-slate-400'>
                        <h3 className='mb-2 font-semibold text-slate-300'>
                            How to Play
                        </h3>
                        <ol className='list-inside list-decimal space-y-1'>
                            <li>Select a piece for your opponent</li>
                            <li>They place it on the board</li>
                            <li>Get 4 in a row with any shared trait</li>
                            <li>Call "Quarto!" to win</li>
                        </ol>
                    </div>
                    <div className='rounded-lg bg-slate-700/50 p-3 text-xs text-slate-400'>
                        <h3 className='mb-1 font-semibold text-slate-300'>
                            Keyboard Controls
                        </h3>
                        <ul className='space-y-0.5'>
                            <li><kbd className='rounded bg-slate-600 px-1'>Tab</kbd> / <kbd className='rounded bg-slate-600 px-1'>Arrows</kbd> Navigate</li>
                            <li><kbd className='rounded bg-slate-600 px-1'>Enter</kbd> / <kbd className='rounded bg-slate-600 px-1'>Space</kbd> Select/Place</li>
                            <li><kbd className='rounded bg-slate-600 px-1'>Q</kbd> Call Quarto</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
