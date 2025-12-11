/**
 * Board With Overlays - Empty board with toggleable winning line visualization
 * @module features/quarto/components/rules/BoardWithOverlays
 */

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { WINNING_LINES_CONFIG } from './data/winningLines';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { WinningLineCategory } from './data/types';

/**
 * Category colors for winning lines
 */
const CATEGORY_COLORS: Record<WinningLineCategory, string> = {
  row: '#3b82f6', // blue
  column: '#22c55e', // green
  diagonal: '#f59e0b', // amber
};

/**
 * 3D scene for the board
 */
function BoardScene() {
  const cellSize = 0.9;
  const boardSize = 4;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 4]} fov={45} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Board surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[boardSize, boardSize]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Board frame */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[boardSize + 0.2, boardSize + 0.2]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Grid cells */}
      {Array.from({ length: 16 }).map((_, pos) => {
        const row = Math.floor(pos / 4);
        const col = pos % 4;
        const x = (col - 1.5) * cellSize;
        const z = (row - 1.5) * cellSize;

        return (
          <mesh key={pos} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
            <circleGeometry args={[cellSize * 0.4, 32]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        );
      })}
    </>
  );
}

/**
 * Loading skeleton
 */
function BoardSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-800/50">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
    </div>
  );
}

/**
 * SVG Overlay for winning lines
 */
function WinningLinesOverlay({
  showLines,
  prefersReducedMotion,
}: {
  showLines: boolean;
  prefersReducedMotion: boolean;
}) {
  if (!showLines) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ padding: '8%' }}
    >
      <AnimatePresence>
        {WINNING_LINES_CONFIG.map((line, index) => (
          <motion.path
            key={line.id}
            d={line.svgPath}
            stroke={CATEGORY_COLORS[line.category]}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={prefersReducedMotion ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { pathLength: 1, opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    pathLength: {
                      delay: index * 0.1,
                      duration: 0.4,
                      ease: 'easeInOut',
                    },
                    opacity: { delay: index * 0.1, duration: 0.2 },
                  }
            }
          />
        ))}
      </AnimatePresence>
    </svg>
  );
}

/**
 * Legend for winning line categories
 */
function LineLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-blue-500" />
        <span className="text-slate-400">Rows (4)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-green-500" />
        <span className="text-slate-400">Columns (4)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-amber-500" />
        <span className="text-slate-400">Diagonals (2)</span>
      </div>
    </div>
  );
}

/**
 * BoardWithOverlays component
 */
export function BoardWithOverlays() {
  const [showLines, setShowLines] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-4">
      {/* Toggle button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowLines(!showLines)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            showLines
              ? 'bg-amber-500 text-black'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          aria-pressed={showLines}
          aria-label={showLines ? 'Hide winning lines overlay' : 'Show winning lines overlay'}
        >
          {showLines ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Hide Winning Lines</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Show Winning Lines</span>
            </>
          )}
        </button>
      </div>

      {/* Board with overlay */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-800/50">
        <Suspense fallback={<BoardSkeleton />}>
          <Canvas>
            <BoardScene />
          </Canvas>
        </Suspense>

        {/* SVG overlay */}
        <WinningLinesOverlay
          showLines={showLines}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      {/* Legend */}
      {showLines && <LineLegend />}

      {/* Count info */}
      <p className="text-center text-sm text-slate-400">
        {showLines
          ? '10 possible winning lines total'
          : 'Press the button to see all 10 winning lines'}
      </p>
    </div>
  );
}

export default BoardWithOverlays;
