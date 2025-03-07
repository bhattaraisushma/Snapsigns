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
    console.log("activeWord", activeWord);
    if (!activeWord) return;

    
    const formattedWord = activeWord.replace("_SIGN", "").replace("_", " ");

    const modelPaths = {
      PLEASEE: "/models/finalplease.glb",
      GREET: "/models/hello.glb",
      LOVEE: "/models/love2.glb",
      HAPPYY: "/models/happy.glb",
      HELPP: "/models/help.glb",
      NAM: "/models/name2.glb",
      APOLOGY: "/models/sorry.glb", 
      STOPP: "/models/stop.glb",
      GOO: "/models/go.glb",
      "THANKING YOU": "/models/thankyou2.glb",
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
    camera.position.set(0, 0.8, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

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


        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = new THREE.Vector3();
        box.getSize(size);
        const desiredHeight = 2.5;
        const scaleFactor = (desiredHeight / size.y) * 1.6; 
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);


        model.position.y -= 0.05; 

        scene.add(model);

      
        if (gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.clampWhenFinished = true;
            action.play();
          });
        } else {
          console.warn("No animations found in model:", modelPath);
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
