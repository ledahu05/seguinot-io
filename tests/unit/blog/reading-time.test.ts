import { describe, it, expect } from 'vitest'
import { calculateReadingTime } from '../../../app/lib/utils/reading-time'

describe('calculateReadingTime', () => {
  it('returns 1 minute for short content', () => {
    const content = 'Hello world'
    expect(calculateReadingTime(content)).toBe(1)
  })

  it('calculates reading time based on word count (200 words per minute)', () => {
    // Create content with exactly 400 words (should be 2 minutes)
    const words = Array(400).fill('word').join(' ')
    expect(calculateReadingTime(words)).toBe(2)
  })

  it('rounds up to the nearest minute', () => {
    // Create content with 250 words (should round up to 2 minutes)
    const words = Array(250).fill('word').join(' ')
    expect(calculateReadingTime(words)).toBe(2)
  })

  it('excludes code blocks from word count', () => {
    const content = `
Some text here with a few words.

\`\`\`typescript
const longCodeBlock = 'This should not be counted'
const moreLongCodeBlock = 'Neither should this'
function thisIsAlsoIgnored() {
  return 'still not counted'
}
\`\`\`

And some more text after the code block.
    `
    // Only the text outside code blocks should be counted
    // ~15 words outside code block = 1 minute
    expect(calculateReadingTime(content)).toBe(1)
  })

  it('handles multiple code blocks', () => {
    const content = `
Introduction text here.

\`\`\`javascript
const first = 'code block'
\`\`\`

Middle text between blocks.

\`\`\`python
second = 'code block'
\`\`\`

Conclusion text.
    `
    expect(calculateReadingTime(content)).toBe(1)
  })

  it('returns minimum 1 minute for empty content', () => {
    expect(calculateReadingTime('')).toBe(1)
  })

  it('handles content with only whitespace', () => {
    expect(calculateReadingTime('   \n\n\t   ')).toBe(1)
  })

  it('handles real-world blog post content', () => {
    const content = `
# Introduction

This is a comprehensive guide to building modern web applications with React and TypeScript.

## Getting Started

First, you need to set up your development environment. Make sure you have Node.js installed.

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
\`\`\`

## Building Components

React components are the building blocks of your application.

\`\`\`typescript
interface Props {
  title: string
}

function Header({ title }: Props) {
  return <h1>{title}</h1>
}
\`\`\`

## Conclusion

Now you know the basics of building React applications with TypeScript.
    `
    // Approximately 70 words outside code blocks = 1 minute
    expect(calculateReadingTime(content)).toBe(1)
  })
})
