import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ProgressionPlatformsCanvas({ activeStage = 1, onSelectStage }) {
  const containerRef = useRef(null);
  const platformsRef = useRef([]);
  const lightsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 6.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient light - bright & clean
    const ambient = new THREE.AmbientLight(0xFFFFFF, 2.2);
    scene.add(ambient);

    // Directional Key Light
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.4);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const group = new THREE.Group();
    scene.add(group);

    // 5 Dimensional Platforms along X axis
    const platforms = [];
    const lights = [];
    const spacing = 1.8;
    const startX = -((5 - 1) * spacing) / 2;

    // Shades of Magenta & White
    const magentaShades = [0xFF2E93, 0xFF007A, 0xD946EF, 0xC026D3, 0xFF007A];

    for (let i = 0; i < 5; i++) {
      const pGroup = new THREE.Group();
      pGroup.position.set(startX + i * spacing, (i - 2) * 0.18, 0);

      // Clean White Platform cylinder with subtle bevel
      const geom = new THREE.CylinderGeometry(0.72, 0.8, 0.24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        metalness: 0.15,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.userData = { stageIndex: i + 1 };
      pGroup.add(mesh);

      // Edge highlighted in magenta
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({
          color: i + 1 === activeStage ? 0xFF007A : 0xE2E8F0,
          linewidth: i + 1 === activeStage ? 2 : 1,
        })
      );
      pGroup.add(edge);

      // Stage Light - Magenta
      const pLight = new THREE.PointLight(
        i + 1 === activeStage ? 0xFF007A : 0xE2E8F0,
        i + 1 === activeStage ? 28 : 2,
        4
      );
      pLight.position.set(0, 0.6, 0);
      pGroup.add(pLight);

      // Floating Marker above platform
      const markerGeom = new THREE.OctahedronGeometry(0.14);
      const markerMat = new THREE.MeshBasicMaterial({ color: magentaShades[i] });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.y = 0.58;
      pGroup.add(marker);

      group.add(pGroup);
      platforms.push({ group: pGroup, mesh, edge, light: pLight, marker, index: i + 1 });
      lights.push(pLight);
    }

    platformsRef.current = platforms;
    lightsRef.current = lights;

    // Magenta Pathway line connecting platforms
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push(new THREE.Vector3(startX + i * spacing, (i - 2) * 0.18 - 0.12, 0));
    }
    const pathwayGeom = new THREE.BufferGeometry().setFromPoints(points);
    const pathwayMat = new THREE.LineBasicMaterial({ color: 0xFF007A, linewidth: 2.5 });
    const pathway = new THREE.Line(pathwayGeom, pathwayMat);
    group.add(pathway);

    // Raycaster for clicking on 3D platforms
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      if (!onSelectStage) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const meshes = platforms.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        const stage = intersects[0].object.userData.stageIndex;
        if (stage) onSelectStage(stage);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Floating markers & active platform pulse
      platforms.forEach((p, idx) => {
        p.marker.rotation.y = t * 1.2 + idx;
        p.marker.rotation.x = Math.sin(t * 0.8 + idx) * 0.3;
        if (p.index === activeStage) {
          p.group.position.y = (idx - 2) * 0.18 + Math.sin(t * 2) * 0.05;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pathwayGeom.dispose();
    };
  }, [onSelectStage, activeStage]);

  // Update lights & materials when activeStage changes
  useEffect(() => {
    if (!platformsRef.current.length) return;
    platformsRef.current.forEach((p) => {
      const isActive = p.index === activeStage;
      p.edge.material.color.setHex(isActive ? 0xFF007A : 0xE2E8F0);
      p.light.color.setHex(isActive ? 0xFF007A : 0xE2E8F0);
      p.light.intensity = isActive ? 30 : 2;
    });
  }, [activeStage]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[280px] md:h-[340px] relative overflow-hidden cursor-pointer"
      aria-label="3D Five Levels Progression Visualization"
    />
  );
}

export default ProgressionPlatformsCanvas;
