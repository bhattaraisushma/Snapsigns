// import React, {  useEffect, useRef, useContext } from 'react';
// import { useState } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { AnimationMixer } from 'three';
// import { context } from '../ContextAPI/context';
// const Character = () => {
//   const mountRef = useRef(null);
//   const { activeWord } = useContext(context); 
// const[newPath,setNewPath]=useState("");


//  useEffect(() => {
//     console.log("word",activeWord);
//     if (!activeWord) return; 

//     const modelPaths = {
//       PLEASE: '/models/finalplease.glb',
//       HELLO: '/models/finalhello.glb',
      
//     };

//     const modelPath = modelPaths[activeWord.toUpperCase()];
//     setNewPath(modelPath);
    
//     console.log("model path",newPath)
//     if (!modelPath) {
   
//       console.error(`No model found for word: ${activeWord}`);
//       return;
//     }

   
//     const scene = new THREE.Scene();
//     scene.background = null; 

   
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.2,
//       1000
//     );
//     camera.position.set(0, 1.5, 4); 

  
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(2000, 700); 
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setClearColor(0x000000, 0); 
//     mountRef.current.appendChild(renderer.domElement);

  
//     const light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(2, 2, 2);
//     scene.add(light);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

   
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener('resize', handleResize);

   
//     let mixer;

    
//     const loader = new GLTFLoader();
//     loader.load(
//       modelPath,
//       (gltf) => {
//         const model = gltf.scene;
//         model.position.set(0, 0, 0); 
//         scene.add(model);

//         const scaleFactor = 2;  
//     model.scale.set(scaleFactor, scaleFactor, scaleFactor); 

//         if (gltf.animations && gltf.animations.length > 0) {
//           mixer = new AnimationMixer(model);
//           gltf.animations.forEach((clip) => {
//             const action = mixer.clipAction(clip);
//             action.play();
//           });
//         }
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading model:', error);
//       }
//     );

  
//     const clock = new THREE.Clock();

    
//     const animate = () => {
//       requestAnimationFrame(animate);
     
//       if (mixer) {
//         const delta = clock.getDelta();
//         mixer.update(delta);
//       }

//       renderer.render(scene, camera);
//     };
//     animate();

    
//     return () => {
//       renderer.dispose();
//       mountRef.current.removeChild(renderer.domElement);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [activeWord]); 
//   return (
//     <div
//       ref={mountRef}
//       style={{
//         width: '700px',
//         height: '800px',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center', 
//       }}
//     />
//   );
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
    if (!activeWord) return;

    const modelPaths = {
      PLEASE: '/models/finalplease.glb',
      HELLO: '/models/untitledtem.glb',
    };

    const modelPath = modelPaths[activeWord.toUpperCase()];
    setNewPath(modelPath);

    if (!modelPath) {
      console.error(`No model found for word: ${activeWord}`);
      return;
    }

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera (Matching BlinkCharacter.js aspect ratio)
    const camera = new THREE.PerspectiveCamera(75, 800 / 700, 0.2, 1000);
    camera.position.set(0, 1.5, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700); // Same as BlinkCharacter.js
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let mixer;

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(2, 2, 2);
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.setLoop(THREE.LoopOnce); // Play only once
          action.clampWhenFinished = true; // Stop at last frame
          action.play();

          const clock = new THREE.Clock();

          // Play animation once
          const animate = () => {
            if (mixer) {
              const delta = clock.getDelta();
              mixer.update(delta);
              if (action.isRunning()) {
                requestAnimationFrame(animate);
              }
            }
            renderer.render(scene, camera);
          };
          animate();
        } else {
          renderer.render(scene, camera);
        }
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeWord]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '800px',
        height: '1000px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default Character;
