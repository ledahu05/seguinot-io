import { useMemo } from 'react';
import { Piece3D } from './Piece3D';
import type { Piece } from '../types/quarto.types';

interface PieceTrayProps {
    availablePieces: Piece[];
    selectedPieceId?: number | null;
    onPieceSelect?: (pieceId: number) => void;
    disabled?: boolean;
    focusedIndex?: number | null;
    layout?: 'side' | 'bottom'; // Support both layouts for flexibility
}

// Layout constants for bottom-centered layout (2 rows of 8)
const PIECES_PER_ROW_BOTTOM = 8;
const PIECE_SPACING_BOTTOM = 1.0;

// Layout constants for side layout (legacy, 4x4 grid)
const PIECES_PER_ROW_SIDE = 4;
const PIECE_SPACING_SIDE = 1.2;
const TRAY_OFFSET_X_SIDE = 5;

export function PieceTray({
    availablePieces,
    selectedPieceId,
    onPieceSelect,
    disabled = false,
    focusedIndex = null,
    layout = 'bottom'
}: PieceTrayProps) {
    // Calculate position for each piece in the tray
    const getPiecePosition = (index: number): [number, number, number] => {
        if (layout === 'bottom') {
            // Bottom layout: 2 rows of 8, centered at origin
            const row = Math.floor(index / PIECES_PER_ROW_BOTTOM);
            const col = index % PIECES_PER_ROW_BOTTOM;
            const x = (col - 3.5) * PIECE_SPACING_BOTTOM; // Center 8 pieces
            const z = (row - 0.5) * PIECE_SPACING_BOTTOM; // 2 rows
            return [x, 0, z];
        } else {
            // Side layout (legacy): 4x4 grid to the right
            const row = Math.floor(index / PIECES_PER_ROW_SIDE);
            const col = index % PIECES_PER_ROW_SIDE;
            const x = TRAY_OFFSET_X_SIDE + (col - 1.5) * PIECE_SPACING_SIDE;
            const z = (row - 1.5) * PIECE_SPACING_SIDE;
            return [x, 0, z];
        }
    };

    const pieceElements = useMemo(() => {
        return availablePieces.map((piece, index) => {
            const position = getPiecePosition(index);
            const isSelected = piece.id === selectedPieceId;
            const isFocused = index === focusedIndex;

            return (
                <Piece3D
                    key={`tray-piece-${piece.id}`}
                    piece={piece}
                    position={position}
                    isSelected={isSelected}
                    isFocused={isFocused}
                    onClick={
                        disabled ? undefined : () => onPieceSelect?.(piece.id)
                    }
                />
            );
        });
    }, [availablePieces, selectedPieceId, onPieceSelect, disabled, focusedIndex, layout]);

    return <group>{pieceElements}</group>;
}

export default PieceTray;
