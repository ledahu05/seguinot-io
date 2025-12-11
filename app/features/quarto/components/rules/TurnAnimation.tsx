/**
 * Turn Animation - Interactive demo of the give-place-select turn mechanic
 * @module features/quarto/components/rules/TurnAnimation
 */

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useTurnAnimation } from '../../hooks/useTurnAnimation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Piece3D } from '../Piece3D';
import { getPieceById } from '../../utils/pieceAttributes';
import type { Player, TurnPhase } from './data/types';

/**
 * Player colors and labels
 */
const PLAYER_STYLES = {
  A: {
    color: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500',
    label: 'Player A',
  },
  B: {
    color: 'from-orange-500 to-amber-500',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500',
    label: 'Player B',
  },
} as const;

/**
 * Phase labels and icons
 */
const PHASE_INFO = {
  give: { label: 'Giving', icon: '🤲' },
  receive: { label: 'Receiving', icon: '🤲' },
  place: { label: 'Placing', icon: '📍' },
  select: { label: 'Selecting', icon: '👆' },
} as const;

/**
 * 3D Piece Pool - Shows all 16 pieces with dimming for used pieces
 */
function PiecePool3D({
  usedPieceIds,
  activePieceId,
  phase,
}: {
  usedPieceIds: number[];
  activePieceId: number | null;
  phase: TurnPhase;
}) {
  const cellSize = 0.6;
  const poolSize = 2.6;

  return (
    <group position={[0, 0, 0]}>
      {/* Pool background */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[poolSize, poolSize]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Grid of all 16 pieces */}
      {Array.from({ length: 16 }, (_, pieceId) => {
        const row = Math.floor(pieceId / 4);
        const col = pieceId % 4;
        const x = (col - 1.5) * cellSize;
        const z = (row - 1.5) * cellSize;

        const isUsed = usedPieceIds.includes(pieceId);
        const isActive = pieceId === activePieceId && phase === 'select';
        const piece = getPieceById(pieceId);

        if (!piece) return null;

        return (
          <group key={pieceId}>
            {/* Highlight ring for active piece */}
            {isActive && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
                <ringGeometry args={[0.22, 0.28, 32]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#fbbf24"
                  emissiveIntensity={0.5}
                />
              </mesh>
            )}

            {/* Piece (dimmed if used) */}
            <group position={[x, 0.05, z]}>
              <Piece3D
                piece={piece}
                position={[0, 0, 0]}
                isSelected={isActive}
                isHovered={false}
                scale={0.7}
                opacity={isUsed ? 0.2 : 1}
              />
            </group>
          </group>
        );
      })}

      {/* "POOL" label */}
      <mesh position={[0, 0.01, poolSize / 2 + 0.2]}>
        <planeGeometry args={[1, 0.25]} />
        <meshBasicMaterial color="#334155" />
      </mesh>
    </group>
  );
}

/**
 * Mini board visualization for the animation
 */
