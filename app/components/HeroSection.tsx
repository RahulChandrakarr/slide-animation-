"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    dirLight.position.set(-4, 8, 4);
    scene.add(dirLight);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.2,
      wireframe: false,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const orbitCubes: any[] = [];
    const cubeGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const colors = [0x22c55e, 0xf97316, 0xa855f7, 0x22d3ee];

    const orbitCount = 60;
    const radius = 4;

    for (let i = 0; i < orbitCount; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.4,
        metalness: 0.3,
        roughness: 0.4,
      });

      const cube = new THREE.Mesh(cubeGeometry, material);
      const angle = (i / orbitCount) * Math.PI * 2;
      cube.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      );

      group.add(cube);
      orbitCubes.push(cube);
    }

    let animationFrameId: number;
    let lastTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      group.rotation.y += 0.4 * delta + mouseX * 0.6 * delta;
      group.rotation.x += 0.1 * delta + mouseY * 0.4 * delta;

      orbitCubes.forEach((cube, index) => {
        const t = now * 0.0003 + index * 0.1;
        const r = radius + Math.sin(t * 2) * 0.3;
        cube.position.x = Math.cos(t) * r;
        cube.position.z = Math.sin(t) * r;
        cube.position.y += Math.sin(t * 3) * 0.003;
        cube.rotation.x += delta * 1.2;
        cube.rotation.y += delta * 1.4;
      });

      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      mouseX = x;
      mouseY = -y;
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      orbitCubes.forEach((cube) => {
        cube.geometry.dispose();
        if (Array.isArray(cube.material)) {
          cube.material.forEach((m: any) => (m as any).dispose());
        } else {
          (cube.material as any).dispose();
        }
        group.remove(cube);
      });
      coreGeometry.dispose();
      coreMaterial.dispose();
      scene.remove(group);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-slate-950"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-sky-900/40" />
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-zinc-100">
        <div className="mb-6">
          <h1 className="mb-4 text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Rahul
            </span>
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-zinc-300 sm:text-xl md:text-2xl">
          Welcome to my interactive 3D playground. Move your mouse to control
          the orbital system.
        </p>
        <p className="mt-4 text-sm text-zinc-400 sm:text-base">
          Scroll down to explore more interactive experiences
        </p>
      </div>
    </div>
  );
}
