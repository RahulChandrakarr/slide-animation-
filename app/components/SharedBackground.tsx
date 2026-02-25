"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SharedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create floating geometric shapes
    const shapes: any[] = [];
    const shapeCount = 40;
    const geometries = [
      () => new THREE.TetrahedronGeometry(0.3, 0),
      () => new THREE.OctahedronGeometry(0.3, 0),
      () => new THREE.IcosahedronGeometry(0.25, 0),
      () => new THREE.BoxGeometry(0.4, 0.4, 0.4),
    ];
    const colors = [0x8b5cf6, 0x06b6d4, 0xec4899, 0xf59e0b, 0x10b981];

    for (let i = 0; i < shapeCount; i++) {
      const geometry = geometries[i % geometries.length]();
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9,
      });

      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
      shape.userData = {
        originalX: shape.position.x,
        originalY: shape.position.y,
        originalZ: shape.position.z,
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        rotationSpeedZ: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.01 + 0.005,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(shape);
      shapes.push(shape);
    }

    let animationFrameId: number;
    let lastTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      const time = now * 0.001;
      lastTime = now;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Animate shapes
      shapes.forEach((shape, index) => {
        const userData = shape.userData;

        // Floating motion
        shape.position.y =
          userData.originalY +
          Math.sin(time * userData.floatSpeed * 10 + userData.phase) * 1.5;

        // Mouse interaction - shapes are attracted to cursor
        const mouseInfluence = 3;
        const dx = mouseX * mouseInfluence - shape.position.x;
        const dy = -mouseY * mouseInfluence - shape.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 4;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          shape.position.x += dx * force * 0.03;
          shape.position.y += dy * force * 0.03;
        } else {
          // Return to original position with spring
          shape.position.x +=
            (userData.originalX - shape.position.x) * 0.02;
          shape.position.y +=
            (userData.originalY - shape.position.y) * 0.02;
        }

        // Rotation
        shape.rotation.x += userData.rotationSpeedX + delta * 0.5;
        shape.rotation.y += userData.rotationSpeedY + delta * 0.7;
        shape.rotation.z += userData.rotationSpeedZ + delta * 0.3;

        // Pulsing scale
        const scale = 1 + Math.sin(time * 2 + index * 0.5) * 0.15;
        shape.scale.set(scale, scale, scale);
      });

      // Rotate lights
      pointLight1.position.x = Math.cos(time * 0.5) * 6;
      pointLight1.position.y = Math.sin(time * 0.5) * 6;
      pointLight2.position.x = Math.cos(time * 0.5 + Math.PI) * 6;
      pointLight2.position.y = Math.sin(time * 0.5 + Math.PI) * 6;

      // Camera follows mouse slightly
      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handlePointerMove = (event: PointerEvent) => {
      targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (event.clientY / window.innerHeight) * 2 - 1;
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
      shapes.forEach((shape) => {
        shape.geometry.dispose();
        if (Array.isArray(shape.material)) {
          shape.material.forEach((m: any) => (m as any).dispose());
        } else {
          (shape.material as any).dispose();
        }
        scene.remove(shape);
      });
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 h-full w-full"
    />
  );
}
