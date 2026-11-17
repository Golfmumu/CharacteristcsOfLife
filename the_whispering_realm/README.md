# THE WHISPERING REALM

A browser-based 3D anime-fantasy adventure prototype built with HTML, CSS, JavaScript and Three.js.

## Requirements

- A modern desktop browser with WebGL support
- Internet connection for the Three.js CDN and Google Fonts
- Node.js (recommended for local development)

## Run locally

1. Open this folder in VS Code.
2. Open the integrated terminal.
3. Run:

```bash
npm create vite@latest . -- --template vanilla
npm install
npm install three
npm run dev
```

If Vite asks whether to overwrite existing files, do not overwrite this project's `index.html`, `style.css`, or `js` folder. You can instead create a separate empty Vite folder and copy these files into it.

Open the local URL shown in the terminal.

Alternative: use any static development server that supports ES modules. Do not open `index.html` directly with `file://`, because browser module loading may be blocked.

## Controls

### Desktop
- WASD: Move
- Shift: Run
- Drag left mouse button on the game canvas: Rotate camera
- E: Interact
- J: Journal
- I: Inventory
- Escape: Pause

### Touch
- Left virtual joystick: Move
- RUN: Run
- E: Interact

## Current playable prototype

- Main menu and in-game HUD
- Five distinct chapter zones, each with a different color palette and environment layout
- Third-person anime-inspired player character
- WASD movement and mouse-drag camera
- Touch joystick and touch action buttons
- Collectible memory shards
- Quest objective counter
- Chapter gateways that unlock after collecting both memories in the current chapter
- A readable environmental note
- Inventory view
- Journal view
- Local browser save/load

## Important limitations

This is a functional starter prototype, not a finished commercial game.

- The character and environments currently use procedural Three.js geometry. Replace or upgrade these with licensed GLB models for production quality.
- Chapter content is represented by starter objectives and collectible memories. Full NPC dialogue, complex puzzle chains, branching story, cinematic cutscenes, and multiple endings still need implementation.
- Collision is currently limited to the playable area's boundary; detailed building collision should be added before release.
- Mouse camera rotation uses click-and-drag on the canvas.
- The prototype loads Three.js from a CDN, so an internet connection is required.
- Test performance on the actual target devices.

## Project structure

```text
index.html
style.css
js/
  main.js
  story.js
  world.js
  player.js
  ui.js
  save.js
```

## Recommended next milestones

1. Add proper building and obstacle collision.
2. Add animated GLB player and NPC models.
3. Add NPC dialogue and branching choices.
4. Add a full quest state machine per chapter.
5. Add chapter-specific puzzles and gates.
6. Add sound effects and music.
7. Add settings, graphics presets and accessibility options.
8. Test mobile touch controls and desktop browser compatibility.
9. Deploy to a static web host using HTTPS.
