/**
 * Example Board - Static board display with winning line highlight
 * @module features/quarto/components/rules/ExampleBoard
 */

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CheckCircle, XCircle } from 'lucide-react';
import { Piece3D } from '../Piece3D';
import { getPieceById } from '../../utils/pieceAttributes';
import type { ExampleBoardConfig } from './data/types';

/**
 * 3D scene for the example board
 */
function ExampleBoardScene({
  positions,
  highlightLine,
  isWin,
}: {
  positions: (number | null)[];
  highlightLine?: number[];
  isWin: boolean;
}) {
  const cellSize = 0.9;
  const boardSize = 4;

  // Calculate position coordinates
  const getPositionCoords = (pos: number): [number, number, number] => {
    const row = Math.floor(pos / 4);
    const col = pos % 4;
    const x = (col - 1.5) * cellSize;
    const z = (row - 1.5) * cellSize;
    return [x, 0.1, z];
  };

  // Check if position is in highlight line
  const isHighlighted = (pos: number): boolean => {
    return highlightLine?.includes(pos) ?? false;
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 4]} fov={45} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
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

      {/* Grid and cells */}
      {Array.from({ length: 16 }).map((_, pos) => {
        const [x, , z] = getPositionCoords(pos);
        const highlighted = isHighlighted(pos);
        const pieceId = positions[pos];
        const piece = pieceId !== null ? getPieceById(pieceId) : null;

        return (
          <group key={pos}>
            {/* Cell circle */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
              <circleGeometry args={[cellSize * 0.4, 32]} />
              <meshStandardMaterial
                color={highlighted ? (isWin ? '#FFD700' : '#ef4444') : '#333'}
                emissive={highlighted ? (isWin ? '#FFD700' : '#ef4444') : '#000'}
                emissiveIntensity={highlighted ? 0.3 : 0}
              />
            </mesh>

            {/* Piece if present */}
            {piece && (
              <Piece3D
                piece={piece}
                position={[x, 0.05, z]}
                isSelected={false}
                isHovered={false}
              />
            )}
          </group>
        );
      })}

      {/* Winning line overlay (SVG-style line) */}
      {highlightLine && highlightLine.length === 4 && isWin && (
        <WinningLineOverlay
          positions={highlightLine.map(getPositionCoords)}
        />
      )}
    </>
  );
}

/**
 * 3D line connecting winning positions
 */
function WinningLineOverlay({
  positions,
}: {
  positions: [number, number, number][];
}) {
  const points = useMemo(() => {
    if (positions.length < 2) return null;
    const start = positions[0];
    const end = positions[positions.length - 1];
    return { start, end };
  }, [positions]);

  if (!points) return null;

  const { start, end } = points;
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)
  );
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <mesh position={[midX, 1.5, midZ]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length + 0.5, 0.05, 0.1]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/**
 * Loading skeleton
 */
function ExampleBoardSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-800/50">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
    </div>
  );
}

/**
 * ExampleBoard component with caption
 */
export function ExampleBoard({ config }: { config: ExampleBoardConfig }) {
  return (
    <div className="overflow-hidden rounded-lg bg-slate-800/30">
      {/* Title and status */}
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2">
        <h4 className="font-medium text-white">{config.title}</h4>
        {config.isWin ? (
          <div className="flex items-center gap-1 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Win!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-red-400">
            <XCircle className="h-4 w-4" />
            <span>Not a win</span>
          </div>
        )}
      </div>

      {/* 3D Board */}
      <div className="aspect-square">
        <Suspense fallback={<ExampleBoardSkeleton />}>
          <Canvas>
            <ExampleBoardScene
              positions={config.positions}
              highlightLine={config.highlightLine}
              isWin={config.isWin}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Caption */}
      <div className="border-t border-slate-700 px-3 py-2">
        <p className="text-sm text-slate-300">{config.caption}</p>
      </div>
    </div>
  );
}

export default ExampleBoard;
