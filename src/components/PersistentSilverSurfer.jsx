import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Procedural Surfer Stance Deformation Function
// Transforms the static A-pose model into:
// 1. 'neutral': athletic crouch, staggered surf feet (left foot front, right foot back), sideways torso, balance arms
// 2. 'left': deep inside rail heelside carve, hand dropped to skim the wave, trailing arm high, deep knee bend
// 3. 'right': deep outside rail toeside cutback, weight on right rail, carving arm forward, torso counter-twist
function computeSurferStancePositions(posAttr, type) {
  const count = posAttr.count;
  const newPos = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const origX = posAttr.getX(i);
    const origY = posAttr.getY(i);
    const origZ = posAttr.getZ(i);

    let x = origX;
    let y = origY;
    let z = origZ;

    const h = Math.max(0, Math.min(1, origY / 18.0));

    // Base athletic crouch: drop hips, spine, and torso
    if (origY > 2.0) {
      const crouchFactor = Math.min((origY - 2.0) / 6.0, 1.0);
      y -= crouchFactor * 2.3;
    }

    // Stagger legs into authentic surfing stance:
    // Left leg (origX < 0) steps forward into +Z (front foot)
    // Right leg (origX >= 0) steps back into -Z (rear foot)
    if (origY < 8.0) {
      if (origX < 0) {
        // Front foot (Left)
        z += (1.0 - origY / 8.0) * 2.8;
        x = origX * 0.7 - 0.3; // Narrow stance over center stringer
        // Knee forward flex
        if (origY >= 2.0 && origY < 6.5) {
          z += Math.sin(((origY - 2.0) / 4.5) * Math.PI) * 1.5;
        }
      } else {
        // Back foot (Right)
        z -= (1.0 - origY / 8.0) * 2.6;
        x = origX * 0.7 + 0.3;
        // Back knee drop
        if (origY >= 2.0 && origY < 6.5) {
          z -= Math.sin(((origY - 2.0) / 4.5) * Math.PI) * 1.2;
          x += 0.4;
        }
      }
    }

    // Torso sideways twist and forward athletic angle (surfing stance)
    if (origY >= 8.0 && origY < 15.2 && Math.abs(origX) <= 2.8) {
      // Rotate torso ~32 degrees around Y so chest faces 3/4 along the board
      const angle = 0.52;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const curX = x;
      const curZ = z;
      x = curX * cosA + curZ * sinA;
      z = -curX * sinA + curZ * cosA;

      // Athletic forward lean
      z += (origY - 8.0) * 0.22;
    }

    // Head orientation: looking forward along board
    if (origY >= 15.2) {
      z += 1.5;
      x = origX * 0.9 - 0.2;
    }

    // Arms: Surfing balance styling!
    // Left arm (front/leading arm): reaches forward along the board
    if (origX < -2.0 && origY >= 8.0 && origY < 16.0) {
      const armExtent = (-origX - 2.0) / 4.0;
      z += armExtent * 3.5;
      x = -2.0 - (1.0 - armExtent) * 1.2;
      y += (1.0 - armExtent * 0.5) * 0.3;
    }
    // Right arm (rear/trailing arm): reaches backward for aerodynamic balance
    if (origX > 2.0 && origY >= 8.0 && origY < 16.0) {
      const armExtent = (origX - 2.0) / 4.0;
      z -= armExtent * 3.8;
      x = 2.0 + (1.0 - armExtent) * 1.0;
      y += armExtent * 1.2; // Back hand elevated like a pro surfer
    }

    // ── Carve Variations ──
    if (type === 'left') {
      // Deep left heelside carve
      if (origY > 2.0) y -= 0.95;
      x -= Math.sin(h * Math.PI) * 2.4; // Arc torso & hips toward left rail
      z += Math.sin(h * Math.PI) * 0.7;
      // Front hand drops down to touch/skim the wave face
      if (origX < -2.0 && origY >= 8.0 && origY < 16.0) {
        y -= 2.0;
        z += 1.0;
        x -= 0.6;
      }
      // Rear arm reaches higher for counter-lean balance
      if (origX > 2.0 && origY >= 8.0 && origY < 16.0) {
        y += 1.8;
        z -= 1.4;
        x += 0.8;
      }
    } else if (type === 'right') {
      // Cutback right: shift weight to right toeside rail
      if (origY > 2.0) y -= 0.85;
      x += Math.sin(h * Math.PI) * 2.4; // Arc torso & hips toward right rail
      z -= Math.sin(h * Math.PI) * 0.5;
      // Right hand carves down toward deck
      if (origX > 2.0 && origY >= 8.0 && origY < 16.0) {
        y -= 1.8;
        z += 1.4;
        x += 0.8;
      }
      // Left arm pulls up and across
      if (origX < -2.0 && origY >= 8.0 && origY < 16.0) {
        y += 1.8;
        z -= 1.6;
        x -= 0.6;
      }
    }

    newPos[i * 3] = x;
    newPos[i * 3 + 1] = y;
    newPos[i * 3 + 2] = z;
  }

  return newPos;
}

