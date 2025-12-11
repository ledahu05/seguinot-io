import { useState, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { Keyboard, X, BookOpen } from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Piece Selection Phase',
    shortcuts: [
      { keys: ['Tab'], description: 'Next piece' },
      { keys: ['Shift', 'Tab'], description: 'Previous piece' },
      { keys: ['←', '→'], description: 'Navigate left/right' },
      { keys: ['↑', '↓'], description: 'Navigate up/down (rows)' },
      { keys: ['Enter', 'Space'], description: 'Select focused piece' },
    ],
  },
  {
    title: 'Piece Placement Phase',
    shortcuts: [
      { keys: ['Tab'], description: 'Next empty position' },
      { keys: ['Shift', 'Tab'], description: 'Previous empty position' },
      { keys: ['←', '→', '↑', '↓'], description: 'Navigate board grid' },
      { keys: ['Enter', 'Space'], description: 'Place piece' },
    ],
  },
  {
    title: 'Game Actions',
    shortcuts: [
      { keys: ['Q'], description: 'Call Quarto (when valid)' },
      { keys: ['?'], description: 'Toggle this help' },
    ],
  },
];

interface KeyboardShortcutsHelpProps {
  className?: string;
}

export function KeyboardShortcutsHelp({ className = '' }: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Toggle with "?" key (Shift + /)
    if (event.key === '?' || (event.shiftKey && event.key === '/')) {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
    // Close with Escape
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 rounded-lg bg-slate-700/50 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-600/50 hover:text-white ${className}`}
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4" />
        <span className="hidden sm:inline">Shortcuts</span>
        <kbd className="hidden rounded bg-slate-600 px-1.5 py-0.5 text-xs font-mono sm:inline">?</kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div
            className="relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl bg-slate-800 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 id="shortcuts-title" className="flex items-center gap-2 text-lg font-bold text-white">
                <Keyboard className="h-5 w-5 text-amber-400" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label="Close shortcuts"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Shortcut Groups */}
            <div className="space-y-5">
              {SHORTCUT_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-2 text-sm font-semibold text-amber-400">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.shortcuts.map((shortcut, idx) => (
                      <li key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIdx) => (
                            <span key={keyIdx}>
                              <kbd className="rounded bg-slate-700 px-2 py-1 font-mono text-xs text-white">
                                {key}
                              </kbd>
                              {keyIdx < shortcut.keys.length - 1 && (
                                <span className="mx-1 text-slate-500">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Game Rules Link */}
            <div className="mt-5 border-t border-slate-700 pt-4">
              <Link
                to="/games/quarto/rules"
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>View Game Rules</span>
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3">
              <p className="text-center text-xs text-slate-500">
                Press <kbd className="rounded bg-slate-700 px-1.5 py-0.5 font-mono">Esc</kbd> or click outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default KeyboardShortcutsHelp;
