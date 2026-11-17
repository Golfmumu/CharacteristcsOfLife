import * as THREE from 'three';

export class Player {
  constructor(scene, camera, canvas) {
    this.scene = scene; this.camera = camera; this.canvas = canvas;
    this.group = new THREE.Group();
    this.group.position.set(0,0,0);
    this.keys = new Set();
    this.touchMove = {x:0,y:0};
    this.run = false;
    this.yaw = 0;
    this.pitch = -0.12;
    this.dragging = false;
    this.lastPointer = {x:0,y:0};
    this.speed = 5.2;
    this.buildCharacter();
    this.bindPointer();
    this.updateCamera(0);
  }
  buildCharacter() {
    const robe = new THREE.MeshStandardMaterial({color:0x3c456d,roughness:.85});
    const skin = new THREE.MeshStandardMaterial({color:0xf0c6ad,roughness:.75});
    const hair = new THREE.MeshStandardMaterial({color:0x29263e,roughness:.9});
    const gold = new THREE.MeshStandardMaterial({color:0xd9b979,metalness:.35,roughness:.5});
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(.48,.95,4,8),robe);
    body.position.y=1.15; body.castShadow=true; this.group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(.39,16,12),skin);
    head.position.y=2.05; head.castShadow=true; this.group.add(head);
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(.42,12,8,0,Math.PI*2,0,Math.PI*.58),hair);
    hairTop.position.set(0,2.19,-.04); hairTop.castShadow=true; this.group.add(hairTop);
    for (let i=0;i<3;i++) {
      const strand = new THREE.Mesh(new THREE.ConeGeometry(.14,.65,5),hair);
      strand.position.set((i-1)*.22,1.98,.27); strand.rotation.x=.4; this.group.add(strand);
    }
    const scarf = new THREE.Mesh(new THREE.BoxGeometry(.9,.17,.22),gold);
    scarf.position.set(0,1.75,-.05); this.group.add(scarf);
    this.body = body;
    this.group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  }
  bindPointer() {
    this.canvas.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button === 0) {
        this.dragging=true; this.lastPointer={x:e.clientX,y:e.clientY};
      }
    });
    window.addEventListener('pointerup',()=>this.dragging=false);
    window.addEventListener('pointermove',e=>{
      if (!this.dragging) return;
      const dx=e.clientX-this.lastPointer.x, dy=e.clientY-this.lastPointer.y;
      this.lastPointer={x:e.clientX,y:e.clientY};
      this.yaw -= dx*.004;
      this.pitch = THREE.MathUtils.clamp(this.pitch + dy*.0025,-.45,.28);
    });
  }
  keyDown(e) { this.keys.add(e.key.toLowerCase()); if(e.key==='Shift') this.run=true; }
  keyUp(e) { this.keys.delete(e.key.toLowerCase()); if(e.key==='Shift') this.run=false; }
  setRun(v) { this.run=v; }
  setTouchMove(v) { this.touchMove=v; }
  clearInput() { this.keys.clear(); this.touchMove={x:0,y:0}; this.run=false; }
  update(dt) {
    const forward = (this.keys.has('w')?1:0) - (this.keys.has('s')?1:0) - this.touchMove.y;
    const side = (this.keys.has('d')?1:0) - (this.keys.has('a')?1:0) + this.touchMove.x;
    const input = new THREE.Vector2(side,forward);
    if(input.length()>1) input.normalize();
    const speed = this.run ? 8.2 : 5.2;
    const forwardVec = new THREE.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw));
    const rightVec = new THREE.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));
    const move = rightVec.multiplyScalar(input.x).add(forwardVec.multiplyScalar(input.y));
    if(move.lengthSq()>0.001) {
      this.group.position.addScaledVector(move, speed*dt);
      this.group.rotation.y = Math.atan2(-move.x,-move.z);
      this.body.position.y = 1.15 + Math.sin(performance.now()*.012)*(this.run?.06:.025);
    }
    // Keep the player inside the current area's playable boundary.
    this.group.position.x = THREE.MathUtils.clamp(this.group.position.x,-26,26);
    this.group.position.z = THREE.MathUtils.clamp(this.group.position.z,-21,21);
    this.updateCamera(dt);
  }
  updateCamera() {
    const target = this.group.position.clone().add(new THREE.Vector3(0,1.65,0));
    const distance = 7.2;
    const horizontal = Math.cos(this.pitch)*distance;
    const offset = new THREE.Vector3(Math.sin(this.yaw)*horizontal, 2.2-Math.sin(this.pitch)*distance, Math.cos(this.yaw)*horizontal);
    const desired = target.clone().add(offset);
    this.camera.position.lerp(desired,.14);
    this.camera.lookAt(target);
  }
  setPosition(x,z) { this.group.position.set(x,0,z); this.updateCamera(0); }
  getPosition() { return {x:this.group.position.x,z:this.group.position.z}; }
}
