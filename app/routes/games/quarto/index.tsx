import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuartoGame } from '@/features/quarto/hooks';
import type { AIDifficulty } from '@/features/quarto/types/quarto.types';

export const Route = createFileRoute('/games/quarto/')({
  component: QuartoMenuPage,
});

type GameModeSelection = 'local' | 'ai' | 'online' | null;

function QuartoMenuPage() {
  const navigate = useNavigate();
  const { startLocalGame, startAIGame } = useQuartoGame();

  const [selectedMode, setSelectedMode] = useState<GameModeSelection>(null);

  // Local game form state
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

  // AI game form state
  const [playerName, setPlayerName] = useState('Player');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [playerGoesFirst, setPlayerGoesFirst] = useState(true);

  const handleStartLocalGame = () => {
    startLocalGame(player1Name || 'Player 1', player2Name || 'Player 2');
    navigate({ to: '/games/quarto/play' });
  };

  const handleStartAIGame = () => {
    startAIGame(playerName || 'Player', difficulty, playerGoesFirst);
    navigate({ to: '/games/quarto/play' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-5xl font-bold text-amber-400">Quarto</h1>
          <p className="text-lg text-slate-400">
            The strategic game of shared attributes
          </p>
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedMode('local')}
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 p-4 text-left transition-all hover:from-amber-400 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/25"
            >
              <h2 className="text-xl font-bold text-black">Local 2 Players</h2>
              <p className="text-sm text-amber-900">
                Play against a friend on the same device
              </p>
            </button>

            <button
              onClick={() => setSelectedMode('ai')}
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 p-4 text-left transition-all hover:from-purple-400 hover:to-violet-400 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <h2 className="text-xl font-bold text-white">vs AI</h2>
              <p className="text-sm text-purple-200">
                Challenge the computer at various difficulties
              </p>
            </button>

            <button
              onClick={() => setSelectedMode('online')}
              disabled
              className="w-full cursor-not-allowed rounded-lg bg-slate-700 p-4 text-left opacity-50"
            >
              <h2 className="text-xl font-bold text-slate-300">Online Multiplayer</h2>
              <p className="text-sm text-slate-500">Coming soon...</p>
            </button>
          </div>
        )}

        {/* Local Game Setup */}
        {selectedMode === 'local' && (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-slate-400 hover:text-white"
            >
              &larr; Back
            </button>

            <h2 className="text-2xl font-bold text-white">Local Game Setup</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Player 1 Name
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Player 1"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Player 2 Name
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Player 2"
                  maxLength={20}
                />
              </div>
            </div>

            <button
              onClick={handleStartLocalGame}
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 py-4 text-lg font-bold text-black transition-all hover:from-amber-400 hover:to-yellow-400"
            >
              Start Game
            </button>
          </div>
        )}

        {/* AI Game Setup */}
        {selectedMode === 'ai' && (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-slate-400 hover:text-white"
            >
              &larr; Back
            </button>

            <h2 className="text-2xl font-bold text-white">AI Game Setup</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Player"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`rounded-lg px-4 py-2 font-medium capitalize transition-all ${
                        difficulty === level
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Who goes first?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPlayerGoesFirst(true)}
                    className={`rounded-lg px-4 py-2 font-medium transition-all ${
                      playerGoesFirst
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    You
                  </button>
                  <button
                    onClick={() => setPlayerGoesFirst(false)}
                    className={`rounded-lg px-4 py-2 font-medium transition-all ${
                      !playerGoesFirst
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    AI
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartAIGame}
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 py-4 text-lg font-bold text-white transition-all hover:from-purple-400 hover:to-violet-400"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>Created with React Three Fiber</p>
        </div>
      </div>
    </div>
  );
}
