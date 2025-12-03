# 🏓 Ping Pong 2.0 - Dual Edition 🎪

This repository contains **TWO** exciting Ping Pong game implementations!

## 🌐 Play Online

**Live Demo:** [https://angelinaliu622-cyber.github.io/Pingpong2.0/](https://angelinaliu622-cyber.github.io/Pingpong2.0/)

- **3D Version:** [https://angelinaliu622-cyber.github.io/Pingpong2.0/index.html](https://angelinaliu622-cyber.github.io/Pingpong2.0/index.html)
- **Circus Version:** [https://angelinaliu622-cyber.github.io/Pingpong2.0/index-circus.html](https://angelinaliu622-cyber.github.io/Pingpong2.0/index-circus.html)

## 🎮 Game Versions

### 1️⃣ First-Person 3D Ping Pong (`index.html`)
A realistic 3D perspective ping pong game with advanced physics!

**Features:**
- 🎯 First-person perspective gameplay
- 🏓 Realistic 3D table with orange surface and net
- ⚾ Physics-based ball movement with gravity and bounce
- 🔴 Red player paddle (bottom) vs 🟣 Purple AI paddle (top)
- 🖱️ Mouse control for paddle movement
- 🔊 Web Audio API sound effects
- 🎾 Click to serve mechanic

**How to Play:**
1. Open `index.html` in your web browser
2. Move your mouse to control the red paddle
3. Click to serve the ball
4. Try to score points against the AI!

**Controls:**
- Mouse Movement: Control paddle position
- Mouse Click: Serve the ball

---

### 2️⃣ Circus-Themed Clown Pong (`index-circus.html`)
A vibrant, circus-themed 2D Pong game with clown aesthetics!

**Features:**
- 🎪 Circus-themed colorful design with animated backgrounds
- 🎈 Decorative balloons and confetti animations
- 🔴 Clown nose as the ball (with squash & stretch animation)
- 🎨 Striped circus paddles (Red & Yellow)
- 🏆 First to 7 points wins
- ⚡ Progressive speed increase (classic Pong mechanic)
- 🎮 Dual control support (Mouse OR Keyboard)
- 🔊 Fun clown honk sound effects
- 🎉 Victory fanfare

**How to Play:**
1. Open `index-circus.html` in your web browser
2. Press SPACE to start the game
3. Move your paddle to hit the clown nose ball
4. First to score 7 points wins!

**Controls:**
- Mouse Movement: Control paddle position
- Arrow Keys / A & D: Move paddle left/right
- SPACE: Start game
- Restart Button: Play again after game over

---

## 📁 File Structure

```
Pingpong2.0/
├── index.html          # 3D First-Person Ping Pong
├── game.js             # 3D game logic
├── style.css           # 3D game styles
│
├── index-circus.html   # Circus-themed Clown Pong
├── script.js           # Circus game logic
├── styles.css          # Circus game styles
│
├── Pingpong.png        # Game assets
└── README.md           # This file
```

---

## 🚀 Quick Start

**For 3D Version:**
```bash
# Simply open in browser
open index.html
# or
python -m http.server 8000
# Then visit: http://localhost:8000/index.html
```

**For Circus Version:**
```bash
# Simply open in browser
open index-circus.html
# or
python -m http.server 8000
# Then visit: http://localhost:8000/index-circus.html
```

---

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** - For game rendering
- **Vanilla JavaScript** - Game logic and physics
- **CSS3** - Styling and animations
- **Web Audio API** - Sound effects (no external audio files needed!)

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Note:** Requires a modern browser with HTML5 Canvas and Web Audio API support.

---

## 🎯 Game Mechanics

### 3D Version
- Realistic physics with gravity and Z-axis movement
- Ball bounces on table surface
- Paddle collision detection with angle-based returns
- Progressive AI difficulty
- Score when opponent misses the table

### Circus Version
- Classic Pong-style gameplay
- Ball speed increases with each paddle hit
- Angle of return based on paddle hit position
- AI opponent with tracking behavior
- First to 7 points wins the match

---

## 🎨 Credits

**Developed by:** Pingpong 2.0 Team
**Version:** 2.0
**Last Updated:** 2025

Enjoy the games! 🎮🏓🎪

---

## 📝 License

Feel free to use, modify, and distribute these games for educational purposes!