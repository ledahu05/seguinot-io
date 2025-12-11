/**
 * Piece Grid - Interactive 4x4 grid of all 16 Quarto pieces
 * @module features/quarto/components/rules/PieceGrid
 */

import { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Piece3D } from '../Piece3D';
import { PieceTooltip } from './PieceTooltip';
import { ALL_PIECES } from '../../utils/pieceAttributes';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * 3D scene containing all 16 pieces in a 4x4 grid
 */
function PieceGridScene({
  hoveredPiece,
  onPieceHover,
  onPieceClick,
}: {
  hoveredPiece: number | null;
  onPieceHover: (id: number | null) => void;
  onPieceClick: (id: number) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Grid positioning: 4x4 grid with spacing
  const spacing = 1.2;
  const offset = (3 * spacing) / 2; // Center the grid

  const getPiecePosition = (id: number): [number, number, number] => {
    const row = Math.floor(id / 4);
    const col = id % 4;
    return [col * spacing - offset, 0, row * spacing - offset];
  };

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 6]} fov={45} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate={!prefersReducedMotion}
        autoRotateSpeed={0.5}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* All 16 pieces */}
      {ALL_PIECES.map((piece) => (
        <Piece3D
          key={piece.id}
          piece={piece}
          position={getPiecePosition(piece.id)}
          isHovered={hoveredPiece === piece.id}
          onClick={() => onPieceClick(piece.id)}
          onPointerOver={() => onPieceHover(piece.id)}
          onPointerOut={() => onPieceHover(null)}
        />
      ))}
    </>
  );
}

/**
 * Loading skeleton for the 3D canvas
 */
function PieceGridSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        <p className="text-sm text-slate-400">Loading 3D pieces...</p>
      </div>
    </div>
  );
}

/**
 * PieceGrid component with tooltips on hover/tap
 */
export function PieceGrid() {
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handlePieceHover = useCallback((id: number | null) => {
    setHoveredPiece(id);
    if (id !== null) {
      setSelectedPiece(id);
      setTooltipOpen(true);
    }
  }, []);

  const handlePieceClick = useCallback((id: number) => {
    // Toggle tooltip on click (for mobile)
    if (selectedPiece === id && tooltipOpen) {
      setTooltipOpen(false);
      setSelectedPiece(null);
    } else {
      setSelectedPiece(id);
      setTooltipOpen(true);
    }
  }, [selectedPiece, tooltipOpen]);

  const handlePointerLeave = useCallback(() => {
    setHoveredPiece(null);
    // Don't close tooltip on pointer leave - only on click elsewhere
  }, []);

  const currentPiece = selectedPiece !== null ? ALL_PIECES[selectedPiece] : null;

  return (
    <div className="relative">
      {/* 3D Canvas */}
      <div
        className="aspect-square w-full overflow-hidden rounded-lg bg-slate-800/50"
        onPointerLeave={handlePointerLeave}
      >
        <Suspense fallback={<PieceGridSkeleton />}>
          <Canvas shadows>
            <PieceGridScene
              hoveredPiece={hoveredPiece}
              onPieceHover={handlePieceHover}
              onPieceClick={handlePieceClick}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Tooltip overlay (positioned at bottom of canvas) */}
      {currentPiece && tooltipOpen && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform">
          <PieceTooltip piece={currentPiece} />
        </div>
      )}

      {/* Hint text */}
      <p className="mt-3 text-center text-xs text-slate-500 sm:text-sm">
        {tooltipOpen
          ? 'Click another piece or click away to close'
          : 'Hover over or tap a piece to see its attributes'}
      </p>
    </div>
  );
}
