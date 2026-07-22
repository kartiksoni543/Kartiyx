"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function InteractiveMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 + state.pointer.y * 0.4;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25 + state.pointer.x * 0.4;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[1, 0.35, 128, 32]} />
        <MeshDistortMaterial
          color="#00E5FF"
          emissive="#7C3AED"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.8}
          distort={0.3}
          speed={3}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

function FloatingParticleField() {
  return (
    <Stars
      radius={50}
      depth={50}
      count={2500}
      factor={4}
      saturation={0.5}
      fade
      speed={1.5}
    />
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-auto">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00E5FF" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#7C3AED" />
        <spotLight position={[0, 5, 5]} intensity={1} color="#ffffff" angle={0.5} />
        
        <InteractiveMesh />
        <FloatingParticleField />
      </Canvas>
    </div>
  );
}
