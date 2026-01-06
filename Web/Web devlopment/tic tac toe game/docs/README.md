# 🎮 TIC-TAC-TOE ULTIMATE

A premium, feature-rich Tic-Tac-Toe game with **Offline AI Levels** and **Online Multiplayer** using a custom localStorage database.

---

## ✨ Features

### 🎯 Core Features
- **Beautiful UI**: Dark mode with glassmorphism, gradients, and glowing effects
- **Smooth Animations**: Page transitions, tile bounces, star ratings
- **Emoji Selection**: Choose your fighter from 8 unique emojis
- **Dual Modes**: Offline Adventure & Online Multiplayer

### 🤖 Offline Mode
- **3 Difficulty Levels**:
  - **Level 1 (Easy)**: Random AI - Win easily (15 stages)
  - **Level 2 (Normal)**: Smart AI - Blocks obvious moves (15 stages)
  - **Level 3 (Impossible)**: Minimax AI - Unbeatable (15 stages)
    - **Stage 15**: AI goes first - Guaranteed tie or loss

- **Star Rating System**:
  - ⭐⭐⭐ Win in 3 moves
  - ⭐⭐ Win in 4 moves
  - ⭐ Win in 5 moves
  - No stars for 6+ moves

- **Progressive Unlocking**:
  - Complete all 15 stages of Level 1 to unlock Level 2
  - Complete all 15 stages of Level 2 to unlock Level 3
  - Each stage unlocks the next upon winning

### 🌐 Online Multiplayer
- **Custom Database**: Uses localStorage (no external services needed!)
- **Email Authentication**: Sign up and login system
- **Real-time Sync**: Automatic board updates every 500ms
- **Game Rooms**: Create or join games with unique IDs
- **Cross-tab Support**: Play on different browser tabs/windows

---

## 🚀 Quick Start

### Method 1: Using the Batch File (Recommended)
1. Double-click **`start_game.bat`**
2. Your browser will open automatically at `http://localhost:8000`
3. Start playing!

### Method 2: Manual Start
1. Open terminal in the game folder
2. Run: `python -m http.server 8000`
3. Open browser to: `http://localhost:8000`

---

## 📁 Project Structure

```
tic tac toe game/
├── index.html              # Main HTML file
├── style.css               # Custom styles & animations
├── start_game.bat          # Quick start script
├── src/
│   ├── main.js            # Router & navigation
│   ├── store.js           # State management (progress, stars)
│   ├── ai.js              # AI algorithms (Random, Smart, Minimax)
│   ├── database.js        # Custom localStorage database
│   └── views/
│       ├── welcome.js     # Welcome screen
│       ├── emoji.js       # Emoji selection
│       ├── mode.js        # Mode selection (Offline/Online)
│       ├── offlineLevels.js   # Level selection
│       ├── offlineStages.js   # Stage selection (1-15)
│       ├── game.js        # Main game logic
│       ├── onlineLogin.js # Authentication
│       └── onlineLobby.js # Game creation/joining
└── legacy_backup/         # Original simple version
```

---

## 🎮 How to Play

### Offline Mode
1. Click **PLAY** on welcome screen
2. Select your emoji
3. Choose **Offline Adventure**
4. Select difficulty level
5. Choose a stage (1-15)
6. Beat the AI to unlock next stage!

### Online Mode
1. Click **PLAY** on welcome screen
2. Select your emoji
3. Choose **Online Multiplayer**
4. **Sign Up** (first time) or **Login**
5. **Create Match** or **Join Match**:
   - **Create**: Share the Game ID with a friend
   - **Join**: Enter your friend's Game ID
6. Play in real-time!

---

## 🧠 AI Algorithms

### Level 1: Random AI
```javascript
// Picks random available move
move = emptySpots[random(0, emptySpots.length)]
```

### Level 2: Smart AI
```javascript
// 1. Can AI win? Take it
// 2. Can player win? Block it
// 3. Else: Random move
```

### Level 3: Minimax Algorithm
The AI uses the **Minimax algorithm** with game theory:

