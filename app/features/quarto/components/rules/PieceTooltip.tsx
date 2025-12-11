/**
 * Piece Tooltip - Displays piece attributes in a tooltip
 * @module features/quarto/components/rules/PieceTooltip
 */

import type { Piece } from '../../types/quarto.types';

interface PieceTooltipProps {
  piece: Piece;
}

/**
 * Attribute display with icon/label
 */
function AttributeRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="flex items-center gap-1 font-medium capitalize text-white">
        <span>{icon}</span>
        <span>{value}</span>
      </span>
    </div>
  );
}

/**
 * Tooltip content showing all 4 piece attributes
 */
export function PieceTooltip({ piece }: PieceTooltipProps) {
  // Attribute icons (simple emoji for now)
  const icons = {
    color: piece.color === 'light' ? '☀️' : '🌙',
    shape: piece.shape === 'round' ? '⚪' : '⬜',
    top: piece.top === 'solid' ? '🔵' : '⭕',
    height: piece.height === 'tall' ? '📏' : '📐',
  };

  return (
    <div className="min-w-[140px] rounded-lg bg-slate-800 p-3 shadow-xl ring-1 ring-slate-700">
      <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-amber-400">
        Piece #{piece.id}
      </div>
      <div className="space-y-1.5 text-sm">
        <AttributeRow label="Color" value={piece.color} icon={icons.color} />
        <AttributeRow label="Shape" value={piece.shape} icon={icons.shape} />
        <AttributeRow label="Top" value={piece.top} icon={icons.top} />
        <AttributeRow label="Height" value={piece.height} icon={icons.height} />
      </div>
    </div>
  );
}
