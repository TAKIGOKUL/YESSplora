import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
// import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Simple robot model created with basic geometries
function RobotModel() {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Animation state
  const [waveAnimation, setWaveAnimation] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState(true);

  // Create wave animation
  useEffect(() => {
    if (waveAnimation) {
      const timer = setTimeout(() => {
        setWaveAnimation(false);
        setIdleAnimation(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [waveAnimation]);

  // Handle click to wave
  const handleClick = () => {
    setClicked(!clicked);
    setWaveAnimation(true);
    setIdleAnimation(false);
  };

  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Idle floating animation
      if (idleAnimation) {
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      }

      // Wave animation
      if (waveAnimation) {
        const waveTime = state.clock.elapsedTime * 3;
        if (groupRef.current.children[1]) { // Right arm
          groupRef.current.children[1].rotation.z = Math.sin(waveTime) * 0.5;
        }
        if (groupRef.current.children[2]) { // Left arm
          groupRef.current.children[2].rotation.z = Math.sin(waveTime + Math.PI) * 0.3;
        }
      }

      // Hover effect
      if (hovered) {
        groupRef.current.scale.setScalar(1.05);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      dispose={null}
    >
      {/* Robot Head */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#E50914"
          metalness={0.3}
          roughness={0.4}
          emissive="#E50914"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 1.6, 0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.2, 1.6, 0.4]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>

      {/* Robot Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.6]} />
        <meshStandardMaterial
          color="#1C1C1C"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial
          color="#E50914"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.8, 0.5, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial
          color="#E50914"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.3, -0.8, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial
          color="#1C1C1C"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.3, -0.8, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial
          color="#1C1C1C"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#E50914" emissive="#E50914" emissiveIntensity={0.3} />
      </mesh>

      {/* Antenna Top */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#E50914" emissive="#E50914" emissiveIntensity={0.5} />
      </mesh>

      {/* Chest Panel */}
      <mesh position={[0, 0.5, 0.31]}>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Status Lights */}
      <mesh position={[-0.2, 0.6, 0.33]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.6, 0.33]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.2, 0.6, 0.33]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default RobotModel;

