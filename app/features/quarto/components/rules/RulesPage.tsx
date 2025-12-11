/**
 * Rules Page - Main layout component for "How to Play" page
 * @module features/quarto/components/rules/RulesPage
 */

import { Link, useRouter } from '@tanstack/react-router';
import { RULES_SECTIONS } from './data/sections';
import { EXAMPLE_BOARDS } from './data/exampleBoards';
import { PieceGrid } from './PieceGrid';
import { TurnAnimation } from './TurnAnimation';
import { ExampleBoard } from './ExampleBoard';
import { BoardWithOverlays } from './BoardWithOverlays';
import { KeyboardShortcutsHelp } from '../KeyboardShortcutsHelp';

/**
 * Section component for consistent styling
 */
function Section({
  id,
  title,
  children,
  className = '',
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 ${className}`}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      {title && (
        <h2
          id={`${id}-title`}
          className="mb-4 text-xl font-bold text-amber-400 sm:text-2xl md:mb-6 md:text-3xl"
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/**
 * Content renderer with basic markdown-like formatting
 */
function ContentText({ content }: { content: string }) {
  // Split by double newlines for paragraphs
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-4 text-slate-300">
      {paragraphs.map((para, idx) => {
        // Handle bullet points
        if (para.includes('\n•') || para.startsWith('•')) {
          const lines = para.split('\n');
          return (
            <ul key={idx} className="list-inside list-disc space-y-1 pl-2">
              {lines.map((line, lineIdx) => {
                const text = line.replace(/^•\s*/, '');
                if (!text.trim()) return null;
                return (
                  <li key={lineIdx} className="text-sm sm:text-base">
                    <FormattedText text={text} />
                  </li>
                );
              })}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-sm leading-relaxed sm:text-base">
            <FormattedText text={para} />
          </p>
        );
      })}
    </div>
  );
}

/**
 * Inline text formatter for bold (**text**) markers
 */
function FormattedText({ text }: { text: string }) {
  // Split by **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

/**
 * Interactive content for each section
 */
function InteractiveContent({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case 'pieces':
      return (
        <div className="mt-6">
          <PieceGrid />
        </div>
      );
    case 'turn':
      return (
        <div className="mt-6">
          <TurnAnimation />
        </div>
      );
    case 'winning':
      return (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {EXAMPLE_BOARDS.map((config) => (
            <ExampleBoard key={config.id} config={config} />
          ))}
        </div>
      );
    case 'board':
      return (
        <div className="mt-6">
          <BoardWithOverlays />
        </div>
      );
    default:
      return null;
  }
}

/**
 * Main Rules Page component
 */
export function RulesPage() {
  const router = useRouter();

  const headerSection = RULES_SECTIONS.find((s) => s.id === 'header');
  const contentSections = RULES_SECTIONS.filter(
    (s) => s.id !== 'header' && s.id !== 'footer'
  );

  // Use browser history to go back (preserves game state)
  const handleBack = () => {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      // Fallback to menu if no history
      router.navigate({ to: '/games/quarto' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={handleBack}
            className="text-slate-400 transition-colors hover:text-white"
            aria-label="Go back"
          >
            &larr; Back
          </button>
          <h1 className="text-lg font-bold text-amber-400 sm:text-xl">
            {headerSection?.title || 'How to Play'}
          </h1>
          <div className="w-12" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Subtitle */}
        {headerSection?.content && (
          <p className="mb-8 text-center text-sm text-slate-400 sm:mb-12 sm:text-base">
            {headerSection.content}
          </p>
        )}

        {/* Content Sections */}
        <div className="space-y-12 sm:space-y-16">
          {contentSections.map((section) => (
            <Section key={section.id} id={section.id} title={section.title}>
              <ContentText content={section.content} />
              {section.hasInteractive && (
                <InteractiveContent sectionId={section.id} />
              )}
            </Section>
          ))}
        </div>

        {/* Footer / CTA */}
        <footer className="mt-12 border-t border-slate-700 pt-8 sm:mt-16 sm:pt-12">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              to="/games/quarto"
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-4 text-center text-lg font-bold text-black transition-all hover:from-amber-400 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/25 sm:w-auto"
            >
              Start Playing
            </Link>
            <KeyboardShortcutsHelp />
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Learn by doing? Jump into a game and figure it out as you play!
          </p>
        </footer>
      </main>
    </div>
  );
}
