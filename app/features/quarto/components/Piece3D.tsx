import { useRef, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Cylinder, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { Piece } from '../types/quarto.types';

interface Piece3DProps {
  piece: Piece;
  position: [number, number, number];
  isSelected?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

// Color constants - wood-like tones
const LIGHT_WOOD = '#D4A574'; // Light maple
const DARK_WOOD = '#5D3A1A';  // Dark walnut
const HIGHLIGHT_COLOR = '#FFD700'; // Gold highlight for selection
const FOCUS_COLOR = '#00BFFF'; // Cyan for keyboard focus
const HOVER_EMISSIVE = '#444444';

// Size constants
const BASE_RADIUS = 0.35;
const SHORT_HEIGHT = 0.6;
const TALL_HEIGHT = 1.0;
const HOLLOW_DEPTH = 0.2;

export function Piece3D({
  piece,
  position,
  isSelected = false,
  isHovered = false,
  isFocused = false,
  onClick,
  onPointerOver,
  onPointerOut,
}: Piece3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Animation for selection/hover/focus states
  const { scale, positionY } = useSpring({
    scale: isSelected ? 1.15 : (isHovered || isFocused) ? 1.05 : 1,
    positionY: isSelected ? position[1] + 0.2 : (isFocused ? position[1] + 0.1 : position[1]),
    config: { tension: 300, friction: 20 },
  });

  // Derive piece properties
  const height = piece.height === 'tall' ? TALL_HEIGHT : SHORT_HEIGHT;
  const color = piece.color === 'light' ? LIGHT_WOOD : DARK_WOOD;
  const isRound = piece.shape === 'round';
  const isHollow = piece.top === 'hollow';

  // Determine emissive color and intensity based on state
  const getEmissiveProps = () => {
    if (isSelected) return { emissive: HIGHLIGHT_COLOR, intensity: 0.3 };
    if (isFocused) return { emissive: FOCUS_COLOR, intensity: 0.25 };
    if (isHovered) return { emissive: HOVER_EMISSIVE, intensity: 0.1 };
    return { emissive: HOVER_EMISSIVE, intensity: 0 };
  };

  // Memoized material
  const material = useMemo(() => {
    const { emissive, intensity } = getEmissiveProps();
    return (
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.1}
        emissive={emissive}
        emissiveIntensity={intensity}
      />
    );
  }, [color, isSelected, isHovered, isFocused]);

  // Render the piece geometry based on attributes
  const renderPieceGeometry = () => {
    if (isRound) {
      // Cylindrical piece
      return (
        <group>
          {/* Main cylinder body */}
          <Cylinder args={[BASE_RADIUS, BASE_RADIUS, height, 32]} position={[0, height / 2, 0]}>
            {material}
          </Cylinder>

          {/* Hollow top (indentation) */}
          {isHollow && (
            <Cylinder
              args={[BASE_RADIUS * 0.6, BASE_RADIUS * 0.6, HOLLOW_DEPTH, 32]}
              position={[0, height - HOLLOW_DEPTH / 2 + 0.01, 0]}
            >
              <meshStandardMaterial
                color={new THREE.Color(color).multiplyScalar(0.6).getStyle()}
                roughness={0.8}
                metalness={0.05}
              />
            </Cylinder>
          )}

          {/* Solid top (dome) */}
          {!isHollow && (
            <Sphere
              args={[BASE_RADIUS, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
              position={[0, height, 0]}
            >
              {material}
            </Sphere>
          )}
        </group>
      );
    } else {
      // Square/rectangular piece
      const size = BASE_RADIUS * 1.6;

      return (
        <group>
          {/* Main box body */}
          <Box args={[size, height, size]} position={[0, height / 2, 0]}>
            {material}
          </Box>

          {/* Hollow top (square indentation) */}
          {isHollow && (
            <Box
              args={[size * 0.6, HOLLOW_DEPTH, size * 0.6]}
              position={[0, height - HOLLOW_DEPTH / 2 + 0.01, 0]}
            >
              <meshStandardMaterial
                color={new THREE.Color(color).multiplyScalar(0.6).getStyle()}
                roughness={0.8}
                metalness={0.05}
              />
            </Box>
          )}

          {/* Solid top (slight pyramid/cap) */}
          {!isHollow && (
            <Box args={[size * 0.95, 0.08, size * 0.95]} position={[0, height + 0.04, 0]}>
              {material}
            </Box>
          )}
        </group>
      );
    }
  };

  return (
    <animated.group
      ref={groupRef}
      position-x={position[0]}
      position-y={positionY}
      position-z={position[2]}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {renderPieceGeometry()}
    </animated.group>
  );
}

export default Piece3D;
