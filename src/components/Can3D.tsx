import React, { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface Can3DProps {
  position: [number, number, number];
  isHit: boolean;
  isFalling: boolean;
}

export const Can3D: React.FC<Can3DProps> = ({ position, isHit, isFalling }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !isHit && !isFalling) {
      // Pequena oscilação para dar vida às latas
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
    
    if (meshRef.current && isFalling) {
      // Animação de queda
      meshRef.current.position.y -= 0.1;
      meshRef.current.rotation.x += 0.1;
      meshRef.current.rotation.z += 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Corpo principal da lata */}
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshPhongMaterial 
          color={isHit ? "#53bb21" : "#53bb21"} 
          shininess={30}
          opacity={isHit ? 0.5 : 1}
          transparent
        />
      </mesh>
      
      {/* Tampa superior */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 16]} />
        <meshPhongMaterial color="#C0C0C0" shininess={100} />
      </mesh>
      
      {/* Base inferior */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 16]} />
        <meshPhongMaterial color="#C0C0C0" shininess={100} />
      </mesh>
    </group>
  );
};