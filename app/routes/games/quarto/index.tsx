import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuartoGame } from '@/features/quarto/hooks';
import type { AIDifficulty } from '@/features/quarto/types/quarto.types';

// Generate a random 6-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const Route = createFileRoute('/games/quarto/')({
  component: QuartoMenuPage,
});

type GameModeSelection = 'local' | 'ai' | 'online' | null;
type OnlineMode = 'create' | 'join' | null;

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

  // Online game form state
  const [onlineMode, setOnlineMode] = useState<OnlineMode>(null);
  const [onlinePlayerName, setOnlinePlayerName] = useState('Player');
  const [roomCode, setRoomCode] = useState('');

  const handleStartLocalGame = () => {
    startLocalGame(player1Name || 'Player 1', player2Name || 'Player 2');
    navigate({ to: '/games/quarto/play' });
  };

  const handleStartAIGame = () => {
    startAIGame(playerName || 'Player', difficulty, playerGoesFirst);
    navigate({ to: '/games/quarto/play' });
  };

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode();
    navigate({
      to: '/games/quarto/online',
      search: { room: newRoomCode, host: true, name: onlinePlayerName || 'Host' },
    });
  };

  const handleJoinRoom = () => {
    if (roomCode.length !== 6) return;
    navigate({
      to: '/games/quarto/online',
      search: { room: roomCode.toUpperCase(), host: false, name: onlinePlayerName || 'Guest' },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-2 text-3xl font-bold text-amber-400 sm:text-4xl md:text-5xl">Quarto</h1>
          <p className="text-base text-slate-400 sm:text-lg">
            The strategic game of shared attributes
          </p>
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => setSelectedMode('local')}
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 p-3 text-left transition-all hover:from-amber-400 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/25 sm:p-4"
            >
              <h2 className="text-lg font-bold text-black sm:text-xl">Local 2 Players</h2>
              <p className="text-sm text-amber-900">
                Play against a friend on the same device
              </p>
            </button>

            <button
              onClick={() => setSelectedMode('ai')}
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 p-3 text-left transition-all hover:from-purple-400 hover:to-violet-400 hover:shadow-lg hover:shadow-purple-500/25 sm:p-4"
            >
              <h2 className="text-lg font-bold text-white sm:text-xl">vs AI</h2>
              <p className="text-sm text-purple-200">
                Challenge the computer at various difficulties
              </p>
            </button>

            <button
              onClick={() => setSelectedMode('online')}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-3 text-left transition-all hover:from-emerald-400 hover:to-teal-400 hover:shadow-lg hover:shadow-emerald-500/25 sm:p-4"
            >
              <h2 className="text-lg font-bold text-white sm:text-xl">Online Multiplayer</h2>
              <p className="text-sm text-emerald-100">
                Play against a friend over the internet
              </p>
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
                      className={`rounded-lg px-2 py-2 text-sm font-medium capitalize transition-all sm:px-4 sm:text-base ${
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

        {/* Online Game Setup */}
        {selectedMode === 'online' && !onlineMode && (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-slate-400 hover:text-white"
            >
              &larr; Back
            </button>

            <h2 className="text-2xl font-bold text-white">Online Multiplayer</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Your Name
                </label>
                <input
                  type="text"
                  value={onlinePlayerName}
                  onChange={(e) => setOnlinePlayerName(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Player"
                  maxLength={20}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setOnlineMode('create')}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-left transition-all hover:from-emerald-400 hover:to-teal-400"
              >
                <h3 className="text-lg font-bold text-white">Create Room</h3>
                <p className="text-sm text-emerald-100">
                  Generate a room code to share with a friend
                </p>
              </button>

              <button
                onClick={() => setOnlineMode('join')}
                className="w-full rounded-lg bg-slate-700 p-4 text-left transition-all hover:bg-slate-600"
              >
                <h3 className="text-lg font-bold text-white">Join Room</h3>
                <p className="text-sm text-slate-400">
                  Enter a room code to join your friend
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Create Room Confirmation */}
        {selectedMode === 'online' && onlineMode === 'create' && (
          <div className="space-y-6">
            <button
              onClick={() => setOnlineMode(null)}
              className="text-slate-400 hover:text-white"
            >
              &larr; Back
            </button>

            <h2 className="text-2xl font-bold text-white">Create Room</h2>

            <p className="text-slate-400">
              You'll be given a room code to share with your friend. They can
              use this code to join your game.
            </p>

            <button
              onClick={handleCreateRoom}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-lg font-bold text-white transition-all hover:from-emerald-400 hover:to-teal-400"
            >
              Create Room
            </button>
          </div>
        )}

        {/* Join Room Form */}
        {selectedMode === 'online' && onlineMode === 'join' && (
          <div className="space-y-6">
            <button
              onClick={() => setOnlineMode(null)}
              className="text-slate-400 hover:text-white"
            >
              &larr; Back
            </button>

            <h2 className="text-2xl font-bold text-white">Join Room</h2>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                className="w-full rounded-lg bg-slate-700 px-4 py-3 text-center text-2xl font-mono tracking-widest text-white placeholder-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={roomCode.length !== 6}
              className={`w-full rounded-lg py-4 text-lg font-bold transition-all ${
                roomCode.length === 6
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400'
                  : 'cursor-not-allowed bg-slate-700 text-slate-500'
              }`}
            >
              Join Room
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
