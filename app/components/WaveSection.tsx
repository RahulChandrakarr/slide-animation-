"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function WaveAnimationScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 1.5, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    const waves: any[] = [];
    const waveCount = 3;
    const segments = 50;

    for (let w = 0; w < waveCount; w++) {
      const geometry = new THREE.PlaneGeometry(4, 4, segments, segments);
      const material = new THREE.MeshStandardMaterial({
        color: [0x22c55e, 0x22d3ee, 0xa855f7][w],
        emissive: [0x22c55e, 0x22d3ee, 0xa855f7][w],
        emissiveIntensity: 0.3,
        wireframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });

      const wave = new THREE.Mesh(geometry, material);
      wave.rotation.x = -Math.PI / 2;
      wave.position.y = (w - 1) * 1.5;
      scene.add(wave);
      waves.push(wave);
    }

    let animationFrameId: number;
    let lastTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      const time = now * 0.001;
      lastTime = now;

      waves.forEach((wave, index) => {
        const positions = wave.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);
          const y =
            Math.sin(
              (x + time * 2 + index * 0.5) * 2 +
                mouseX * 2 +
                Math.cos(z * 2 + time) * 0.5
            ) * 0.3;
          positions.setY(i, y);
        }
        positions.needsUpdate = true;
        wave.geometry.computeVertexNormals();

        wave.rotation.z += delta * 0.1 * (index + 1);
      });

      pointLight.position.x = Math.sin(time) * 3;
      pointLight.position.y = Math.cos(time * 0.7) * 3;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handlePointerMove = (event: PointerEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
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
      waves.forEach((wave) => {
        wave.geometry.dispose();
        if (Array.isArray(wave.material)) {
          wave.material.forEach((m: any) => (m as any).dispose());
        } else {
          (wave.material as any).dispose();
        }
        scene.remove(wave);
      });
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
    />
  );
}

export default function WaveSection() {
  return (
    <section className="relative flex min-h-screen flex-col md:flex-row">
      <div className="flex w-full flex-col items-center justify-center px-8 py-16 md:w-1/2 md:items-start md:px-16 md:py-0 bg-[#020b1d]">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
          Section Two
        </p>
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Dynamic Wave
          <span className="block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Interactions
          </span>
        </h2>
        <p className="max-w-md text-lg leading-relaxed text-zinc-300 sm:text-xl">
          Experience fluid wave animations that respond to your mouse
          movements. Watch as the waves ripple and flow in real-time,
          creating mesmerizing patterns.
        </p>
        <ul className="mt-8 space-y-3 text-zinc-400">
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span>
            Interactive wave deformation
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span>
            Real-time mouse tracking
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">→</span>
            Multi-layered wave effects
          </li>
        </ul>
      </div>
      <div className="h-96 w-full cursor-crosshair md:h-screen md:w-1/2">
        <WaveAnimationScene />
      </div>
    </section>
  );
}
