
import React, { useState } from 'react';
import WordDisplay from '../list';
import WordToASLConverter from '../gloss';
import Character from '../Animated/character';

const Homepage = () => {
  const [selectedWord, setSelectedWord] = useState("");

  return (
    <div className='flex flex-row h-screen bg-purple-200 items-center'>
      <Character/>
      <div className='h-screen w-[40%]'>
        
        <WordDisplay setSelectedWord={setSelectedWord} />
      </div>
      <WordToASLConverter selectedWord={selectedWord} setSelectedWord={setSelectedWord} />
    </div>
  );
};

export default Homepage;


// import React, { useState, useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import WordDisplay from '../list';
// import WordToASLConverter from '../gloss';

// const Homepage = () => {
//   const [selectedWord, setSelectedWord] = useState("");
//   const mountRef = useRef(null);

//   useEffect(() => {
//     // Scene setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0, 5, 10);

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(renderer.domElement);

//     // Load FBX Model
//     const loader = new FBXLoader();
//     loader.load(
//       '/blender1.fbx', // Ensure the file is in the public directory
//       (fbx) => {
//         scene.add(fbx);
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading FBX model:', error);
//       }
//     );

//     // Light
//     const light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(10, 10, 10).normalize();
//     scene.add(light);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Cleanup on component unmount
//     return () => {
//       renderer.dispose();
//     };
//   }, []);

//   return (
//     <div className='flex flex-row h-screen bg-purple-200 items-center'>
//       <div className='h-screen w-[40%]'>
//         <WordDisplay setSelectedWord={setSelectedWord} />
//       </div>
//       <WordToASLConverter selectedWord={selectedWord} setSelectedWord={setSelectedWord} />
//       {/* Three.js Model Display */}
//       <div className="w-[60%] h-full" ref={mountRef}></div>
//     </div>
//   );
// };

// export default Homepage;
