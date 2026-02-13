# Whispr

Real-time chat application built with Next.js and Ably Chat SDK.

## Features

- Real-time messaging with message history
- Typing indicators and online presence
- Message editing
- Message grouping (iMessage/Discord-style)
- Room-based chat with shareable room IDs
- Token-based authentication
- 24-hour message retention
- Responsive design with mobile support
- Input validation and XSS protection
- Error boundaries for graceful error handling

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Ably Chat SDK** - Real-time messaging infrastructure
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zod** - Schema validation
- **Biome** - Linting and formatting

## Architecture

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes (token auth)
│   ├── room/[id]/         # Dynamic room pages
│   └── page.tsx           # Home page
├── components/
│   ├── chat/              # Chat-related components
│   │   ├── avatar.tsx
│   │   ├── chat-box.tsx
│   │   ├── message-list.tsx
│   │   └── ...
│   ├── error-boundary.tsx
│   └── loading-spinner.tsx
└── lib/                   # Utilities and config
    ├── config.ts          # Environment config
    ├── constants.ts       # App constants
    ├── validation.ts      # Input validation
    ├── error-handler.ts   # Error handling
    └── types.ts           # Shared types
```

## Setup

1. **Install dependencies:**

```bash
npm install
# or
pnpm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env.local` and add your Ably API key:

```bash
cp .env.example .env.local
```

Get your API key from [ably.com/signup](https://ably.com/signup).

3. **Run the development server:**

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
