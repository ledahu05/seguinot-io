interface GameControlsProps {
  canCallQuarto: boolean;
  onCallQuarto: () => void;
  onNewGame: () => void;
  onQuit: () => void;
  isGameOver: boolean;
  disabled?: boolean;
}

export function GameControls({
  canCallQuarto,
  onCallQuarto,
  onNewGame,
  onQuit,
  isGameOver,
  disabled = false,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {!isGameOver && (
        <button
          onClick={onCallQuarto}
          disabled={disabled || !canCallQuarto}
          className={`rounded-lg px-4 py-2 text-base font-bold uppercase tracking-wide transition-all sm:px-6 sm:py-3 sm:text-lg ${
            canCallQuarto && !disabled
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/25'
              : 'cursor-not-allowed bg-slate-700 text-slate-500'
          }`}
        >
          Call Quarto!
        </button>
      )}

      {isGameOver && (
        <button
          onClick={onNewGame}
          className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-base font-bold uppercase tracking-wide text-white transition-all hover:from-green-400 hover:to-emerald-400 hover:shadow-lg hover:shadow-green-500/25 sm:px-6 sm:py-3 sm:text-lg"
        >
          New Game
        </button>
      )}

      <button
        onClick={onQuit}
        className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-600 hover:text-white sm:px-4 sm:text-sm"
      >
        {isGameOver ? 'Back to Menu' : 'Quit Game'}
      </button>
    </div>
  );
}

export default GameControls;
