import React, { useEffect, useRef, useContext, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer } from "three";
import { context } from "../ContextAPI/context";

const Character = () => {
  const mountRef = useRef(null);
  const { activeWord } = useContext(context);
  const [newPath, setNewPath] = useState("");

  useEffect(() => {
    if (!activeWord) return;

    const formattedWord = activeWord.replace("_SIGN", ""); 

  
    const modelPaths = {
      PLEASE: "/models/finalplease.glb",
      HELLO: "/models/hello.glb",
      LOVE: "/models/love.glb",
      HAPPY: "/models/happy.glb",
      HELP: "/models/help.glb",
      NAME: "/models/name.glb",
      SORRY: "/models/sorry.glb",
      STOP: "/models/stop.glb",
      GO: "/models/go.glb",
      THANKYOU: "/models/thankyou.glb",
    };

    const modelPath = modelPaths[formattedWord.toUpperCase()];

    if (!modelPath) {
      console.error(`No model found for word: ${activeWord}`);
      return;
    }

    setNewPath(modelPath);

 
    if (mountRef.current) {
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    }


    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, 800 / 700, 0.1, 1000);
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    let mixer;
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 2, 0);
        model.scale.set(2.5, 2.5, 2.5);
        scene.add(model);

        if (gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [activeWord]);

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


