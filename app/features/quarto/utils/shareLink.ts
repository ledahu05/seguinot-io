/**
 * Generates a shareable URL for a Quarto game room.
 * The link directs users to the join page with the room code pre-filled.
 *
 * @param roomCode - 6-character alphanumeric room identifier
 * @returns Complete shareable URL (e.g., https://seguinot.io/games/quarto/join?room=ABC123)
 */
export function generateShareLink(roomCode: string): string {
  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/games/quarto/join?room=${roomCode}`;
}
