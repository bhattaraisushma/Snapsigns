import React, { useEffect, useRef, useContext, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer } from "three";
import { context } from "../ContextAPI/context"; // Ensure this is the correct context import

const Character = () => {
  const mountRef = useRef(null);
  const { activeWord } = useContext(context); // Get the active word from context
  const [modelPath, setModelPath] = useState("");

  useEffect(() => {
    if (!activeWord) return; // If no word is active, do nothing

    console.log("Active Word:", activeWord);

    // Map of words to model paths
    const modelPaths = {
      PLEASE: "/models/please1.glb",
      HELLO: "/models/hello.glb",
      BYE: "/models/bye.glb",
      BLINK: "/models/blink4.glb",
    };

    // Get the correct model path for the active word
    const newPath = modelPaths[activeWord.toUpperCase()];
    setModelPath(newPath);

    if (!newPath) {
      console.error(`No model found for word: ${activeWord}`);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 700, 0.2, 1000);
    camera.position.set(0, 1.5, 4);
    scene.background = null; // Transparent background

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background

    if (mountRef.current) {
      mountRef.current.innerHTML = ""; // Clear previous models
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(2, 2, 2);
      scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

      

    // Handle screen resize
    const handleResize = () => {
      // camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      // renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation variables
    let mixer;
    const clock = new THREE.Clock();

    // Load the selected model
    const loader = new GLTFLoader();
    loader.load(
      newPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -3, 0); // Center the model

        // Adjust size based on model type
        const scaleFactor = activeWord.toUpperCase() === "BLINK" ? 2.5 : 2.5;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        scene.add(model);

        // Setup animation if available
        if (gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]); // Play first animation
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [activeWord]); // Re-run effect when `activeWord` changes

  return (
    <div
      ref={mountRef}
      style={{
        width: "800px",
        height: "700px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default Character;
