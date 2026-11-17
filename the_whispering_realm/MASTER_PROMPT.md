# MASTER PROMPT — THE WHISPERING REALM

Act as a senior browser game developer, Three.js specialist, gameplay programmer, narrative designer, and anime-fantasy art director.

Develop THE WHISPERING REALM as a complete browser-based 3D third-person adventure using ONLY HTML5, CSS3, JavaScript ES Modules, and Three.js.

## Non-negotiable technical constraints
- Do not use Unity, Unreal Engine, PlayCanvas, Godot, or another game engine/editor.
- Use Three.js for real-time 3D rendering.
- Use native HTML/CSS for interface elements.
- Use JavaScript ES Modules and modular files.
- The game must run from a local development server and deploy as a static web app.
- Use a consistent Three.js version and compatible official addons.
- Do not invent asset URLs. If external assets are used, list their source and license.
- If production assets are unavailable, create clearly identified procedural placeholders.

## Creative direction
Anime Fantasy with cinematic composition: expressive stylized characters, painterly color harmony, luminous magical accents, detailed gothic-fantasy environments, soft atmospheric fog, moonlight, lantern glow, and restrained supernatural effects. Keep the world readable and navigation clear.

## Camera and controls
- Third-person camera behind the player.
- WASD movement relative to camera direction.
- Mouse drag rotates the camera.
- Shift runs.
- E interacts.
- J opens the journal.
- I opens inventory.
- Escape pauses.
- Touch joystick, run button, and interact button on mobile.
- Smooth camera follow, camera collision, and character-facing movement direction.

## World and story
Build five connected chapters:
1. The Silent Village — investigate Eldermoor and the bell tower.
2. The Forgotten Forest — trace the missing villagers.
3. The Sunken Cathedral — uncover the village's forgotten history.
4. Below the Ashes — discover the underground origin of the mystery.
5. The Whispering Realm — recover the final memories and resolve the central mystery.

Each chapter must contain:
- A unique explorable 3D environment.
- One main quest and at least two side quests.
- NPCs with authored dialogue.
- Interactable objects and environmental clues.
- Collectibles and inventory items.
- At least one puzzle.
- A chapter exit condition.
- A distinct opening and ending sequence.

## Core systems
Implement player movement, collision, interaction, camera, NPC dialogue, quest tracking, inventory, puzzle logic, save/load, audio, settings, chapter transitions, and multiple endings. Use data-driven chapter and quest definitions rather than duplicating logic.

## Visual and performance requirements
- Use GLB/glTF assets for production characters and environment props where available.
- Use optimized materials and textures.
- Use fog, lighting, shadows, and particles with performance budgets.
- Cap device pixel ratio and provide low/medium/high quality presets.
- Support desktop and touch input.
- Provide loading and error states.
- Keep all UI readable over the game scene.

## Development process
Build in milestones and keep the game playable after every milestone:
1. Project foundation and renderer.
2. Player, camera, input, and collision.
3. Five explorable chapter spaces.
4. Interactions, quests, inventory, and journal.
5. NPC dialogue and puzzles.
6. Story cutscenes, audio, and endings.
7. Optimization, testing, and publishing.

## Testing and reporting
For each milestone:
- Run the game in a browser.
- Test all controls.
- Test quest and chapter progression.
- Check console errors.
- Check save/load.
- Test window resize and touch controls.
- Fix critical errors before proceeding.
- Report implemented features, verified tests, limitations, and next tasks.

Do not claim features are complete unless they are implemented and tested. Do not replace 3D gameplay with static screenshots or decorative mockups.

Begin by inspecting the current project and completing the first playable milestone. Preserve working features when extending the project.