$$ V(s) = \max_{a \in A(s)} \left( \min_{b \in A(s')} V(s'') \right) \text{ where } s = \text{state}, a = \text{AI move}, b = \text{player move}, V = \text{value function} \in \{-10, 0, +10\} $$

**Explanation**:
- The AI maximizes its score while assuming the player minimizes it
- Recursively evaluates all possible game states
- Returns optimal move that guarantees best outcome
- **Stage 15**: AI goes first, ensuring unbeatable play

---

## 💾 Database Schema (localStorage)

### Users Table
```javascript
{
  id: "user_<timestamp>_<random>",
  email: "user@example.com",
  password: "hashed_password",
  createdAt: "2026-01-01T..."
}
```

### Games Table
```javascript
{
  id: "game_<timestamp>_<random>",
  player_x: "user_id",           // Creator
  player_x_emoji: "🚀",
  player_o: "user_id",           // Joiner
  player_o_emoji: "⭕",
  board: ["", "🚀", "", ...],    // 9 cells
  turn: "X" | "O",
  status: "waiting" | "playing" | "finished",
  winner: "X" | "O" | "draw" | null,
  lastUpdate: 1735747200000
}
```

### Real-time Sync
- Polls localStorage every **500ms**
- Detects changes via `lastUpdate` timestamp
- Automatically updates UI when opponent moves

---

## 🎨 Design Features

### Glassmorphism
```css
background: rgba(30, 41, 59, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Gradient Text
```css
background: linear-gradient(to right, #6366f1, #a855f7);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Animations
- **Page Transitions**: Slide-in, fade-in
- **Tile Clicks**: Bounce effect
- **Star Ratings**: Staggered scale animation
- **Turn Indicators**: Glow effects

---

## 🔧 Technical Details

### No Build Required
- Pure JavaScript ES Modules
- CDN-based Tailwind CSS
- No npm, webpack, or bundlers needed
- Works directly in browser

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Storage
- **Progress**: Saved to localStorage
- **Stars**: Persistent across sessions
- **Online Games**: Shared via localStorage (same browser)

---

## 📊 Game Formulas

### Star Calculation
$$ \text{Stars} = \begin{cases} 3 & \text{if moves} \leq 3 \\ 2 & \text{if moves} = 4 \\ 1 & \text{if moves} = 5 \\ 0 & \text{if moves} \geq 6 \end{cases} $$

### Win Detection
$$ \text{Win} = \bigvee_{c \in C} \left( \bigwedge_{i \in c} \text{board}[i] = \text{player} \right) \text{ where } C = \{\text{all winning combinations}\} $$

### Minimax Value Function
$$ V(s, p) = \begin{cases} +10 & \text{if AI wins} \\ -10 & \text{if player wins} \\ 0 & \text{if draw} \\ \max_{m \in M} V(s', \neg p) & \text{if } p = \text{AI} \\ \min_{m \in M} V(s', \neg p) & \text{if } p = \text{player} \end{cases} $$

---

## 🐛 Troubleshooting

### Game won't start
- Ensure Python is installed: `python --version`
- Try different port: `python -m http.server 3000`

### Online mode not syncing
- Both players must use **same browser** (localStorage limitation)
- Try opening in two different tabs/windows
- Clear localStorage: `localStorage.clear()` in console

### Progress lost
- Check browser's localStorage settings
- Don't use incognito/private mode
- Export progress: `localStorage.getItem('tictactoe_state')`

---

## 🎯 Future Enhancements

- [ ] WebSocket for true real-time multiplayer
- [ ] Leaderboards
- [ ] Sound effects
- [ ] Custom emoji upload
- [ ] Tournament mode
- [ ] AI difficulty customization

---

## 📝 Credits

- **Framework**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Outfit)
- **Algorithm**: Minimax with Alpha-Beta pruning

---

## 📄 License

This project is open source and available for educational purposes.

---

**Enjoy the game! Can you beat the Impossible AI? 🎮**
