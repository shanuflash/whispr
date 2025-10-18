# Whispr - Real-time Chat Application

A beautiful, modern real-time chat application built with Next.js, Ably Chat SDK, and Tailwind CSS.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
ABLY_API_KEY=your-ably-api-key-here
```

**Get your Ably API key:**
1. Sign up at [https://ably.com/signup](https://ably.com/signup)
2. Create a new app in your dashboard
3. Go to the "API Keys" tab
4. Copy your root API key
5. Paste it into `.env.local`

**For production deployment:**
- Set the `ABLY_API_KEY` environment variable in your hosting platform (Vercel, Netlify, etc.)
- Never commit your `.env.local` file to version control
- The app uses server-side token authentication for security

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features

- 🎨 **Pro Tool Design** - Minimalist monochrome palette with high contrast
- 🚪 **Create/Join Rooms** - Easy room creation or join with room ID
- 👤 **Username Selection** - Choose your username before joining
- 💬 **Real-time Messaging** - Send and receive messages instantly with smooth animations
- ✏️ **Edit Messages** - Click your messages to edit them
- 📜 **Message History** - Load the last 50 messages when joining
- ⌨️ **Typing Indicators** - See who's typing in real-time with animated dots
- 👥 **Presence** - See who's online with beautiful gradient avatars
- 🎭 **Message Grouping** - iMessage/Discord-style grouped messages
- ⏰ **24h Retention** - Messages automatically delete after 24 hours
- 🔒 **Secure** - Token-based authentication via API route
- ✨ **Micro-interactions** - Smooth animations and hover effects throughout

## 🎯 How to Use

### Creating a Room
1. Click "Create New Room" on the homepage
2. A unique room ID will be generated
3. Enter your username (2-20 characters, no spaces)
4. Start chatting!

### Joining a Room
1. Enter a room ID in the "Join Room" input
2. Click "Join Room"
3. Enter your username
4. Join the conversation!

### Chatting
- **Send messages**: Type and press Enter or click Send
- **Edit messages**: Click on your own messages to edit them
- **See typing**: Watch for typing indicators above the input
- **Send reactions**: Click emoji buttons to react
- **See online users**: Check the left panel for online users

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (Create/Join room)
│   ├── room/
│   │   └── [id]/
│   │       └── page.tsx      # Chat room page
│   ├── api/
│   │   └── route.ts          # Token authentication endpoint
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
└── components/
    └── ui/
        └── button.tsx        # Button component
```

## 🧩 Components

### Landing Page (`/`)
- **Create Room**: Generates a random room ID and navigates to it
- **Join Room**: Enter an existing room ID to join
- **Animated Background**: Beautiful gradient blobs with animations

### Room Page (`/room/[id]`)
- **Username Modal**: Prompts for username before connecting
- **Connection Status**: Shows Ably connection state
- **Room Status**: Displays room ID and Leave button
- **Chat Box**: Main messaging interface with history
- **Presence**: Shows all online users
- **Reactions**: Send and receive emoji reactions

## 🎨 Customization

### Change Available Reactions
Edit the `reactions` array in `/src/app/room/[id]/page.tsx`:
```typescript
const reactions = ['👍', '❤️', '💥', '🚀', '👎', '💔']; // Add your own!
```

### Change Message History Limit
Edit the `limit` in the `loadHistory` function:
```typescript
const history = await historyBeforeSubscribe({ limit: 50 }); // Change 50 to your preferred limit
```

### Change Username Requirements
Edit the validation in the `UsernameModal` component:
```typescript
if (trimmed.length < 2) {
  setError('Username must be at least 2 characters');
  return;
}
```

## 🧪 Testing with Multiple Users

### Option 1: Multiple Browser Windows
Open multiple browser windows/tabs and join the same room with different usernames.

### Option 2: Ably CLI
Install the Ably CLI:
```bash
npm install -g @ably/cli
```

Log in:
```bash
ably login
```

Send a message:
```bash
ably rooms messages send <room-id> 'Hello from CLI!'
```

Simulate typing:
```bash
ably rooms typing keystroke <room-id> --client-id "cli-user"
```

Enter presence:
```bash
ably rooms presence enter <room-id> --client-id "cli-user"
```

Send a reaction:
```bash
ably rooms reactions send <room-id> 👍
```

## 🔒 Security

The app uses token-based authentication via the `/api` route for secure connections. The API key is only stored server-side in environment variables and never exposed to the client.

## 📚 Technologies Used

- **Next.js 15** - React framework with App Router
- **Ably Chat SDK** - Real-time messaging infrastructure
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **shadcn/ui** - Beautiful UI components

## 🐛 Troubleshooting

### "No authentication options provided" error
- Make sure you've created `.env` with your `ABLY_API_KEY`
- Restart your development server after creating the file

### Messages not appearing
- Check the browser console for errors
- Verify your Ably account is active
- Ensure you're using a valid API key

### Connection issues
- Check your internet connection
- Verify the Ably service status
- Check browser console for specific error messages

## 📝 License

MIT

## 🤝 Contributing

Feel free to open issues or submit pull requests!

---

Built with ❤️ using Ably Chat SDK
