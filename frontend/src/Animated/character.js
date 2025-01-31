import React, { useEffect, useRef, useContext, useState } from 'react';
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
      HELLO: '/models/finalhello.glb',
    };

    const modelPath = modelPaths[activeWord.toUpperCase()];
    setNewPath(modelPath);
      if (!modelPath) {
      console.error(`No model found for word: ${activeWord}`);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, 800 / 700, 0.2, 1000);
    camera.position.set(0, 2.5, 6); 
    camera.lookAt(new THREE.Vector3(0, 1.5, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 700);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    let mixer;
    let clock = new THREE.Clock();

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        
      
        const scaleFactor =3;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(model);

          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            if (clip.name === "blink") {
              action.setLoop(THREE.LoopOnce);
              action.clampWhenFinished = true;
            } else {
              action.setLoop(THREE.LoopOnce);
              action.clampWhenFinished = true;
            }
            action.play();
          });
        }

        const animate = () => {
          if (mixer) {
            const delta = clock.getDelta();
            mixer.update(delta);

            if (mixer.clipAction(gltf.animations[0]).isRunning()) {
              requestAnimationFrame(animate);
            }
          }

          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
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