import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';

const Character = () => {
  function Model() {
    const group = useRef();
    const { scene, animations } = useGLTF('/models/girl_animation.glb');
    const { actions } = useAnimations(animations, group);

    React.useEffect(() => {
      if (actions && Object.keys(actions).length > 0) {
        actions[Object.keys(actions)[0]].play(); // Play the first animation
      }
    }, [actions]);

    // Position the model at the center and scale it up
    scene.scale.set(3, 3, 3); // Scale up the model (adjust values as needed)
    scene.position.set(0, -1, 0); // Position the model (adjust values as needed)

    return <primitive ref={group} object={scene} />;
  }

  return (
    <div className='h-[80vh] '>
      <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />

        {/* Camera Controls */}
        <OrbitControls />

        {/* 3D Model */}
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Character;