export function PersistentSilverSurfer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. Three.js Scene, Camera, Renderer ──
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      150
    );
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Procedural Studio Environment for realistic metallic chrome reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;
    envScene.dispose();

    // ── 2. Cinematic Lighting System ──
    // Key White Directional Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(12, 18, 22);
    scene.add(keyLight);

    // Cool Lavender Fill Light
    const fillLight = new THREE.DirectionalLight(0xcbb0ff, 2.0);
    fillLight.position.set(-16, -6, 14);
    scene.add(fillLight);

    // Thread Elite Signature Violet Rim Light (creates vivid purple edge glow on chrome)
    const rimLightViolet = new THREE.DirectionalLight(0x8000FF, 5.8);
    rimLightViolet.position.set(0, 14, -20);
    scene.add(rimLightViolet);

    // Electric Cyan Secondary Rim
    const rimLightCyan = new THREE.DirectionalLight(0x38bdf8, 2.6);
    rimLightCyan.position.set(16, -10, -12);
    scene.add(rimLightCyan);

    // Soft Ambient
    const ambientLight = new THREE.AmbientLight(0x1a122c, 1.1);
    scene.add(ambientLight);

    // ── 3. Texture Loading & PBR Materials ──
    const textureLoader = new THREE.TextureLoader();

    const loadTex = (url, isColor = false) => {
      const tex = textureLoader.load(url);
      if (isColor) {
        tex.colorSpace = THREE.SRGBColorSpace;
      }
      return tex;
    };

    const bodyBase = loadTex('/textures/silversurfer/TEX_1001_BaseColor.png', true);
    const bodyNormal = loadTex('/textures/silversurfer/TEX_1001_Normal.png');
    const bodyRough = loadTex('/textures/silversurfer/TEX_1001_Roughness.png');
    const bodyMetal = loadTex('/textures/silversurfer/TEX_1001_Metallic.png');

    const boardBase = loadTex('/textures/silversurfer/TEX_1002_BaseColor.png', true);
    const boardNormal = loadTex('/textures/silversurfer/TEX_1002_Normal.png');
    const boardRough = loadTex('/textures/silversurfer/TEX_1002_Roughness.png');
    const boardMetal = loadTex('/textures/silversurfer/TEX_1002_Metallic.png');

    // Body Material: Liquid Silver / Chrome with subtle purple sheen
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xdde2ef),
      map: bodyBase,
      normalMap: bodyNormal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughnessMap: bodyRough,
      metalnessMap: bodyMetal,
      metalness: 0.98,
      roughness: 0.14,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      envMapIntensity: 1.5,
    });

    // Surfboard Material: High-Mirror Polish Chrome
    const boardMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf6f8fe),
      map: boardBase,
      normalMap: boardNormal,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughnessMap: boardRough,
      metalnessMap: boardMetal,
      metalness: 1.0,
      roughness: 0.09,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      envMapIntensity: 1.7,
    });

    // Eyes: Glowing Luminescent Silver Core
    const eyesMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      emissive: new THREE.Color(0x9d4edd),
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
    });

    // ── 4. Load Silver Surfer Model with Dynamic Morph Stances ──
    const masterWrapper = new THREE.Group();
    const pivotGroup = new THREE.Group();
    masterWrapper.add(pivotGroup);
    scene.add(masterWrapper);

    let bodyMesh = null;
    let eyesMesh = null;
    const baseScale = 0.40; // Increased prominently for hero visibility (~80% larger)

    const objLoader = new OBJLoader();
    objLoader.load(
      '/SilverSurfer.obj',
      (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            const name = (child.name || '').toLowerCase();
            if (name.includes('board') || name.includes('surf')) {
              child.material = boardMaterial;
            } else if (name.includes('eye')) {
              child.material = eyesMaterial;
              eyesMesh = child;
            } else {
              child.material = bodyMaterial;
              bodyMesh = child;
            }
            child.castShadow = false;
            child.receiveShadow = false;
          }
        });

        // Procedurally morph the body into the authentic crouching surf stance
        // and create Left Carve & Right Cutback morph targets
        if (bodyMesh) {
          const bodyGeom = bodyMesh.geometry;
          const origPosAttr = bodyGeom.attributes.position;

          const neutralStance = computeSurferStancePositions(origPosAttr, 'neutral');
          const leftCarveStance = computeSurferStancePositions(origPosAttr, 'left');
          const rightCutbackStance = computeSurferStancePositions(origPosAttr, 'right');

          // Set base pose to athletic surfing stance
          bodyGeom.setAttribute('position', new THREE.BufferAttribute(neutralStance, 3));
          bodyGeom.computeVertexNormals();

          // Add Left Carve (Target 0) and Right Cutback (Target 1) morph targets
          bodyGeom.morphAttributes.position = [
            new THREE.BufferAttribute(leftCarveStance, 3),
            new THREE.BufferAttribute(rightCutbackStance, 3),
          ];
          bodyMesh.morphTargetInfluences = [0, 0];
        }

        // Apply identical stance deformation to eyes so eye sockets match in all stances
        if (eyesMesh) {
          const eyesGeom = eyesMesh.geometry;
          const origEyesPos = eyesGeom.attributes.position;

          const neutralEyes = computeSurferStancePositions(origEyesPos, 'neutral');
          const leftEyes = computeSurferStancePositions(origEyesPos, 'left');
          const rightEyes = computeSurferStancePositions(origEyesPos, 'right');

          eyesGeom.setAttribute('position', new THREE.BufferAttribute(neutralEyes, 3));
          eyesGeom.computeVertexNormals();

          eyesGeom.morphAttributes.position = [
            new THREE.BufferAttribute(leftEyes, 3),
            new THREE.BufferAttribute(rightEyes, 3),
          ];
          eyesMesh.morphTargetInfluences = [0, 0];
        }

        // Center bounding box: center is at Y = 9.05
        obj.position.set(0, -9.05, 0);
        pivotGroup.add(obj);
      },
      undefined,
      (err) => {
        console.error('Failed to load /SilverSurfer.obj:', err);
      }
    );

    // ── 5. Motion Map Choreography & Dynamic Surfing Poses ──
    // Each section defines:
    // - xPct / yPct / zDepth: 3D world positioning
    // - scale: visual prominence
    // - rotY (yaw heading): pointing direction of board nose
    // - rotZ (banking roll): rail tilt of the surfboard into turns
    // - rotX (pitch): nose elevation
    // - leftMorph: weight of left heelside carve pose (0 to 1)
    // - rightMorph: weight of right toeside cutback pose (0 to 1)
    const SECTION_CHOREOGRAPHY = [
      {
        id: 'hero',
        xPct: 0.50,
        yPct: 0.48,
        scale: 1.15,
        zDepth: 0.5,
        rotY: 0.25,
        rotX: 0.10,
        rotZ: 0.0,
        leftMorph: 0.0,
        rightMorph: 0.0,
      },
      {
        id: 'program',
        xPct: 0.26,
        yPct: 0.68,
        scale: 1.05,
        zDepth: -1.0,
        rotY: -0.80, // Carving left
        rotX: 0.16,
        rotZ: -0.42, // Left rail bank
        leftMorph: 0.85,
        rightMorph: 0.0,
      },
      {
        id: 'about',
        xPct: 0.16,
        yPct: 0.82,
        scale: 1.02,
        zDepth: -2.0,
        rotY: -0.92, // Locked into deep left carve
        rotX: 0.12,
        rotZ: -0.48, // Aggressive left rail bite
        leftMorph: 1.0,
        rightMorph: 0.0,
      },
      {
        id: 'experience',
        xPct: 0.84,
        yPct: 0.80,
        scale: 1.05,
        zDepth: 0.0,
        rotY: 0.92, // Deep cutback snapped to the right
        rotX: 0.14,
        rotZ: 0.48, // Aggressive right rail bank
        leftMorph: 0.0,
        rightMorph: 1.0,
      },
      {
        id: 'journey',
        xPct: 0.16,
        yPct: 0.82,
        scale: 1.02,
        zDepth: -1.5,
        rotY: -0.92, // Swept back to left carve
        rotX: 0.12,
        rotZ: -0.48,
        leftMorph: 1.0,
        rightMorph: 0.0,
      },
      {
        id: 'tasks',
        xPct: 0.84,
        yPct: 0.80,
        scale: 1.05,
        zDepth: 0.0,
        rotY: 0.92, // Right rail cutback
        rotX: 0.14,
        rotZ: 0.48,
        leftMorph: 0.0,
        rightMorph: 1.0,
      },
      {
        id: 'leaderboard',
        xPct: 0.16,
        yPct: 0.82,
        scale: 1.02,
        zDepth: -2.0,
        rotY: -0.92, // Left rail dock
        rotX: 0.12,
        rotZ: -0.45,
        leftMorph: 1.0,
        rightMorph: 0.0,
      },
      {
        id: 'community',
        xPct: 0.84,
        yPct: 0.80,
        scale: 1.05,
        zDepth: 0.0,
        rotY: 0.92, // Right rail glide
        rotX: 0.14,
        rotZ: 0.48,
        leftMorph: 0.0,
        rightMorph: 1.0,
      },
      {
        id: 'governance',
        xPct: 0.26,
        yPct: 0.75,
        scale: 1.02,
        zDepth: -1.5,
        rotY: -0.70,
        rotX: 0.12,
        rotZ: -0.35,
        leftMorph: 0.75,
        rightMorph: 0.0,
      },
      {
        id: 'faq',
        xPct: 0.50,
        yPct: 0.72,
        scale: 1.05,
        zDepth: -0.5,
        rotY: 0.18,
        rotX: 0.08,
        rotZ: 0.0,
        leftMorph: 0.0,
        rightMorph: 0.0,
      },
      {
        id: 'final-cta',
        xPct: 0.50,
        yPct: 0.50,
        scale: 1.25,
        zDepth: 2.5,
        rotY: 0.28,
        rotX: 0.12,
        rotZ: 0.0,
        leftMorph: 0.0,
        rightMorph: 0.0,
      },
    ];

    // Helper: calculate 3D world position from viewport percentage
    const computeWorldPosition = (xPct, yPct, zDepth = 0) => {
      const distance = camera.position.z - zDepth;
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
      const visibleWidth = visibleHeight * camera.aspect;

      const isMobile = window.innerWidth < 768;
      let effectiveXPct = xPct;
      let effectiveYPct = yPct;

      // On mobile screens, keep docked subtly near bottom corners/center so text is never obscured
      if (isMobile) {
        if (xPct < 0.35) {
          effectiveXPct = 0.20;
        } else if (xPct > 0.65) {
          effectiveXPct = 0.80;
        } else {
          effectiveXPct = 0.50;
        }
        effectiveYPct = Math.max(0.82, yPct);
      }

      const worldX = (effectiveXPct - 0.5) * visibleWidth;
      const worldY = (0.5 - effectiveYPct) * visibleHeight;
      const worldZ = zDepth;

      return { x: worldX, y: worldY, z: worldZ };
    };

    // State for smooth physics and dampening
    const currentPos = new THREE.Vector3(0, 0, 0);
    const targetPos = new THREE.Vector3(0, 0, 0);

    const currentRot = { x: 0.1, y: 0.25, z: 0 };
    const targetRot = { x: 0.1, y: 0.25, z: 0 };

    let currentLeftMorph = 0;
    let targetLeftMorph = 0;

    let currentRightMorph = 0;
    let targetRightMorph = 0;

    let currentScale = 1.15;
    let targetScale = 1.15;

    let prevTargetX = 0;
    let dynamicVelocityBank = 0;

    // ── 6. Scroll Position Calculation with Fluid Surfing Transition ──
    const updateTargetFromScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight;
      const centerScroll = scrollY + vh * 0.5;

      // Collect bounding positions of registered sections
      const activeTargets = [];
      SECTION_CHOREOGRAPHY.forEach((cfg) => {
        const el = document.getElementById(cfg.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elDocCenter = scrollY + rect.top + rect.height * 0.5;
          activeTargets.push({ ...cfg, docCenter: elDocCenter });
        }
      });

      if (activeTargets.length === 0) return;

      // Find bracketing sections
      let prev = activeTargets[0];
      let next = activeTargets[activeTargets.length - 1];

      if (centerScroll <= prev.docCenter) {
        const p = computeWorldPosition(prev.xPct, prev.yPct, prev.zDepth);
        targetPos.set(p.x, p.y, p.z);
        targetRot.x = prev.rotX;
        targetRot.y = prev.rotY;
        targetRot.z = prev.rotZ;
        targetLeftMorph = prev.leftMorph;
        targetRightMorph = prev.rightMorph;
        targetScale = prev.scale;
        return;
      }

      if (centerScroll >= next.docCenter) {
        const p = computeWorldPosition(next.xPct, next.yPct, next.zDepth);
        targetPos.set(p.x, p.y, p.z);
        targetRot.x = next.rotX;
        targetRot.y = next.rotY;
        targetRot.z = next.rotZ;
        targetLeftMorph = next.leftMorph;
        targetRightMorph = next.rightMorph;
        targetScale = next.scale;
        return;
      }

      for (let i = 0; i < activeTargets.length - 1; i++) {
        if (
          centerScroll >= activeTargets[i].docCenter &&
          centerScroll <= activeTargets[i + 1].docCenter
        ) {
          prev = activeTargets[i];
          next = activeTargets[i + 1];
          break;
        }
      }

      const range = next.docCenter - prev.docCenter || 1;
      const rawT = Math.min(Math.max((centerScroll - prev.docCenter) / range, 0), 1);
      // Smooth cubic ease-in-out for realistic acceleration & deceleration
      const smoothT = rawT * rawT * (3 - 2 * rawT);

      // Arc curve during lateral sweeps (simulates dropping in and carving out of a wave face)
      const arcYOffset = Math.sin(smoothT * Math.PI) * -0.05;

      const interpXPct = prev.xPct + (next.xPct - prev.xPct) * smoothT;
      const interpYPct = prev.yPct + (next.yPct - prev.yPct) * smoothT + arcYOffset;
      const interpZDepth = prev.zDepth + (next.zDepth - prev.zDepth) * smoothT;

      const p = computeWorldPosition(interpXPct, interpYPct, interpZDepth);
      targetPos.set(p.x, p.y, p.z);

      // Dynamic rail-to-rail roll during lateral transition
      const deltaLateral = next.xPct - prev.xPct;
      let midTransitionBank = 0;
      if (Math.abs(deltaLateral) > 0.3) {
        // As he carves across the screen, the board aggressively banks into the trajectory
        midTransitionBank = Math.sin(smoothT * Math.PI) * (deltaLateral > 0 ? 0.35 : -0.35);
      }

      targetRot.x = prev.rotX + (next.rotX - prev.rotX) * smoothT;
      targetRot.y = prev.rotY + (next.rotY - prev.rotY) * smoothT;
      targetRot.z = prev.rotZ + (next.rotZ - prev.rotZ) * smoothT + midTransitionBank;

      // Stance morph transition: smoothly blends between Left Carve, Neutral, and Right Cutback
      targetLeftMorph = prev.leftMorph + (next.leftMorph - prev.leftMorph) * smoothT;
      targetRightMorph = prev.rightMorph + (next.rightMorph - prev.rightMorph) * smoothT;

      targetScale = prev.scale + (next.scale - prev.scale) * smoothT;
    };

    // Initial positioning
    updateTargetFromScroll();
    currentPos.copy(targetPos);
    currentRot.x = targetRot.x;
    currentRot.y = targetRot.y;
    currentRot.z = targetRot.z;
    currentLeftMorph = targetLeftMorph;
    currentRightMorph = targetRightMorph;
    currentScale = targetScale;

    // Scroll listener with passive flag
    const handleScroll = () => {
      updateTargetFromScroll();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      updateTargetFromScroll();
    };
    window.addEventListener('resize', handleResize);

    // ── 7. Animation Loop with Authentic Surfer Carving Physics ──
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Measure lateral movement velocity
      const deltaX = targetPos.x - prevTargetX;
      prevTargetX = targetPos.x;

      // Active carving velocity adjustments:
      // When moving fast right (deltaX > 0), bank right, aim nose right, accentuate right cutback
      // When moving fast left (deltaX < 0), bank left, aim nose left, accentuate left carve
      const dynamicBank = Math.max(-0.55, Math.min(0.55, -deltaX * 3.8));
      dynamicVelocityBank += (dynamicBank - dynamicVelocityBank) * 0.12;

      // Dynamic morph acceleration from velocity
      let velocityLeftBoost = 0;
      let velocityRightBoost = 0;
      if (deltaX < -0.05) {
        velocityLeftBoost = Math.min(0.4, -deltaX * 0.25);
      } else if (deltaX > 0.05) {
        velocityRightBoost = Math.min(0.4, deltaX * 0.25);
      }

      // Interpolation dampening
      const lerpFactor = prefersReducedMotion ? 0.15 : 0.08;

      currentPos.lerp(targetPos, lerpFactor);
      currentScale += (targetScale - currentScale) * lerpFactor;

      currentRot.x += (targetRot.x - currentRot.x) * lerpFactor;
      currentRot.y += (targetRot.y - currentRot.y) * lerpFactor;
      currentRot.z += (targetRot.z + dynamicVelocityBank - currentRot.z) * lerpFactor;

      currentLeftMorph += (Math.min(1.0, targetLeftMorph + velocityLeftBoost) - currentLeftMorph) * lerpFactor;
      currentRightMorph += (Math.min(1.0, targetRightMorph + velocityRightBoost) - currentRightMorph) * lerpFactor;

      // Organic cosmic wave idle balance when resting on a section
      let idleOffsetY = 0;
      let idleBoardRoll = 0;
      let idleBoardPitch = 0;

      if (!prefersReducedMotion) {
        // Vertical swell
        idleOffsetY = Math.sin(elapsedTime * 2.0) * 0.35;
        // Subtle rocking on board rails
        idleBoardRoll = Math.sin(elapsedTime * 1.6) * 0.04;
        idleBoardPitch = Math.cos(elapsedTime * 1.4) * 0.025;
      }

      // Apply master position
      masterWrapper.position.set(
        currentPos.x,
        currentPos.y + idleOffsetY,
        currentPos.z
      );

      // Mobile scale multiplier
      const isMobile = window.innerWidth < 768;
      const deviceScaleMultiplier = isMobile ? 0.72 : 1.0;
      const finalScale = baseScale * currentScale * deviceScaleMultiplier;
      masterWrapper.scale.set(finalScale, finalScale, finalScale);

      // Apply rotation on main board pivot (heading, pitch, bank)
      pivotGroup.rotation.x = currentRot.x + idleBoardPitch;
      pivotGroup.rotation.y = currentRot.y;
      pivotGroup.rotation.z = currentRot.z + idleBoardRoll;

      // Update morph target weights on body and eyes meshes in real-time
      if (bodyMesh && bodyMesh.morphTargetInfluences) {
        bodyMesh.morphTargetInfluences[0] = Math.max(0, Math.min(1, currentLeftMorph));
        bodyMesh.morphTargetInfluences[1] = Math.max(0, Math.min(1, currentRightMorph));
      }

      if (eyesMesh && eyesMesh.morphTargetInfluences) {
        eyesMesh.morphTargetInfluences[0] = Math.max(0, Math.min(1, currentLeftMorph));
        eyesMesh.morphTargetInfluences[1] = Math.max(0, Math.min(1, currentRightMorph));
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── 8. Cleanup on Unmount ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      pmremGenerator.dispose();
      renderer.dispose();

      // Dispose textures
      bodyBase.dispose();
      bodyNormal.dispose();
      bodyRough.dispose();
      bodyMetal.dispose();
      boardBase.dispose();
      boardNormal.dispose();
      boardRough.dispose();
      boardMetal.dispose();

      // Dispose materials & geometries
      bodyMaterial.dispose();
      boardMaterial.dispose();
      eyesMaterial.dispose();

      scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
          child.geometry.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default PersistentSilverSurfer;
