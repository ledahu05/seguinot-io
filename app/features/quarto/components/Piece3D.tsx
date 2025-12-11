import { useRef, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Cylinder, Box, Sphere, Torus, Ring } from '@react-three/drei';
import * as THREE from 'three';
import type { Piece } from '../types/quarto.types';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Piece3DProps {
  piece: Piece;
  position: [number, number, number];
  isSelected?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  /** Custom scale factor (default: 1) */
  scale?: number;
  /** Opacity for dimmed/used pieces (default: 1) */
  opacity?: number;
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
const HOLLOW_DEPTH_RATIO = 0.7; // Hollow depth as ratio of piece height
const HOLLOW_RADIUS_MULT = 0.8; // Wider opening (was 0.6)
const HOLLOW_COLOR_MULT = 0.35; // Darker interior (was 0.6)

// Ring constants for tall pieces
const RING_INNER_RADIUS = BASE_RADIUS + 0.02;
const RING_TUBE_RADIUS = 0.03;

export function Piece3D({
  piece,
  position,
  isSelected = false,
  isHovered = false,
  isFocused = false,
  onClick,
  onPointerOver,
  onPointerOut,
  scale: customScale = 1,
  opacity = 1,
}: Piece3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useReducedMotion();

  // Animation for selection/hover/focus states
  // With reduced motion, use instant transitions
  const baseScale = isSelected ? 1.15 : (isHovered || isFocused) ? 1.05 : 1;
  const { scale, positionY } = useSpring({
    scale: baseScale * customScale,
    positionY: isSelected ? position[1] + 0.2 : (isFocused ? position[1] + 0.1 : position[1]),
    config: prefersReducedMotion
      ? { tension: 1000, friction: 100 } // Instant transition
      : { tension: 300, friction: 20 },   // Smooth animation
    immediate: prefersReducedMotion,
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
        transparent={opacity < 1}
        opacity={opacity}
      />
    );
  }, [color, isSelected, isHovered, isFocused, opacity]);

  // Hollow interior material
  const hollowMaterial = useMemo(() => {
    return (
      <meshStandardMaterial
        color={new THREE.Color(color).multiplyScalar(HOLLOW_COLOR_MULT).getStyle()}
        roughness={0.9}
        metalness={0.0}
        transparent={opacity < 1}
        opacity={opacity}
      />
    );
  }, [color, opacity]);

  // Render decorative rings for tall pieces
  const renderTallRings = () => {
    if (piece.height !== 'tall') return null;

    return (
      <>
        <Torus
          args={[RING_INNER_RADIUS, RING_TUBE_RADIUS, 8, 32]}
          position={[0, height * 0.33, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          {material}
        </Torus>
        <Torus
          args={[RING_INNER_RADIUS, RING_TUBE_RADIUS, 8, 32]}
          position={[0, height * 0.66, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          {material}
        </Torus>
      </>
    );
  };

  // Render the piece geometry based on attributes
  const renderPieceGeometry = () => {
    if (isRound) {
      // Cylindrical piece
      const innerRadius = BASE_RADIUS * HOLLOW_RADIUS_MULT;
      const hollowDepth = height * HOLLOW_DEPTH_RATIO;
      const wallThickness = BASE_RADIUS - innerRadius;
      const solidBaseHeight = height - hollowDepth;

      if (isHollow) {
        return (
          <group>
            {/* Solid base cylinder (bottom part) */}
            <Cylinder
              args={[BASE_RADIUS, BASE_RADIUS, solidBaseHeight, 32]}
              position={[0, solidBaseHeight / 2, 0]}
            >
              {material}
            </Cylinder>

            {/* Outer wall of hollow section */}
            <Cylinder
              args={[BASE_RADIUS, BASE_RADIUS, hollowDepth, 32, 1, true]}
              position={[0, solidBaseHeight + hollowDepth / 2, 0]}
            >
              {material}
            </Cylinder>

            {/* Inner wall of hollow section (backside visible) */}
            <Cylinder
              args={[innerRadius, innerRadius, hollowDepth, 32, 1, true]}
              position={[0, solidBaseHeight + hollowDepth / 2, 0]}
            >
              <meshStandardMaterial
                color={new THREE.Color(color).multiplyScalar(HOLLOW_COLOR_MULT).getStyle()}
                roughness={0.9}
                metalness={0}
                side={THREE.BackSide}
              />
            </Cylinder>

            {/* Top rim ring */}
            <Ring
              args={[innerRadius, BASE_RADIUS, 32]}
              position={[0, solidBaseHeight + hollowDepth, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {material}
            </Ring>

            {/* Bottom of the hollow (floor) */}
            <Ring
              args={[0, innerRadius, 32]}
              position={[0, solidBaseHeight + 0.001, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {hollowMaterial}
            </Ring>

            {/* Decorative rings for tall pieces */}
            {renderTallRings()}
          </group>
        );
      }

      return (
        <group>
          {/* Main cylinder body */}
          <Cylinder args={[BASE_RADIUS, BASE_RADIUS, height, 32]} position={[0, height / 2, 0]}>
            {material}
          </Cylinder>

          {/* Solid top (dome) */}
          <Sphere
            args={[BASE_RADIUS, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
            position={[0, height, 0]}
          >
            {material}
          </Sphere>

          {/* Decorative rings for tall pieces */}
          {renderTallRings()}
        </group>
      );
    } else {
      // Square/rectangular piece
      const size = BASE_RADIUS * 1.6;
      const innerSize = size * HOLLOW_RADIUS_MULT;
      const hollowDepth = height * HOLLOW_DEPTH_RATIO;
      const wallThickness = (size - innerSize) / 2;
      const solidBaseHeight = height - hollowDepth;

      if (isHollow) {
        return (
          <group>
            {/* Solid base box (bottom part) */}
            <Box
              args={[size, solidBaseHeight, size]}
              position={[0, solidBaseHeight / 2, 0]}
            >
              {material}
            </Box>

            {/* Four walls for the hollow top */}
            {/* Front wall */}
            <Box
              args={[size, hollowDepth, wallThickness]}
              position={[0, solidBaseHeight + hollowDepth / 2, (size - wallThickness) / 2]}
            >
              {material}
            </Box>
            {/* Back wall */}
            <Box
              args={[size, hollowDepth, wallThickness]}
              position={[0, solidBaseHeight + hollowDepth / 2, -(size - wallThickness) / 2]}
            >
              {material}
            </Box>
            {/* Left wall */}
            <Box
              args={[wallThickness, hollowDepth, innerSize]}
              position={[-(size - wallThickness) / 2, solidBaseHeight + hollowDepth / 2, 0]}
            >
              {material}
            </Box>
            {/* Right wall */}
            <Box
              args={[wallThickness, hollowDepth, innerSize]}
              position={[(size - wallThickness) / 2, solidBaseHeight + hollowDepth / 2, 0]}
            >
              {material}
            </Box>

            {/* Bottom of the hollow (floor) */}
            <Box
              args={[innerSize, 0.01, innerSize]}
              position={[0, solidBaseHeight + 0.005, 0]}
            >
              {hollowMaterial}
            </Box>

            {/* Decorative rings for tall pieces */}
            {renderTallRings()}
          </group>
        );
      }

      return (
        <group>
          {/* Main box body */}
          <Box args={[size, height, size]} position={[0, height / 2, 0]}>
            {material}
          </Box>

          {/* Solid top (slight pyramid/cap) */}
          <Box args={[size * 0.95, 0.08, size * 0.95]} position={[0, height + 0.04, 0]}>
            {material}
          </Box>

          {/* Decorative rings for tall pieces */}
          {renderTallRings()}
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
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {renderPieceGeometry()}
    </animated.group>
  );
}

export default Piece3D;
