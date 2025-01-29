import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const BlinkCharacter = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const modelPath = "/models/finalblink.glb";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 700, 0.2, 1000);
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Ensure mountRef.current is valid before appending
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        const scaleFactor = 2.5;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        scene.add(model);
      },
      undefined,
      (error) => console.error("Error loading Blink model:", error)
    );

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // Safe cleanup: check if mountRef.current is still available
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose(); // Dispose renderer
    };
  }, []);

  return <div ref={mountRef} style={{ width: "800px", height: "700px" }} />;
};

export default BlinkCharacter;
