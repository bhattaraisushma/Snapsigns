import React, {  useEffect, useRef, useContext } from 'react';
import { useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';
import { context } from '../ContextAPI/context'; // Ensure this is the correct context import

const Character = () => {
  const mountRef = useRef(null);
  const { activeWord } = useContext(context); // Use a single variable to track the active word
const[newPath,setNewPath]=useState("");
  useEffect(() => {
    console.log("word",activeWord);
    if (!activeWord) return; // Do nothing if no word is active

    // Map of words to model paths
    const modelPaths = {
      PLEASE: '/models/finalplease.glb',
      HELLO: '/models/finalhello.glb',
      bye: '/models/bye.glb',
      PLEASE: '/models/please.glb',
      HELLO: '/models/hello.glb',
      STOP: '/models/stop.glb',
    };

    // Get the model path for the active word
    const modelPath = modelPaths[activeWord.toUpperCase()];
    setNewPath(modelPath);
    
    console.log("model path",newPath)
    if (!modelPath) {
   
      console.error(`No model found for word: ${activeWord}`);
      return;
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Set the background to transparent

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4); // Adjust camera position for a good view

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(2000, 700); // Fixed size for the canvas
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Mixer
    let mixer;

    // Load the selected model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0); // Center the model
        scene.add(model);

        // Setup animation if available
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

    // Animation Clock
    const clock = new THREE.Clock();

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update animations
      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeWord]); // Re-run effect when the active word changes

  return (
    <div
      ref={mountRef}
      style={{
        width: '800px',
        height: '700px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Center the canvas in the viewport
      }}
    />
  );
};

export default Character;
