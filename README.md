# Portfolio 2025

A personal portfolio website featuring an interactive 3D Quarto game built with React and modern web technologies.

## Features

- **Quarto Game**: A 3D implementation of the classic strategy board game
  - Local 2-player mode
  - AI opponent with Easy/Medium/Hard difficulty levels
  - Online multiplayer via PartyKit WebSockets
  - 3D graphics with React Three Fiber
  - Keyboard navigation and responsive design

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with file-based routing
- **UI**: React 19, TypeScript 5.x, Tailwind CSS v4
- **3D Graphics**: React Three Fiber, Drei
- **State Management**: Redux Toolkit
- **Online Multiplayer**: PartyKit, partysocket
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

For online multiplayer development, also start the PartyKit server:

```bash
npm run party:dev
```

Or run both simultaneously:

```bash
npm run dev:all
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
app/
├── features/
│   └── quarto/           # Quarto game feature
│       ├── components/   # 3D components (Board, Pieces, etc.)
│       ├── hooks/        # Game logic hooks
│       ├── online/       # Online multiplayer hooks
│       ├── store/        # Redux slice and selectors
│       ├── types/        # TypeScript types
│       └── utils/        # Game utilities (AI, win detection)
├── routes/
│   └── games/
│       └── quarto/       # Game routes (menu, play, online)
└── styles/               # Global styles

party/                    # PartyKit server for online multiplayer
├── src/
│   ├── quarto.ts         # Room handler
│   ├── game-logic.ts     # Server-side game logic
│   └── types.ts          # Shared types
```

## Testing

```bash
npm run test
```

## License

MIT
