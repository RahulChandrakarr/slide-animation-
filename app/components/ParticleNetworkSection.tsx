"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function ParticleNetworkScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const particles: any[] = [];
    const particleCount = 80;
    const geometry = new THREE.SphereGeometry(0.03, 8, 8);
    const colors = [0xf97316, 0xec4899, 0x22d3ee, 0xa855f7];

    for (let i = 0; i < particleCount; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.8,
      });

      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      particle.userData = {
        vx: (Math.random() - 0.5) * 0.008,
        vy: (Math.random() - 0.5) * 0.008,
        vz: (Math.random() - 0.5) * 0.008,
      };
      scene.add(particle);
      particles.push(particle);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.3,
    });
    const lines: any[] = [];

    let animationFrameId: number;
    let lastTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Remove old lines
      lines.forEach((line) => {
        scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
      });
      lines.length = 0;

      // Update particles
      particles.forEach((particle, i) => {
        particle.position.x += particle.userData.vx;
        particle.position.y += particle.userData.vy;
        particle.position.z += particle.userData.vz;

        // Bounce off walls
        if (Math.abs(particle.position.x) > 4) particle.userData.vx *= -1;
        if (Math.abs(particle.position.y) > 4) particle.userData.vy *= -1;
        if (Math.abs(particle.position.z) > 4) particle.userData.vz *= -1;

        // Mouse interaction
        const dx = mouseX * 3 - particle.position.x;
        const dy = -mouseY * 3 - particle.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 2) {
          particle.userData.vx += dx * 0.0003;
          particle.userData.vy += dy * 0.0003;
        }

        // Create connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.position.x - other.position.x;
          const dy = particle.position.y - other.position.y;
          const dz = particle.position.z - other.position.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 1.5) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(
                particle.position.x,
                particle.position.y,
                particle.position.z
              ),
              new THREE.Vector3(
                other.position.x,
                other.position.y,
                other.position.z
              ),
            ]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            lines.push(line);
          }
        });
      });

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

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
      particles.forEach((particle) => {
        particle.geometry.dispose();
        if (Array.isArray(particle.material)) {
          particle.material.forEach((m: any) => (m as any).dispose());
        } else {
          (particle.material as any).dispose();
        }
        scene.remove(particle);
      });
      lines.forEach((line) => {
        line.geometry.dispose();
        line.material.dispose();
      });
      geometry.dispose();
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

export default function ParticleNetworkSection() {
  return (
    <section className="relative flex min-h-screen flex-col md:flex-row-reverse">
      <div className="flex w-full flex-col items-center justify-center px-8 py-16 md:w-1/2 md:items-start md:px-16 md:py-0 bg-[#020b1d]">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-pink-400">
          Section Three
        </p>
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Particle
          <span className="block bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Network
          </span>
        </h2>
        <p className="max-w-md text-lg leading-relaxed text-zinc-300 sm:text-xl">
          Explore a living network of connected particles that form dynamic
          connections. Each particle moves independently while creating
          beautiful visual links.
        </p>
        <ul className="mt-8 space-y-3 text-zinc-400">
          <li className="flex items-center gap-2">
            <span className="text-pink-400">→</span>
            Dynamic particle connections
          </li>
          <li className="flex items-center gap-2">
            <span className="text-pink-400">→</span>
            Mouse-reactive movement
          </li>
          <li className="flex items-center gap-2">
            <span className="text-pink-400">→</span>
            Real-time network formation
          </li>
        </ul>
      </div>
      <div className="h-96 w-full cursor-crosshair md:h-screen md:w-1/2">
        <ParticleNetworkScene />
      </div>
    </section>
  );
}
