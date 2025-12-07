import { useMemo } from 'react';
import { Piece3D } from './Piece3D';
import type { Piece } from '../types/quarto.types';

interface PieceTrayProps {
    availablePieces: Piece[];
    selectedPieceId?: number | null;
    onPieceSelect?: (pieceId: number) => void;
    disabled?: boolean;
    focusedIndex?: number | null;
}

// Layout constants
const PIECES_PER_ROW = 4;
const PIECE_SPACING = 1.2;
const TRAY_OFFSET_X = 5; // Offset from board center
const TRAY_OFFSET_Z = 0;

export function PieceTray({
    availablePieces,
    selectedPieceId,
    onPieceSelect,
    disabled = false,
    focusedIndex = null
}: PieceTrayProps) {
    // Calculate position for each piece in the tray
    const getPiecePosition = (index: number): [number, number, number] => {
        const row = Math.floor(index / PIECES_PER_ROW);
        const col = index % PIECES_PER_ROW;

        const x = TRAY_OFFSET_X + (col - 1.5) * PIECE_SPACING;
        const z = TRAY_OFFSET_Z + (row - 1.5) * PIECE_SPACING;

        return [x, 0, z];
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
    }, [availablePieces, selectedPieceId, onPieceSelect, disabled, focusedIndex]);

    return <group>{pieceElements}</group>;
}

export default PieceTray;
