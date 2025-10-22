# Whispr

Real-time chat application built with Next.js and Ably.

## Setup

Install dependencies:
```bash
npm install
```

Create a `.env.local` file:
```bash
ABLY_API_KEY=your-ably-api-key-here
```

Get your API key from [ably.com/signup](https://ably.com/signup).

Run the dev server:
```bash
npm run dev
```

## Features

- Real-time messaging with message history
- Typing indicators and online presence
- Message editing
- Message grouping (iMessage/Discord-style)
- Room-based chat with shareable room IDs
- Token-based auth (server-side)
- 24-hour message retention
- Responsive design with mobile support

## Tech Stack

- Next.js 15 (App Router, React 19, Turbopack)
- Ably Chat SDK
- Tailwind CSS
- TypeScript
- shadcn/ui
