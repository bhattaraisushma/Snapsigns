import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const BlinkCharacter = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const modelPath = "/models/blink.glb"; // Ensure the correct model path

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 700, 0.2, 1000);
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    // Animation variables
    let mixer;
    const clock = new THREE.Clock();

    // Load 3D Model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(2.5, 2.5, 2.5);
        scene.add(model);

        // If the model has animations, set up the mixer
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]); // Play the first animation
          action.setLoop(THREE.LoopRepeat);
          action.play();
        }
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "800px", height: "700px" }} />;
};

export default BlinkCharacter;
