import * as THREE from 'three';
import { CHAPTERS } from './story.js';
import { createWorld } from './world.js';
import { Player } from './player.js';
import { GameUI } from './ui.js';
import { SaveManager } from './save.js';

const canvas = document.querySelector('#game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x11172c);
scene.fog = new THREE.FogExp2(0x11172c, 0.012);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 250);
const clock = new THREE.Clock();
const ui = new GameUI();
const save = new SaveManager();

let active = false;
let paused = false;
let currentChapter = 0;
let collected = new Set();
let completedQuests = new Set();
let nearbyInteractable = null;
let toastTimer = null;

const world = createWorld(scene, CHAPTERS);
const player = new Player(scene, camera, renderer.domElement);
scene.add(player.group);

function showToast(message) {
  ui.toast(message);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.hideToast(), 2600);
}

function setChapter(index, announce = true) {
  currentChapter = THREE.MathUtils.clamp(index, 0, CHAPTERS.length - 1);
  const chapter = CHAPTERS[currentChapter];
  player.setPosition(chapter.spawn[0], chapter.spawn[2]);
  world.setChapter(currentChapter);
  ui.setChapter(chapter, currentChapter);
  ui.setObjective(chapter.objective, collected.size, chapter.required);
  if (announce) ui.showChapterBanner(chapter, currentChapter);
}

function updateObjective() {
  const chapter = CHAPTERS[currentChapter];
  const count = chapter.items.filter(id => collected.has(id)).length;
  ui.setObjective(chapter.objective, count, chapter.required);
  if (count >= chapter.required && !completedQuests.has(chapter.id)) {
    completedQuests.add(chapter.id);
    showToast(`Memory restored: ${chapter.name}`);
    if (currentChapter < CHAPTERS.length - 1) {
      showToast('A new path has opened. Find the glowing gateway.');
    } else {
      showToast('The five memories are whole. The realm grows quiet.');
    }
  }
}

function interact() {
  if (!nearbyInteractable) return;
  const obj = nearbyInteractable.userData;
  if (obj.kind === 'memory') {
    if (collected.has(obj.itemId)) return;
    collected.add(obj.itemId);
    obj.collected = true;
    nearbyInteractable.visible = false;
    showToast(`Memory discovered: ${obj.label}`);
    updateObjective();
    saveState();
  } else if (obj.kind === 'gate') {
    const next = obj.chapterIndex;
    const required = CHAPTERS[currentChapter].required;
    const found = CHAPTERS[currentChapter].items.filter(id => collected.has(id)).length;
    if (found < required) {
      showToast(`The gateway is sealed. Restore ${required - found} more memory shard(s).`);
      return;
    }
    setChapter(next);
    showToast(`Entering ${CHAPTERS[next].name}`);
    saveState();
  } else if (obj.kind === 'note') {
    showToast(obj.message);
  }
}

function saveState() {
  save.save({
    currentChapter,
    collected: [...collected],
    completedQuests: [...completedQuests],
    player: player.getPosition()
  });
}

function loadState() {
  const data = save.load();
  if (!data) return false;
  currentChapter = Math.min(data.currentChapter || 0, CHAPTERS.length - 1);
  collected = new Set(data.collected || []);
  completedQuests = new Set(data.completedQuests || []);
  setChapter(currentChapter, false);
  world.applyCollected(collected);
  updateObjective();
  return true;
}

ui.onStart(() => {
  document.querySelector('#title-screen').classList.add('hidden');
  document.querySelector('#loading-screen').classList.remove('hidden');
  setTimeout(() => {
    document.querySelector('#loading-screen').classList.add('hidden');
    ui.showGame();
    active = true;
    if (!loadState()) setChapter(0);
    else showToast('Your journey has been restored.');
  }, 450);
});
ui.onInteract(interact);
ui.onPause(() => { paused = !paused; ui.setPaused(paused); });
ui.onResume(() => { paused = false; ui.setPaused(false); });
ui.onSave(() => { saveState(); showToast('Journey saved in this browser.'); });
ui.onTitle(() => {
  paused = false; active = false;
  document.querySelector('#pause-panel').classList.add('hidden');
  document.querySelector('#hud').classList.add('hidden');
  document.querySelector('#objective').classList.add('hidden');
  document.querySelector('#controls-hint').classList.add('hidden');
  document.querySelector('#mobile-controls').classList.add('hidden');
  document.querySelector('#title-screen').classList.remove('hidden');
});
ui.onJournal(() => ui.togglePanel('journal-panel'));
ui.onInventory(() => ui.togglePanel('inventory-panel'));
ui.onClosePanel(() => player.clearInput());
ui.onMobileRun(v => player.setRun(v));
ui.onMobileMove(v => player.setTouchMove(v));
ui.onMobileInteract(interact);

window.addEventListener('keydown', (e) => {
  if (['Tab', ' '].includes(e.key)) e.preventDefault();
  if (!active) return;
  if (e.key.toLowerCase() === 'e') interact();
  if (e.key.toLowerCase() === 'j') ui.togglePanel('journal-panel');
  if (e.key.toLowerCase() === 'i') ui.togglePanel('inventory-panel');
  if (e.key === 'Escape') { paused = !paused; ui.setPaused(paused); }
  player.keyDown(e);
});
window.addEventListener('keyup', e => player.keyUp(e));

function findNearby() {
  let nearest = null, nearestDistance = 2.7;
  for (const object of world.interactables) {
    if (!object.visible) continue;
    const d = player.group.position.distanceTo(object.position);
    if (d < nearestDistance) { nearest = object; nearestDistance = d; }
  }
  nearbyInteractable = nearest;
  if (nearest) ui.showInteraction(nearest.userData.prompt || 'Investigate');
  else ui.hideInteraction();
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.04);
  if (active && !paused && !ui.anyPanelOpen()) {
    player.update(dt);
    findNearby();
    world.update(dt);
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
});

window.addEventListener('beforeunload', saveState);
