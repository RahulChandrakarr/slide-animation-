"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiBootstrap,
  SiTailwindcss,
  SiRedux,
  SiJquery,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiFigma,
  SiGooglecloud,
  SiNpm,
  SiYarn,
} from "react-icons/si";
import { IconType } from "react-icons";

const TECH_ICONS: IconType[] = [
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiBootstrap,
  SiTailwindcss,
  SiRedux,
  SiJquery,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiFigma,
  SiGooglecloud,
  SiNpm,
  SiYarn,
];

// Tech names and colors mapping
const TECH_INFO = [
  { name: "HTML5", color: "#e34c26" },
  { name: "CSS3", color: "#264de4" },
  { name: "JS", color: "#f7df1e" },
  { name: "TS", color: "#3178c6" },
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#000000" },
  { name: "Bootstrap", color: "#7952b3" },
  { name: "Tailwind", color: "#06b6d4" },
  { name: "Redux", color: "#764abc" },
  { name: "jQuery", color: "#0769ad" },
  { name: "Node.js", color: "#339933" },
  { name: "Express", color: "#000000" },
  { name: "MongoDB", color: "#47a248" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "MySQL", color: "#00758f" },
  { name: "Firebase", color: "#f29111" },
  { name: "Supabase", color: "#3c873a" },
  { name: "Git", color: "#f05032" },
  { name: "GitHub", color: "#181717" },
  { name: "Docker", color: "#0db7ed" },
  { name: "Postman", color: "#ff6c37" },
  { name: "Figma", color: "#f24e1e" },
  { name: "GCP", color: "#0acf83" },
  { name: "NPM", color: "#cb3837" },
  { name: "Yarn", color: "#2c8ebb" },
];

