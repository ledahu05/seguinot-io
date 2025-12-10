import { useMemo } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import { Piece3D } from './Piece3D';
import type { Board } from '../types/quarto.types';
import { getPieceById } from '../utils/pieceAttributes';
import { positionToCoords } from '../utils/winDetection';

interface Board3DProps {
  board: Board;
  onPositionClick?: (position: number) => void;
  onPositionHover?: (position: number | null) => void;
  selectedPosition?: number | null;
  hoveredPosition?: number | null;
  focusedPosition?: number | null;
  winningLine?: number[] | null;
}

// Board dimensions
const BOARD_SIZE = 4.5;
const BOARD_THICKNESS = 0.3;
const CELL_SIZE = 1.0;
const INDENT_DEPTH = 0.08;
const INDENT_RADIUS = 0.42;

// Colors
const BOARD_COLOR = '#1a1a1a'; // Dark black
const BOARD_DARK_COLOR = '#0a0a0a'; // Darker black for accents
const INDENT_COLOR = '#2a2a2a'; // Charcoal for cell indents
const WINNING_HIGHLIGHT = '#FFD700'; // Gold for winning positions
const FOCUS_HIGHLIGHT = '#00BFFF'; // Cyan for keyboard focus

export function Board3D({
  board,
  onPositionClick,
  onPositionHover,
  selectedPosition,
  hoveredPosition,
  focusedPosition,
  winningLine,
}: Board3DProps) {
  // Calculate 3D position from board position index
  const getPositionCoords = (position: number): [number, number, number] => {
    const { row, col } = positionToCoords(position);
    const x = (col - 1.5) * CELL_SIZE;
    const z = (row - 1.5) * CELL_SIZE;
    return [x, BOARD_THICKNESS / 2 + 0.01, z];
  };

  // Check if position is in winning line
  const isWinningPosition = (position: number): boolean => {
    return winningLine?.includes(position) ?? false;
  };

  // Render the board surface with indentations
  const boardMesh = useMemo(() => {
    return (
      <group>
        {/* Main board surface */}
        <Box args={[BOARD_SIZE, BOARD_THICKNESS, BOARD_SIZE]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={BOARD_COLOR}
            roughness={0.6}
            metalness={0.1}
          />
        </Box>

        {/* Board border/frame */}
        <Box args={[BOARD_SIZE + 0.2, BOARD_THICKNESS + 0.1, BOARD_SIZE + 0.2]} position={[0, -0.05, 0]}>
          <meshStandardMaterial
            color={BOARD_DARK_COLOR}
            roughness={0.7}
            metalness={0.05}
          />
        </Box>
      </group>
    );
  }, []);

  // Render cell indentations (where pieces sit)
  const cellIndentations = useMemo(() => {
    const indents = [];

    for (let pos = 0; pos < 16; pos++) {
      const [x, , z] = getPositionCoords(pos);
      const isWinning = isWinningPosition(pos);

      indents.push(
        <Cylinder
          key={`indent-${pos}`}
          args={[INDENT_RADIUS, INDENT_RADIUS, INDENT_DEPTH, 32]}
          position={[x, BOARD_THICKNESS / 2 - INDENT_DEPTH / 2 + 0.01, z]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={isWinning ? WINNING_HIGHLIGHT : INDENT_COLOR}
            roughness={0.8}
            metalness={0.05}
            emissive={isWinning ? WINNING_HIGHLIGHT : '#000000'}
            emissiveIntensity={isWinning ? 0.3 : 0}
          />
        </Cylinder>
      );
    }

    return indents;
  }, [winningLine]);

  // Render clickable zones for empty positions
  const clickableZones = useMemo(() => {
    const zones = [];

    for (let pos = 0; pos < 16; pos++) {
      // Only render clickable zone for empty positions
      if (board.positions[pos] !== null) continue;

      const [x, y, z] = getPositionCoords(pos);
      const isHovered = hoveredPosition === pos;
      const isSelected = selectedPosition === pos;
      const isFocused = focusedPosition === pos;
      const isHighlighted = isHovered || isSelected || isFocused;

      // Determine color based on state priority: focused > hovered/selected
      const zoneColor = isFocused ? FOCUS_HIGHLIGHT : (isHovered || isSelected ? '#4CAF50' : INDENT_COLOR);

      zones.push(
        <Cylinder
          key={`zone-${pos}`}
          args={[INDENT_RADIUS - 0.02, INDENT_RADIUS - 0.02, 0.02, 32]}
          position={[x, y + 0.02, z]}
          onClick={() => onPositionClick?.(pos)}
          onPointerOver={() => onPositionHover?.(pos)}
          onPointerOut={() => onPositionHover?.(null)}
        >
          <meshStandardMaterial
            color={zoneColor}
            roughness={0.9}
            metalness={0}
            transparent
            opacity={isHighlighted ? 0.6 : 0}
          />
        </Cylinder>
      );
    }

    return zones;
  }, [board.positions, hoveredPosition, selectedPosition, focusedPosition, onPositionClick, onPositionHover]);

  // Render placed pieces
  const placedPieces = useMemo(() => {
    const pieces = [];

    for (let pos = 0; pos < 16; pos++) {
      const pieceId = board.positions[pos];
      if (pieceId === null) continue;

      const piece = getPieceById(pieceId);
      if (!piece) continue;

      const [x, , z] = getPositionCoords(pos);
      const isWinning = isWinningPosition(pos);

      pieces.push(
        <Piece3D
          key={`piece-${pos}-${pieceId}`}
          piece={piece}
          position={[x, BOARD_THICKNESS / 2, z]}
          isSelected={isWinning}
          isHovered={false}
        />
      );
    }

    return pieces;
  }, [board.positions, winningLine]);

  return (
    <group>
      {boardMesh}
      {cellIndentations}
      {clickableZones}
      {placedPieces}
    </group>
  );
}

export default Board3D;
