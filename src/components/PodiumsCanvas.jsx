import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function PodiumsCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 2.0, 5.0);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x08070C, 2.5);
    scene.add(ambient);

    const violetLight = new THREE.PointLight(0x8000FF, 30, 8);
    violetLight.position.set(0, 2, 2);
    scene.add(violetLight);

    const group = new THREE.Group();
    scene.add(group);

    // Podiums: 2nd (left), 1st (center, tallest), 3rd (right)
    const configs = [
      { x: -1.4, h: 1.1, label: '02', color: 0x38264F },
      { x: 0, h: 1.7, label: '01', color: 0x8000FF },
      { x: 1.4, h: 0.8, label: '03', color: 0x292132 },
    ];

    const podiumMeshes = [];

    configs.forEach((cfg) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(cfg.x, -0.6 + cfg.h / 2, 0);

      const geom = new THREE.CylinderGeometry(0.55, 0.65, cfg.h, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x15111F,
        metalness: 0.85,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geom, mat);
      pGroup.add(mesh);

      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geom),
        new THREE.LineBasicMaterial({ color: cfg.color })
      );
      pGroup.add(edge);

      // Floating crystal badge on top
      const badgeGeom = new THREE.OctahedronGeometry(0.14);
      const badgeMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const badge = new THREE.Mesh(badgeGeom, badgeMat);
      badge.position.y = cfg.h / 2 + 0.35;
      pGroup.add(badge);

      group.add(pGroup);
      podiumMeshes.push({ pGroup, badge, h: cfg.h });
    });

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      group.rotation.y = Math.sin(t * 0.4) * 0.15;
      podiumMeshes.forEach((p, i) => {
        p.badge.rotation.y = t * (1.0 + i * 0.3);
        p.badge.position.y = p.h / 2 + 0.35 + Math.sin(t * 2.0 + i) * 0.05;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[220px] md:h-[280px] relative overflow-hidden"
      aria-label="3D Leaderboard Podiums"
    />
  );
}
