'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Robot() {
  const group = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (group.current) {
      // Gentle floating animation
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (headRef.current) {
      // Make the head look at the pointer slightly
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 4,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 4,
        0.1
      );
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* Head */}
      <mesh
        ref={headRef}
        position={[0, 1.2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.6, 0.5, 0.5]} />
        <meshStandardMaterial
          color={hovered ? '#7B61FF' : '#5B8CFF'}
          roughness={0.2}
          metalness={0.8}
        />
        {/* Eyes */}
        <mesh position={[0.15, 0.1, 0.26]}>
          <boxGeometry args={[0.15, 0.05, 0.05]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
        <mesh position={[-0.15, 0.1, 0.26]}>
          <boxGeometry args={[0.15, 0.05, 0.05]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.8, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Floating Base */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.1, 16, 32]} />
        <MeshWobbleMaterial factor={1} speed={2} color="#5B8CFF" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
      </mesh>
      <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
      </mesh>
    </group>
  );
}

export default function CyberCoach3D() {
  return (
    <div className="w-full h-[400px] relative pointer-events-auto">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Robot />
        </Float>
        <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={5} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
