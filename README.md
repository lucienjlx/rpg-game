# 3D RPG Game

A browser-based 3D RPG game built with Three.js where you control a yellow hero with a red cape, hunt monsters, and level up!

## Features

- **3D Graphics**: Built with Three.js for smooth 3D rendering
- **Player Character**: Yellow hero with a flowing red cape
- **Monster AI**: Enemies that detect and pursue the player
- **Combat System**: Attack monsters with visual effects and particle animations
- **Level System**: Gain XP from kills and level up to become stronger
- **Progressive Difficulty**: Monsters spawn continuously with increasing challenge

## How to Play

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari)
2. Use **WASD** keys to move your character
3. Press **Spacebar** to attack nearby monsters
4. Kill monsters to gain XP and level up
5. Survive and become more powerful!

## Controls

- **W/A/S/D** - Move character
- **Spacebar** - Attack
- **Mouse** - Camera follows player automatically

## Game Mechanics

### Player Stats
- **Health**: Increases by 20 per level
- **Damage**: Increases by 5 per level
- **Level**: Starts at 1, increases with XP
- **XP**: Gained by killing monsters (25 XP per kill)

### Monsters
- Spawn every 3 seconds around the player
- Chase player when within detection range
- Attack when in melee range
- Drop XP when defeated

### Combat
- Attack range: 3 units
- Attack cooldown: 0.5 seconds
- Visual feedback with particle effects
- Damage numbers and health bars

## Technical Details

- **Engine**: Three.js (r128)
- **No Build Tools**: Pure JavaScript, runs directly in browser
- **Architecture**: Object-oriented with separate classes for Player, Monster, Combat, and Level systems
- **Rendering**: 60 FPS with WebGL

## File Structure

```
rpg-game/
├── index.html          # Main HTML file with canvas and UI
├── style.css           # UI styling and layout
├── game.js             # Core game loop and scene setup
├── player.js           # Player character class
├── monster.js          # Monster class and AI
├── combat.js           # Combat system and effects
└── levelSystem.js      # XP and leveling mechanics
```

## Browser Compatibility

Works best in modern browsers with WebGL support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential features to add:
- Different monster types
- Power-ups and items
- Sound effects and music
- Save/load system
- Boss battles
- Skills and abilities
- Multiplayer support

## License

MIT License - Feel free to use and modify!

## Credits

Created with Claude Code - A 3D RPG game implementation using Three.js
