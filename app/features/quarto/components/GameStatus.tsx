import type { Player, TurnPhase, GameStatus as GameStatusType } from '../types/quarto.types';

interface GameStatusProps {
  status: GameStatusType;
  phase: TurnPhase;
  currentPlayer: Player | null;
  winner: Player | null;
  isDraw: boolean;
  isAIThinking: boolean;
  selectedPieceName?: string;
}

export function GameStatus({
  status,
  phase,
  currentPlayer,
  winner,
  isDraw,
  isAIThinking,
  selectedPieceName,
}: GameStatusProps) {
  // Game finished state
  if (status === 'finished') {
    if (isDraw) {
      return (
        <div className="rounded-lg bg-yellow-500/20 p-3 text-center sm:p-4">
          <h2 className="text-xl font-bold text-yellow-400 sm:text-2xl">Draw!</h2>
          <p className="mt-2 text-sm text-yellow-200 sm:text-base">The board is full with no Quarto.</p>
        </div>
      );
    }

    if (winner) {
      return (
        <div className="rounded-lg bg-green-500/20 p-3 text-center sm:p-4">
          <h2 className="text-xl font-bold text-green-400 sm:text-2xl">Quarto!</h2>
          <p className="mt-2 text-sm text-green-200 sm:text-base">{winner.name} wins!</p>
        </div>
      );
    }
  }

  // Waiting for opponent (online mode)
  if (status === 'waiting') {
    return (
      <div className="rounded-lg bg-blue-500/20 p-3 text-center sm:p-4">
        <h2 className="text-lg font-bold text-blue-400 sm:text-xl">Waiting for opponent...</h2>
        <p className="mt-2 text-sm text-blue-200">Share the room code to invite a friend.</p>
      </div>
    );
  }

  // AI thinking state
  if (isAIThinking) {
    return (
      <div className="rounded-lg bg-purple-500/20 p-3 text-center sm:p-4">
        <h2 className="text-lg font-bold text-purple-400 sm:text-xl">AI is thinking...</h2>
        <div className="mt-2 flex justify-center">
          <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]" />
          <div className="mx-1 h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400" />
        </div>
      </div>
    );
  }

  // Active game state
  return (
    <div className="rounded-lg bg-slate-700/50 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 sm:text-sm">Current Turn</span>
          <h2 className="text-lg font-bold text-white sm:text-xl">{currentPlayer?.name ?? 'Unknown'}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 sm:text-sm">Phase</span>
          <h3 className="text-base font-semibold capitalize text-amber-400 sm:text-lg">{phase}</h3>
        </div>
      </div>

      {phase === 'selecting' && (
        <p className="mt-2 text-xs text-slate-300 sm:mt-3 sm:text-sm">
          Select a piece to give to your opponent.
        </p>
      )}

      {phase === 'placing' && selectedPieceName && (
        <p className="mt-2 text-xs text-slate-300 sm:mt-3 sm:text-sm">
          Place the <span className="font-semibold text-amber-400">{selectedPieceName}</span> piece on the board.
        </p>
      )}

      {phase === 'placing' && !selectedPieceName && (
        <p className="mt-2 text-xs text-slate-300 sm:mt-3 sm:text-sm">
          Place the selected piece on an empty position.
        </p>
      )}
    </div>
  );
}

export default GameStatus;
