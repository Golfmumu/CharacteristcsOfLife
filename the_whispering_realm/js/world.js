import * as THREE from 'three';

const mat = (color, roughness = 0.9, emissive = 0x000000) =>
  new THREE.MeshStandardMaterial({ color, roughness, emissive, emissiveIntensity: emissive ? 0.65 : 0 });

function box(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}
function addTree(group, x, z, scale = 1, color = 0x233b3d) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18*scale, .28*scale, 2.1*scale, 7), mat(0x493d3b));
  trunk.position.set(x, 1.05*scale, z); trunk.castShadow = true; group.add(trunk);
  for (let i=0;i<3;i++) {
    const crown = new THREE.Mesh(new THREE.ConeGeometry((1.1-i*.17)*scale, 2.2*scale, 7), mat(color));
    crown.position.set(x, (2.2+i*.62)*scale, z); crown.castShadow = true; group.add(crown);
  }
}
function addHouse(group, x, z, palette, scale=1) {
  const base = box(4*scale, 2.8*scale, 3.6*scale, mat(palette.wall), x, 1.4*scale, z);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.1*scale, 2*scale, 4), mat(palette.roof));
  roof.rotation.y = Math.PI/4; roof.position.set(x, 3.65*scale, z); roof.scale.z = .8; roof.castShadow = true;
  const door = box(.8*scale, 1.55*scale, .12, mat(0x211c2c), x, .78*scale, z+1.86*scale);
  group.add(base, roof, door);
  const windowMat = mat(0x9bb7d8, .35, 0x344e82);
  group.add(box(.55*scale,.6*scale,.08,windowMat,x-1.25*scale,1.75*scale,z+1.86*scale));
  group.add(box(.55*scale,.6*scale,.08,windowMat,x+1.25*scale,1.75*scale,z+1.86*scale));
}
function makeMemory(group, id, label, x, z, interactables) {
  const holder = new THREE.Group(); holder.position.set(x, 1.1, z);
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(.55, 0), mat(0x8bd9f4, .2, 0x45b8ff));
  crystal.rotation.z = .2; crystal.castShadow = true; holder.add(crystal);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.85,.035,8,40), mat(0xe7c98c, .3, 0x8d6a2d));
  ring.rotation.x = Math.PI/2; holder.add(ring);
  holder.userData = { kind: 'memory', itemId: id, label, prompt: `Collect ${label}` };
  group.add(holder); interactables.push(holder);
}
function buildArea(scene, chapter, index, interactables) {
  const group = new THREE.Group();
  // Each chapter is a separate scene zone shown one at a time; keep local coordinates aligned with the player.
  const palettes = [
    { ground:0x303744, wall:0x5a5667, roof:0x292d43, tree:0x263d42, sky:0x11172c, fog:0x182235 },
    { ground:0x263b38, wall:0x536c5d, roof:0x263a36, tree:0x244c43, sky:0x101e24, fog:0x17332e },
    { ground:0x343348, wall:0x66617b, roof:0x343149, tree:0x37374c, sky:0x171629, fog:0x29233e },
    { ground:0x393333, wall:0x63504b, roof:0x302b31, tree:0x3e3430, sky:0x211918, fog:0x382723 },
    { ground:0x292e4b, wall:0x66658a, roof:0x35304f, tree:0x3d3c69, sky:0x17152e, fog:0x29244a }
  ][index];
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(58, 46), mat(palettes.ground));
  ground.rotation.x = -Math.PI/2; ground.position.set(0,0,0); ground.receiveShadow = true; group.add(ground);

  const ambient = new THREE.HemisphereLight(0xc6d7ff, 0x252033, 1.55); group.add(ambient);
  const moon = new THREE.DirectionalLight(0xb7caff, 2.0); moon.position.set(-8,18,8); moon.castShadow = true;
  moon.shadow.mapSize.set(1024,1024); moon.shadow.camera.left=-30; moon.shadow.camera.right=30; moon.shadow.camera.top=30; moon.shadow.camera.bottom=-30; group.add(moon);
  const warm = new THREE.PointLight(0xffb86b, 18, 18); warm.position.set(0,4,0); group.add(warm);

  const palette = { wall:palettes.wall, roof:palettes.roof };
  if (index === 0) {
    addHouse(group,-9,-5,palette,1.1); addHouse(group,9,-7,palette,.95); addHouse(group,-10,8,palette,.9); addHouse(group,10,8,palette,1.05);
    const tower = new THREE.Group(); tower.position.set(0,0,-12);
    tower.add(box(3,9,3,mat(0x514e64),0,4.5,0));
    const cap = new THREE.Mesh(new THREE.ConeGeometry(2.7,3,4),mat(0x25283e)); cap.position.y=10.3; cap.rotation.y=Math.PI/4; tower.add(cap);
    tower.add(box(1.2,1.2,.12,mat(0xf1d69a,.2,0xc18b43),0,7.5,1.57)); group.add(tower);
  } else if (index === 1) {
    for (let i=0;i<28;i++) addTree(group, (Math.sin(i*12.3)*21), (Math.cos(i*8.7)*17), .8+(i%4)*.15, palettes.tree);
    addHouse(group,0,-10,palette,.8);
  } else if (index === 2) {
    const hall = box(18,10,12,mat(palettes.wall),0,5,-7); group.add(hall);
    for (let x=-7;x<=7;x+=4) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(.55,.7,10,8),mat(0x8a8294));
      pillar.position.set(x,5,-.4); pillar.castShadow=true; group.add(pillar);
    }
    const window = box(5,5,.15,mat(0x8a9bd5,.3,0x4858b2),0,6,-.82); group.add(window);
  } else if (index === 3) {
    for (let i=0;i<7;i++) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(.8,1,8,7),mat(0x594b4a));
      pillar.position.set(-12+i*4,4,-7-(i%2)*5); group.add(pillar);
    }
    group.add(box(22,.7,2,mat(0x66534b),0,2,-17));
  } else {
    for (let i=0;i<8;i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7+(i%3),0),mat(0x5b5784));
      rock.position.set(Math.sin(i*4)*15,5+(i%3)*2,-10-(i*3)); rock.rotation.set(i*.3,i*.5,0); group.add(rock);
    }
    const arch = new THREE.Mesh(new THREE.TorusGeometry(4,.55,10,32,Math.PI),mat(0xbba5ee,.4,0x6551a5));
    arch.position.set(0,5,-13); group.add(arch);
  }

  // Boundary stones and lanterns establish the playable area.
  for (let x=-25;x<=25;x+=5) {
    const stone = box(.7,1.1,.7,mat(0x4a4c5d),x,.55,20); group.add(stone);
  }
  for (const [x,z] of [[-16,0],[16,0],[0,15],[0,-19]]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,3,8),mat(0x4a3d3c));
    post.position.set(x,1.5,z); group.add(post);
    const lamp = new THREE.PointLight(0xffc77d, 8, 10); lamp.position.set(x,2.8,z); group.add(lamp);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.18,10,10),mat(0xffd69b,.2,0xff9f42)); bulb.position.set(x,2.8,z); group.add(bulb);
  }

  const ids = chapter.items;
  makeMemory(group,ids[0],chapter.itemLabels[0],-6,3,interactables);
  makeMemory(group,ids[1],chapter.itemLabels[1],7,-2,interactables);

  const note = new THREE.Mesh(new THREE.BoxGeometry(.8,.12,.55),mat(0xe2d6b6));
  note.position.set(3,.9,5); note.userData={kind:'note',prompt:'Read the weathered note',message:'“When the bell rings, do not follow the voice that knows your name.”'};
  group.add(note); interactables.push(note);

  const gate = new THREE.Group(); gate.position.set(0,0,18);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2,.22,12,48),mat(0x83d9ef,.25,0x3a9ec5));
  ring.position.y=2.5; gate.add(ring);
  const glow = new THREE.PointLight(0x65c9ff,12,12); glow.position.y=2.5; gate.add(glow);
  gate.userData={kind:'gate',chapterIndex:index+1,prompt:index===4?'The realm is quiet':'Enter the next chapter'};
  if (index < 4) { group.add(gate); interactables.push(gate); }

  scene.add(group);
  return group;
}

export function createWorld(scene, chapters) {
  const interactables = [];
  const areas = chapters.map((chapter,i)=>buildArea(scene,chapter,i,interactables));
  const floaters = interactables.filter(o=>o.userData.kind==='memory');
  return {
    interactables,
    setChapter(index) {
      areas.forEach((area,i)=>area.visible=i===index);
      scene.fog.color.set([0x182235,0x17332e,0x29233e,0x382723,0x29244a][index]);
      scene.background.copy(scene.fog.color);
      scene.fog.density = index===1 ? .018 : .012;
    },
    applyCollected(collected) {
      for (const obj of floaters) {
        if (collected.has(obj.userData.itemId)) obj.visible=false;
      }
    },
    update(dt) {
      for (const obj of floaters) if (obj.visible) {
        obj.rotation.y += dt*.7;
        obj.position.y = 1.1 + Math.sin(performance.now()*.0015 + obj.position.x)*.12;
      }
    }
  };
}
