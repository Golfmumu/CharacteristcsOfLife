# THE WHISPERING REALM — Technical Specification

## Product vision
A browser-based third-person 3D anime-fantasy mystery adventure. The player explores five connected story regions, restores memory fragments, completes objectives, and unlocks subsequent chapters.

## Target
- Desktop browsers first; touch devices supported by an on-screen joystick and action buttons.
- HTML5, CSS3, JavaScript ES Modules, Three.js.
- WebGL 2-capable browser recommended.
- No Unity, Unreal Engine, or dedicated game editor.

## Rendering and scene
- Three.js WebGLRenderer, ACES filmic tone mapping, sRGB output.
- Perspective camera in third-person follow configuration.
- Hemisphere, directional, and point lights.
- Exponential fog with chapter-specific color/density.
- Procedural geometry in the starter build; GLB/glTF asset pipeline planned.
- Resize-aware renderer and capped device pixel ratio.

## Input
Desktop:
- WASD movement relative to camera yaw.
- Shift to run.
- Mouse drag to rotate camera.
- E to interact.
- J journal, I inventory, Escape pause.

Touch:
- Virtual joystick.
- Run button.
- Interact button.
- UI controls must use pointer events and touch-action rules.

## Game systems
- Player controller and third-person camera.
- Interaction proximity detection.
- Memory collectible system.
- Chapter objective counter.
- Chapter gateway unlock conditions.
- Journal and inventory UI.
- LocalStorage save/load.
- Five chapter data records in `js/story.js`.

## Chapter plan
1. The Silent Village — Eldermoor village, bell tower, letter and bell fragment.
2. The Forgotten Forest — forest paths, blue lantern and lost ribbon.
3. The Sunken Cathedral — gothic hall, stained glass and choir page.
4. Below the Ashes — underground ruins, ashen core and archive key.
5. The Whispering Realm — surreal floating realm, fallen star and realm's heart.

Each chapter has two memory collectibles and a gateway to the next chapter. The final chapter is the current prototype's ending zone; a fully authored ending sequence is a future milestone.

## Code organization
- `js/main.js`: bootstrap, renderer, game loop, state orchestration.
- `js/story.js`: chapter and quest content data.
- `js/world.js`: procedural world construction and interactables.
- `js/player.js`: player model, input, movement and camera.
- `js/ui.js`: menus, HUD, panels, mobile controls.
- `js/save.js`: localStorage persistence.

## Data persistence
LocalStorage key: `whispering-realm-save`.
Stores current chapter, collected item IDs, completed chapter IDs, player position, and save timestamp.
This is local to the browser and is not cloud synchronization.

## Performance goals
- Cap pixel ratio at 1.75.
- Prefer instancing for repeated environment props in future iterations.
- Keep shadow map sizes and number of shadow-casting lights modest.
- Dispose of unused GPU resources when changing scenes.
- Provide quality presets before production release.

## Acceptance tests for starter
- Main menu starts the game.
- Player moves with WASD.
- Camera rotates with mouse drag.
- Touch joystick moves the player.
- Run controls work on desktop and touch.
- Interactable objects show a prompt.
- E / touch interact collects a memory.
- Objective count updates.
- Gateway refuses entry until chapter memories are collected.
- Gateway advances to the next chapter.
- Journal and inventory panels open.
- Save and Continue restore chapter and collected memories.
- Browser resize updates camera and renderer.

## Known gaps before public release
- Detailed collision meshes for buildings and props.
- Character animation and production-ready character model.
- NPC system and authored dialogue.
- Rich quest state machine and branching story.
- Puzzle implementation.
- Full cinematic sequences and endings.
- Audio implementation.
- Settings persistence and graphics presets.
- Accessibility options and device testing.
