import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeShieldCanvas() {
  const containerRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08070C, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Physical & Emissive Lighting
    const ambientLight = new THREE.AmbientLight(0x100D17, 2.2);
    scene.add(ambientLight);

    const keyVioletLight = new THREE.PointLight(0x8000FF, 50, 15);
    keyVioletLight.position.set(3, 4, 4);
    scene.add(keyVioletLight);

    const rimVioletLight = new THREE.PointLight(0xBD7AFF, 40, 12);
    rimVioletLight.position.set(-3, -3, 3);
    scene.add(rimVioletLight);

    const greenEmissiveLight = new THREE.PointLight(0x8CCF42, 25, 8);
    greenEmissiveLight.position.set(0, 0, 2);
    scene.add(greenEmissiveLight);

    // 3. Central Dimensional Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Physical Metallic Shield
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 2.3);
    shieldShape.bezierCurveTo(1.6, 2.3, 1.8, 1.3, 1.8, 0.2);
    shieldShape.bezierCurveTo(1.8, -1.2, 0.9, -2.1, 0, -2.6);
    shieldShape.bezierCurveTo(-0.9, -2.1, -1.8, -1.2, -1.8, 0.2);
    shieldShape.bezierCurveTo(-1.8, 1.3, -1.6, 2.3, 0, 2.3);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    // Metallic Obsidian Material
    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x120E1C,
      roughness: 0.22,
      metalness: 0.88,
    });
    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    masterGroup.add(shieldMesh);

    // Violet Edge Wireframe / Highlight
    const edgeGeometry = new THREE.EdgesGeometry(shieldGeometry, 18);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x8000FF,
      linewidth: 2,
    });
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    masterGroup.add(edgeLines);

    // Green Security Lightning Emblem
    const emblemShape = new THREE.Shape();
    emblemShape.moveTo(0.1, 1.1);
    emblemShape.lineTo(-0.6, 0.0);
    emblemShape.lineTo(-0.1, 0.0);
    emblemShape.lineTo(-0.25, -1.1);
    emblemShape.lineTo(0.65, 0.15);
    emblemShape.lineTo(0.12, 0.15);
    emblemShape.closePath();

    const emblemGeometry = new THREE.ExtrudeGeometry(emblemShape, {
      depth: 0.12,
      bevelEnabled: false,
    });
    emblemGeometry.center();

    const emblemMaterial = new THREE.MeshStandardMaterial({
      color: 0x8CCF42,
      emissive: 0x8CCF42,
      emissiveIntensity: 0.65,
      roughness: 0.1,
      metalness: 0.5,
    });
    const emblemMesh = new THREE.Mesh(emblemGeometry, emblemMaterial);
    emblemMesh.position.z = 0.28;
    masterGroup.add(emblemMesh);

    // 4. Concentric Architectural Rings
    const ring1Geom = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x38264F });
    const ring1 = new THREE.Mesh(ring1Geom, ringMaterial);
    ring1.rotation.x = Math.PI / 2.3;
    scene.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(4.0, 0.025, 16, 120);
    const ring2Material = new THREE.MeshBasicMaterial({ color: 0x4B1385 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Material);
    ring2.rotation.x = Math.PI / 2.8;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(2.5, 0.015, 16, 80);
    const ring3Material = new THREE.MeshBasicMaterial({ color: 0x8000FF });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Material);
    ring3.rotation.x = Math.PI / 3.2;
    scene.add(ring3);

    // 5. Ambient Quantum Particles
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const violetColor = new THREE.Color(0x8000FF);
    const greenColor = new THREE.Color(0x8CCF42);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const pick = Math.random() > 0.85 ? greenColor : violetColor;
      colors[i * 3] = pick.r;
      colors[i * 3 + 1] = pick.g;
      colors[i * 3 + 2] = pick.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Mouse Tracking & Parallax
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = -y * 0.6;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for mouse parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Shield oscillation & breathing
      masterGroup.rotation.y = Math.sin(elapsedTime * 0.45) * 0.18 + mouseX;
      masterGroup.rotation.x = Math.cos(elapsedTime * 0.35) * 0.1 + mouseY;
      masterGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.08;

      // Ring rotations
      ring1.rotation.z = elapsedTime * 0.12;
      ring2.rotation.z = -elapsedTime * 0.08;
      ring3.rotation.z = elapsedTime * 0.18;

      // Particle subtle drift
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      shieldGeometry.dispose();
      emblemGeometry.dispose();
      particleGeometry.dispose();
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#08070C]">
        <div className="w-64 h-80 border border-[#8000FF] bg-[#15111F] rounded-lg flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-20 border-2 border-[#8000FF] bg-[#1D1729] rounded flex items-center justify-center mb-4 text-[#8CCF42] font-mono text-2xl font-bold">
            TE
          </div>
          <span className="text-[#BD7AFF] font-mono text-xs tracking-widest uppercase">Thread Elite Emblem</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px] md:min-h-[640px] relative pointer-events-auto"
      style={{ touchAction: 'none' }}
      aria-label="3D Interactive Thread Elite Shield Chamber"
    />
  );
}
