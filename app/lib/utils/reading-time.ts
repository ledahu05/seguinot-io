const WORDS_PER_MINUTE = 200

/**
 * Calculate estimated reading time for a piece of content.
 * @param content - The raw text/markdown content
 * @returns Estimated reading time in minutes (minimum 1)
 */
export function calculateReadingTime(content: string): number {
  // Remove code blocks (they're read faster - scanning vs reading)
  const textContent = content.replace(/```[\s\S]*?```/g, '')

  // Count words
  const words = textContent
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  // Calculate minutes, minimum 1
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
