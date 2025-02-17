// import React, { useEffect, useRef, useContext } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { AnimationMixer } from 'three';
// import { context } from '../ContextAPI/context';

// const Character = () => {
//   const mountRef = useRef(null);
//   const { activeWord } = useContext(context);
//   const mixerRef = useRef(null);
//   const modelRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     if (!activeWord) return;

//     // Model paths mapping
//     const modelPaths = {
//       PLEASE: '/models/finalplease.glb',
//       HELLO: '/models/hello.glb',
//       LOVE: '/models/love.glb',
//       HAPPY: '/models/happy.glb',
//       HELP: '/models/help.glb',
//       NAME: '/models/name.glb',
//       SORRY: '/models/sorry.glb',
//       STOP: '/models/stop.glb',
//       THANKYOU: '/models/thankyou.glb',
//     };

//     const modelPath = modelPaths[activeWord.toUpperCase()];
//     if (!modelPath) {
//       console.error(`No model found for word: ${activeWord}`);
//       return;
//     }

//     const scene = sceneRef.current;
//     scene.background = null;

//     // 🔹 Cleanup previous model before loading new one
//     if (modelRef.current) {
//       scene.remove(modelRef.current);
//       modelRef.current.traverse((child) => {
//         if (child.isMesh) {
//           child.geometry.dispose();
//           if (child.material.isMaterial) {
//             child.material.dispose();
//           }
//         }
//       });
//       modelRef.current = null;
//     }

//     // 🔹 Stop previous animations
//     if (mixerRef.current) {
//       mixerRef.current.stopAllAction();
//       mixerRef.current = null;
//     }

//     // Initialize Camera
//     if (!cameraRef.current) {
//       cameraRef.current = new THREE.PerspectiveCamera(75, 800 / 700, 0.1, 1000);
//       cameraRef.current.position.set(0, 1.5, 4);
//     }
//     const camera = cameraRef.current;

//     // Initialize Renderer
//     if (!rendererRef.current) {
//       rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//       rendererRef.current.setSize(800, 700);
//       rendererRef.current.setPixelRatio(window.devicePixelRatio);
//       rendererRef.current.setClearColor(0x000000, 0);
      
//       if (mountRef.current) {
//         mountRef.current.innerHTML = ''; // Clear previous render
//         mountRef.current.appendChild(rendererRef.current.domElement);
//       }
//     }
//     const renderer = rendererRef.current;

//     // Lighting
//     const light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(2, 2, 2);
//     scene.add(light);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
//     scene.add(ambientLight);

//     // Load Model
//     const loader = new GLTFLoader();
//     loader.load(
//       modelPath,
//       (gltf) => {
//         const model = gltf.scene;
//         model.position.set(0, 2, 0);
//         model.scale.set(2.5, 2.5, 2.5);
//         scene.add(model);
//         modelRef.current = model;

//         // 🔹 Initialize and play animations
//         if (gltf.animations.length > 0) {
//           mixerRef.current = new AnimationMixer(model);
//           gltf.animations.forEach((clip, index) => {
//             console.log(`Playing animation ${index} for ${activeWord}`);
//             const action = mixerRef.current.clipAction(clip);
//             action.play();
//           });
//         } else {
//           console.warn(`No animations found for ${activeWord}`);
//         }
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading model:', error);
//       }
//     );

//     const clock = new THREE.Clock();

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       if (mixerRef.current) {
//         mixerRef.current.update(clock.getDelta());
//       }
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Handle Window Resize
//     const handleResize = () => {
//       camera.aspect = 800 / 700;
//       camera.updateProjectionMatrix();
//       renderer.setSize(800, 700);
//     };
//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//       }
//       if (mountRef.current) {
//         mountRef.current.innerHTML = ''; // Cleanup renderer
//       }
//       if (modelRef.current) {
//         scene.remove(modelRef.current);
//         modelRef.current.traverse((child) => {
//           if (child.isMesh) {
//             child.geometry.dispose();
//             if (child.material.isMaterial) {
//               child.material.dispose();
//             }
//           }
//         });
//         modelRef.current = null;
//       }
//       if (mixerRef.current) {
//         mixerRef.current.stopAllAction();
//         mixerRef.current = null;
//       }
//     };
//   }, [activeWord]);

//   return <div ref={mountRef} style={{ width: '800px', height: '700px' }} />;
// };

// export default Character;


import React, { useEffect, useRef, useContext } from 'react';
import { useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';
import { context } from '../ContextAPI/context'; 

const Character = () => {
  const mountRef = useRef(null);
  const { activeWord } = useContext(context); 
  const [newPath, setNewPath] = useState("");
  
  useEffect(() => {
    console.log("word", activeWord);
    if (!activeWord) return;

    const modelPaths = {
      PLEASE: '/models/finalplease.glb',
      HELLO: '/models/hello.glb',
      LOVE: '/models/love.glb',
      HAPPY: '/models/happy.glb',
      HELP: '/models/help.glb',
      NAME: '/models/name.glb',
      SORRY: '/models/sorry.glb',
      STOP: '/models/stop.glb'
      GO: '/models/go.glb',
      THANKYOU: '/models/thankyou.glb'

    };

    const modelPath = modelPaths[activeWord.toUpperCase()];
    setNewPath(modelPath);
    
    console.log("model path", newPath)
    if (!modelPath) {
      console.error(`No model found for word: ${activeWord}`);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = null; 

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700); 
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); 
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let mixer;

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 2, 0 );
        model.scale.set(2.5, 2.5, 2.5);  
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeWord]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '800px',
        height: '700px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
      }}
    />
  );
};

export default Character;