function MiniBoard({
  boardState,
  activePosition,
  phase,
}: {
  boardState: (number | null)[];
  activePosition: number | null;
  phase: TurnPhase;
}) {
  const cellSize = 0.8;
  const boardSize = 3.5;

  return (
    <group position={[0, 0, 0]}>
      {/* Board surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[boardSize, boardSize]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={`grid-${i}`}>
          {/* Horizontal line */}
          <mesh position={[0, 0, (i - 2) * cellSize]}>
            <boxGeometry args={[boardSize, 0.02, 0.02]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Vertical line */}
          <mesh position={[(i - 2) * cellSize, 0, 0]}>
            <boxGeometry args={[0.02, 0.02, boardSize]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      ))}

      {/* Cell highlights and pieces */}
      {boardState.map((pieceId, pos) => {
        const row = Math.floor(pos / 4);
        const col = pos % 4;
        const x = (col - 1.5) * cellSize;
        const z = (row - 1.5) * cellSize;

        const isActive = pos === activePosition && phase === 'place';

        return (
          <group key={pos}>
            {/* Cell background */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
              <planeGeometry args={[cellSize * 0.9, cellSize * 0.9]} />
              <meshStandardMaterial
                color={isActive ? '#4CAF50' : '#2a2a2a'}
                opacity={isActive ? 0.8 : 0.5}
                transparent
              />
            </mesh>

            {/* Piece if present */}
            {pieceId !== null && (
              <Piece3D
                piece={getPieceById(pieceId)!}
                position={[x, 0.05, z]}
                isSelected={false}
                isHovered={false}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

/**
 * 3D Scene for the turn animation
 */
function TurnAnimationScene({
  boardState,
  heldPiece,
  phase,
  activePosition,
  usedPieceIds,
  activePieceId,
  isMobile,
}: {
  boardState: (number | null)[];
  heldPiece: number | null;
  phase: TurnPhase;
  activePosition: number | null;
  usedPieceIds: number[];
  activePieceId: number | null;
  isMobile: boolean;
}) {
  // Adjust camera for mobile (closer, wider FOV)
  const cameraPosition: [number, number, number] = isMobile ? [0, 6, 7] : [0, 8, 10];
  const cameraFov = isMobile ? 55 : 45;

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Piece Pool on the left */}
      <group position={[-3.2, 0, 0]}>
        <PiecePool3D
          usedPieceIds={usedPieceIds}
          activePieceId={activePieceId}
          phase={phase}
        />
      </group>

      {/* Board on the right */}
      <group position={[2, 0, 0]}>
        <MiniBoard
          boardState={boardState}
          activePosition={phase === 'place' ? activePosition : null}
          phase={phase}
        />
      </group>

      {/* Held piece in the middle during receive phase only */}
      {heldPiece !== null && phase === 'receive' && (
        <group position={[0, 1.5, 2]}>
          <Piece3D
            piece={getPieceById(heldPiece)!}
            position={[0, 0, 0]}
            isSelected
            isHovered={false}
          />
        </group>
      )}
    </>
  );
}

/**
 * Player indicator badge
 */
function PlayerBadge({ player, isActive }: { player: Player; isActive: boolean }) {
  const style = PLAYER_STYLES[player];

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-all ${
        isActive
          ? `bg-gradient-to-r ${style.color} text-white shadow-lg`
          : 'bg-slate-700 text-slate-400'
      }`}
    >
      <div
        className={`h-2.5 w-2.5 rounded-full ${
          isActive ? 'bg-white' : 'bg-slate-500'
        }`}
      />
      <span className="text-sm font-medium">{style.label}</span>
    </div>
  );
}

/**
 * Phase indicator
 */
function PhaseIndicator({ phase }: { phase: TurnPhase }) {
  const info = PHASE_INFO[phase];

  return (
    <motion.div
      key={phase}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 rounded-lg bg-slate-700/80 px-4 py-2"
    >
      <span className="text-lg">{info.icon}</span>
      <span className="text-sm font-medium text-white">{info.label}</span>
    </motion.div>
  );
}

/**
 * Step controls for manual navigation
 */
function StepControls({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onRestart,
}: {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className={`flex h-10 items-center gap-1 rounded-full px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isFirst
            ? 'cursor-not-allowed bg-slate-800 text-slate-600'
            : 'bg-slate-700 text-white hover:bg-slate-600'
        }`}
        aria-label="Previous step"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-sm">Previous</span>
      </button>
      <button
        onClick={onRestart}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Restart"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <button
        onClick={onNext}
        disabled={isLast}
        className={`flex h-10 items-center gap-1 rounded-full px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isLast
            ? 'cursor-not-allowed bg-slate-800 text-slate-600'
            : 'bg-amber-500 text-black hover:bg-amber-400'
        }`}
        aria-label="Next step"
      >
        <span className="text-sm">Next</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/**
 * Loading skeleton for the 3D canvas
 */
function TurnAnimationSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        <p className="text-sm text-slate-400">Loading animation...</p>
      </div>
    </div>
  );
}

/**
 * Static fallback for reduced motion users
 */
export function TurnAnimationStatic() {
  return (
    <div className="rounded-lg bg-slate-800/50 p-6">
      <div className="mb-4 text-center">
        <h3 className="mb-2 text-lg font-semibold text-white">Turn Sequence</h3>
        <p className="text-sm text-slate-400">
          Animation disabled due to reduced motion preference
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex items-start gap-4 rounded-lg bg-slate-700/50 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            1
          </div>
          <div>
            <p className="font-medium text-white">Give Phase</p>
            <p className="text-sm text-slate-400">
              Your opponent chooses a piece and gives it to you
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-4 rounded-lg bg-slate-700/50 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
            2
          </div>
          <div>
            <p className="font-medium text-white">Place Phase</p>
            <p className="text-sm text-slate-400">
              You place the piece on any empty square on the board
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-4 rounded-lg bg-slate-700/50 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            3
          </div>
          <div>
            <p className="font-medium text-white">Select Phase</p>
            <p className="text-sm text-slate-400">
              You choose the next piece to give to your opponent
            </p>
          </div>
        </div>

        {/* Arrow indicating cycle */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-400">
            <RotateCcw className="h-4 w-4" />
            <span>Then roles swap and repeat</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main TurnAnimation component
 */
export function TurnAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const animation = useTurnAnimation();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show static version for reduced motion
  if (prefersReducedMotion) {
    return <TurnAnimationStatic />;
  }

  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    boardState,
    heldPiece,
    usedPieceIds,
    activePieceId,
    nextStep,
    previousStep,
    restart,
  } = animation;

  return (
    <div className="space-y-4">
      {/* Player indicators */}
      <div className="flex items-center justify-between px-2">
        <PlayerBadge player="A" isActive={currentStep.activePlayer === 'A'} />
        <AnimatePresence mode="wait">
          <PhaseIndicator phase={currentStep.phase} />
        </AnimatePresence>
        <PlayerBadge player="B" isActive={currentStep.activePlayer === 'B'} />
      </div>

      {/* 3D Animation Canvas */}
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-800/50">
        <Suspense fallback={<TurnAnimationSkeleton />}>
          <Canvas>
            <TurnAnimationScene
              boardState={boardState}
              heldPiece={heldPiece}
              phase={currentStep.phase}
              activePosition={currentStep.position}
              usedPieceIds={usedPieceIds}
              activePieceId={activePieceId}
              isMobile={isMobile}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Step counter and Caption */}
      <div className="text-center">
        <div className="mb-1 text-xs font-medium text-slate-500">
          Step {currentStepIndex + 1} of {totalSteps}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-slate-300"
          >
            {currentStep.caption}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Step controls */}
      <StepControls
        currentStep={currentStepIndex}
        totalSteps={totalSteps}
        onPrevious={previousStep}
        onNext={nextStep}
        onRestart={restart}
      />
    </div>
  );
}

export default TurnAnimation;
