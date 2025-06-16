# Babylon.js Ping Pong Game

A real-time multiplayer 2D ping pong game built with **Babylon.js** for the client-side 3D rendering and **Node.js** with **Socket.IO** for the game server. The game features proper physics, collision detection, and smooth real-time multiplayer gameplay.

## Features

- 🏓 **Real-time multiplayer gameplay** - Two players can play simultaneously
- 🎮 **Multiple control options** - Keyboard (WASD/Arrow keys) and mouse controls
- 🎯 **Realistic physics** - Ball physics with proper collision detection and paddle interaction
- 📊 **Score tracking** - Live score updates with configurable win conditions
- 🔄 **Game restart functionality** - Players can restart the game at any time
- 🎨 **3D rendering with Babylon.js** - Beautiful 3D graphics for a 2D gameplay experience
- 🐳 **Docker support** - Easy deployment with Docker Compose
- 🌐 **Web-based** - Play directly in your browser

## Game Controls

### Player 1 (Left Paddle - Green)
- **W** or **↑** - Move paddle up
- **S** or **↓** - Move paddle down
- **Mouse** - Move mouse vertically to control paddle

### Player 2 (Right Paddle - Blue)
- **↑** - Move paddle up
- **↓** - Move paddle down
- **Mouse** - Move mouse vertically to control paddle

## Project Structure

```
transcendence/
├── server/                 # Game server (Node.js + Socket.IO)
│   ├── index.js           # Main server file with game logic
│   ├── package.json       # Server dependencies
│   └── Dockerfile         # Server containerization
├── client/                # Client application (Babylon.js)
│   ├── src/
│   │   └── main.js       # Main game client code
│   ├── index.html        # HTML entry point
│   ├── package.json      # Client dependencies
│   ├── vite.config.js    # Vite build configuration
│   ├── Dockerfile        # Client containerization
│   └── nginx.conf        # Nginx configuration for client
├── docker-compose.yml    # Docker orchestration
├── nginx.conf           # Main nginx proxy configuration
├── package.json         # Root project configuration
└── README.md           # Project documentation
```

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd transcendence
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Open your browser**
   - Navigate to `http://localhost` to play the game
   - Open a second browser window/tab for the second player

### Option 2: Manual Setup

1. **Install dependencies for both server and client**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

2. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Game server on `http://localhost:3001`
   - Client development server on `http://localhost:3000`

3. **Open your browser**
   - Navigate to `http://localhost:3000` to play the game
   - Open a second browser window/tab for the second player

## Game Rules

1. **Objective**: Score points by getting the ball past your opponent's paddle
2. **Scoring**: First player to reach 11 points wins the game
3. **Ball Physics**: 
   - Ball speed increases slightly with each paddle hit
   - Ball direction changes based on where it hits the paddle
   - Ball bounces off top and bottom walls
4. **Paddle Movement**: Paddles are constrained to vertical movement within the game field

## Technical Details

### Server-Side Features
- **Real-time game state synchronization** at 60 FPS
- **Authoritative server** - All game logic runs on the server
- **Physics simulation** with proper collision detection
- **Player management** - Handles connections, disconnections, and reconnections
- **Game state management** - Tracks ball position, paddle positions, and scores

### Client-Side Features
- **Babylon.js 3D rendering** - Smooth 60 FPS gameplay
- **Real-time networking** with Socket.IO
- **Responsive input handling** - Both keyboard and mouse controls
- **Visual feedback** - Player paddle highlighting and game state indicators
- **Clean UI** - Score display, game status, and control instructions

### Networking
- **WebSocket communication** via Socket.IO
- **Low-latency updates** - Game state broadcasted at 60 FPS
- **Automatic reconnection** handling
- **Player assignment** - Automatic assignment to Player 1 or Player 2

## Development Commands

```bash
# Install all dependencies
npm install

# Start development mode (both server and client)
npm run dev

# Start only server
npm run server:dev

# Start only client
npm run client:dev

# Build client for production
npm run build

# Docker commands
npm run docker:build    # Build Docker images
npm run docker:up      # Start containers
npm run docker:down    # Stop containers
```

## Game Architecture

### Server (Node.js + Express + Socket.IO)
- Handles game physics and collision detection
- Manages game state and player connections
- Broadcasts updates to all connected clients
- Validates player input and maintains game integrity

### Client (Babylon.js + Socket.IO)
- Renders 3D game objects and scenes
- Handles user input (keyboard/mouse)
- Receives and applies server game state updates
- Provides real-time visual feedback

### Communication Protocol
- `playerAssigned` - Server assigns player number to client
- `playersConnected` - Server notifies clients about player connections
- `gameStarted` - Server signals game start when both players connected
- `gameState` - Server broadcasts current game state (60 FPS)
- `paddleMove` - Client sends paddle movement to server
- `score` - Server updates score when points are scored
- `gameOver` - Server notifies clients when game ends
- `restartGame` - Client requests game restart

## Browser Compatibility

The game works in all modern browsers that support:
- WebGL (for Babylon.js)
- WebSocket (for Socket.IO)
- ES6 modules

Tested browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Server**: Handles up to 60 FPS game logic updates
- **Client**: 60 FPS rendering with Babylon.js
- **Network**: Low-latency real-time communication
- **Resource usage**: Lightweight - optimized for smooth gameplay

## Troubleshooting

### Common Issues

1. **"Waiting for players" forever**
   - Make sure both browser windows are connected to the same server
   - Check browser console for connection errors

2. **Laggy gameplay**
   - Check network connection
   - Ensure server is running properly
   - Try refreshing the browser

3. **Docker issues**
   - Make sure Docker and Docker Compose are installed
   - Check that ports 80, 3000, and 3001 are available

### Debug Mode

Enable debug mode by opening browser developer tools:
- Network tab: Monitor Socket.IO connections
- Console tab: View game debug messages
- Performance tab: Monitor FPS and performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Babylon.js** - For the excellent 3D rendering engine
- **Socket.IO** - For real-time networking capabilities
- **Express.js** - For the web server framework 