// Create a canvas texture from an icon
function createIconTexture(Icon: IconType, size = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const iconIndex = TECH_ICONS.indexOf(Icon);
  const techInfo = TECH_INFO[iconIndex] || { name: "Tech", color: "#666666" };

  // Background with tech color
  ctx.fillStyle = techInfo.color;
  ctx.fillRect(0, 0, size, size);

  // Add white border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = size * 0.02;
  ctx.strokeRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);

  // Add tech name
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${size * 0.12}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Split long names
  const words = techInfo.name.split(" ");
  if (words.length > 1) {
    ctx.fillText(words[0], size / 2, size / 2 - size * 0.05);
    ctx.fillText(words[1], size / 2, size / 2 + size * 0.05);
  } else {
    ctx.fillText(techInfo.name, size / 2, size / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function SectionSeven() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    // White background so cubes pop
    scene.background = new THREE.Color(0xffffff);

    // Calculate room dimensions to fill full screen
    const fov =35;
    const cameraDistance = 20;
    const aspect = width / height;
    
    // Calculate visible dimensions at camera distance hey
    const visibleHeight = 2 * Math.tan((fov * Math.PI / 180) / 2) * cameraDistance;
    const visibleWidth = visibleHeight * aspect;
    
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    camera.position.set(0, 8, cameraDistance);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Physics world
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(10, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    scene.add(dirLight);

    // Create room (walls, floor, ceiling)
    // Full screen width and height, reduced depth
    const roomWidth = visibleWidth * 1.1; // Slightly larger than visible width
    const roomDepth = 8; // Reduced depth
    const roomHeight = visibleHeight * 1.1; // Slightly larger than visible height

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb, // light gray floor
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(floorBody);

    // Walls - white room
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.05,
    });

    const walls = [
      { pos: [0, roomHeight / 2, -roomDepth / 2], rot: [0, 0, 0], size: [roomWidth, roomHeight] }, // Back
      { pos: [0, roomHeight / 2, roomDepth / 2], rot: [0, Math.PI, 0], size: [roomWidth, roomHeight] }, // Front
      { pos: [-roomWidth / 2, roomHeight / 2, 0], rot: [0, Math.PI / 2, 0], size: [roomDepth, roomHeight] }, // Left
      { pos: [roomWidth / 2, roomHeight / 2, 0], rot: [0, -Math.PI / 2, 0], size: [roomDepth, roomHeight] }, // Right
    ];

    walls.forEach((wall) => {
      const wallGeometry = new THREE.PlaneGeometry(wall.size[0], wall.size[1]);
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
      wallMesh.position.set(wall.pos[0], wall.pos[1], wall.pos[2]);
      wallMesh.rotation.set(wall.rot[0], wall.rot[1], wall.rot[2]);
      wallMesh.receiveShadow = true;
      scene.add(wallMesh);

      const wallShape = new CANNON.Plane();
      const wallBody = new CANNON.Body({ mass: 0 });
      wallBody.addShape(wallShape);
      wallBody.quaternion.setFromEuler(wall.rot[0], wall.rot[1], wall.rot[2]);
      wallBody.position.set(wall.pos[0], wall.pos[1], wall.pos[2]);
      world.addBody(wallBody);
    });

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const ceiling = new THREE.Mesh(ceilingGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomHeight;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    const ceilingShape = new CANNON.Plane();
    const ceilingBody = new CANNON.Body({ mass: 0 });
    ceilingBody.addShape(ceilingShape);
    ceilingBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    ceilingBody.position.set(0, roomHeight, 0);
    world.addBody(ceilingBody);

    // Create cubes with tech logos - one cube per tech
    const cubes: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];
    const cubeSize = 1.5;
    const cubeCount = TECH_ICONS.length;

    for (let i = 0; i < cubeCount; i++) {
      const Icon = TECH_ICONS[i];
      
      // Create materials for each face with icon texture
      const materials: THREE.MeshStandardMaterial[] = [];
      for (let face = 0; face < 6; face++) {
        const texture = createIconTexture(Icon);
        materials.push(
          new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.5,
            metalness: 0.3,
          })
        );
      }

      // Rounded cubes for smoother, more tactile look
      const radius = cubeSize * 0.18;
      const segments = 6;
      const geometry = new RoundedBoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize,
        segments,
        radius
      );
      const mesh = new THREE.Mesh(geometry, materials);
      
      // Position cubes in a grid above the floor
      const gridSize = Math.ceil(Math.sqrt(cubeCount));
      const spacing = 3;
      const startX = -(gridSize - 1) * spacing * 0.5;
      const startZ = -(gridSize - 1) * spacing * 0.5;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      mesh.position.set(
        startX + col * spacing,
        5 + Math.random() * 3,
        startZ + row * spacing
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // Physics body
      const shape = new CANNON.Box(
        new CANNON.Vec3(cubeSize / 2, cubeSize / 2, cubeSize / 2)
      );
      const body = new CANNON.Body({ mass: 1 });
      body.addShape(shape);
      body.position.set(
        mesh.position.x,
        mesh.position.y,
        mesh.position.z
      );
      body.material = new CANNON.Material("cube");
      body.material.friction = 0.4;
      body.material.restitution = 0.3;
      world.addBody(body);

      cubes.push({ mesh, body });
    }

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedCube: { mesh: THREE.Mesh; body: CANNON.Body } | null = null;
    let isDragging = false;

    const handleMouseDown = (event: MouseEvent) => {
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        cubes.map((c) => c.mesh)
      );

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        selectedCube =
          cubes.find((c) => c.mesh === clickedMesh) || null;
        if (selectedCube) {
          isDragging = true;
          selectedCube.body.type = CANNON.Body.KINEMATIC;
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && selectedCube) {
        mouse.x = (event.clientX / width) * 2 - 1;
        mouse.y = -(event.clientY / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const distance = 10;
        const direction = new THREE.Vector3();
        raycaster.ray.direction.normalize();
        direction.copy(raycaster.ray.direction).multiplyScalar(distance);
        direction.add(raycaster.ray.origin);

        selectedCube.body.position.set(
          direction.x,
          Math.max(2, direction.y),
          direction.z
        );
      }
    };

    const handleMouseUp = () => {
      if (selectedCube && isDragging) {
        selectedCube.body.type = CANNON.Body.DYNAMIC;
        
        // Add throw velocity based on mouse movement
        const velocity = new CANNON.Vec3(
          (Math.random() - 0.5) * 5,
          8,
          (Math.random() - 0.5) * 5
        );
        selectedCube.body.velocity = velocity;
        selectedCube.body.angularVelocity.set(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        );
        
        selectedCube = null;
        isDragging = false;
      }
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const delta = clock.getDelta();
      world.step(1 / 60, delta, 3);

      // Update cube positions from physics
      cubes.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position as any);
        mesh.quaternion.copy(body.quaternion as any);
      });

      // Keep camera fixed (no rotation)
      camera.lookAt(0, 5, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      // Update camera aspect ratio for new viewport
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      
      renderer.dispose();
      cubes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
        scene.remove(mesh);
      });
      floor.geometry.dispose();
      floor.material.dispose();
      scene.remove(floor);
      walls.forEach((_, i) => {
        const wallMesh = scene.children.find(
          (child) => child instanceof THREE.Mesh && child !== floor && child !== ceiling
        );
        if (wallMesh) {
          (wallMesh as THREE.Mesh).geometry.dispose();
          ((wallMesh as THREE.Mesh).material as THREE.Material).dispose();
          scene.remove(wallMesh);
        }
      });
      ceiling.geometry.dispose();
      ceiling.material.dispose();
      scene.remove(ceiling);
      
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-zinc-100">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
          Section Seven
        </p>
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          3D Interactive
          <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tech Room
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-zinc-300 sm:text-base">
          Click and drag cubes to throw them around. Each cube features a
          different technology logo on all sides.
        </p>
      </div>
    </section>
  );
}
