import React, { useEffect, useRef, useContext } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';
import { context } from '../ContextAPI/context'; // Ensure this is the correct context import

const Character = () => {
  const mountRef = useRef(null);
  const { isPlease, setIsPlease } = useContext(context); // Access context

  useEffect(() => {
    if (!isPlease) return; // Skip if "Please" is not active

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

    // Adjust camera position to center the model properly
    camera.position.set(0, 1.5, 4); // You can adjust the Z-axis for a better view of the model

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable transparency
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent (alpha: 0)
    mountRef.current.appendChild(renderer.domElement);

    // Light
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

    // Load 3D Model when isPlease is true
    const loader = new GLTFLoader();
    loader.load(
      '/models/please.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0); // Center the model in the scene
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

    // Clock for Animation
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

    // Cleanup on unmount or when isPlease changes
    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlease]); // Only run effect when `isPlease` changes

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Center the canvas in the viewport
      }}
    />
  );
};

export default Character;
