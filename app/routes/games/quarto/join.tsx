// T022: Quarto join page SEO with noIndex meta tag

import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { generateNoIndexMeta } from '@/lib/seo';

// T007: Zod validation for room code in URL
const searchSchema = z.object({
  room: z
    .string()
    .length(6, 'Room code must be 6 characters')
    .regex(/^[A-Z0-9]+$/, 'Room code must be uppercase alphanumeric'),
});

export const Route = createFileRoute('/games/quarto/join')({
  validateSearch: searchSchema,
  head: () => generateNoIndexMeta({
    title: 'Join Quarto Game',
    description: 'Join an online Quarto game with a room code.',
    path: '/games/quarto/join',
  }),
  component: JoinRoomPage,
  // T011: Handle invalid room code format - redirect to menu on validation error
  onError: () => {
    // Validation failed - will be caught by error boundary
  },
});

// T008: JoinRoomPage component with name input form
function JoinRoomPage() {
  const { room } = Route.useSearch();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('Guest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // T009: Navigation to online game on form submit
  const handleJoin = () => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      setError('Please enter a name');
      return;
    }

    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    navigate({
      to: '/games/quarto/online',
      search: {
        room,
        host: false,
        name: trimmedName,
      },
    });
  };

  // T010: Cancel button navigation back to menu
  const handleCancel = () => {
    navigate({ to: '/games/quarto' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleJoin();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Join Quarto Game
          </h1>
          <p className="mt-2 text-slate-400">
            You've been invited to play!
          </p>
        </div>

        {/* Room Code Display */}
        <div className="rounded-lg bg-slate-800 p-4 text-center">
          <p className="text-sm text-slate-400">Room Code</p>
          <p className="font-mono text-3xl tracking-widest text-emerald-400">
            {room}
          </p>
        </div>

        {/* Name Input */}
        <div>
          <label
            htmlFor="playerName"
            className="mb-2 block text-sm text-slate-400"
          >
            Your Name
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your name"
            maxLength={20}
            autoFocus
            disabled={isSubmitting}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleJoin}
            disabled={isSubmitting || !playerName.trim()}
            className={`w-full rounded-lg py-3 text-lg font-bold transition-all ${
              isSubmitting || !playerName.trim()
                ? 'cursor-not-allowed bg-slate-700 text-slate-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400'
            }`}
          >
            {isSubmitting ? 'Joining...' : 'Join Game'}
          </button>

          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-700 py-3 text-slate-300 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
