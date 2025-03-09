// import React, { useState, useEffect, useRef, useContext } from "react";
// import axios from "axios";
// import * as THREE from "three";
// import { ArrowRightIcon } from "@heroicons/react/24/solid";
// import { Canvas } from "@react-three/fiber";
// import { AnimationMixer } from "three";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { context } from "../ContextAPI/context";
// import Character from "../Animated/character";
// import BlinkCharacter from "../blink.js";

// const WordToASLConverter = () => {
//   const [aslGloss, setAslGloss] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false); 
//   const modelRef = useRef(null);
//   const mixer = useRef(null);
//   const [animationUrl, setAnimationUrl] = useState("");
//   const { activeWord, setActiveWord } = useContext(context);
//   const [word, setWord] = useState(activeWord || "");
 

//   useEffect(() => {
//     if (activeWord || word === "") { 
//       setWord(activeWord);
//     }
//   }, [activeWord, word]);
  

//   useEffect(() => {
//     if (animationUrl) {
//       loadFBXModel(animationUrl);
//     }
//   }, [animationUrl]);

//   const synonym_map = {
//     hello: "GREET_SIGN",
//     hi: "GREET_SIGN",
//     hey: "GREET_SIGN",
//     greeting: "GREET_SIGN",

//     name: "NAM_SIGN",
//     identity: "NAM_SIGN",

//     sorry: "APOLOGY_SIGN",
//     apologize: "APOLOGY_SIGN",
//     regret: "APOLOGY_SIGN",

//     thank: "THANKING_YOU_SIGN",
//     appreciate: "THANKING_YOU_SIGN",
//     grateful: "THANKING_YOU_SIGN",
//     "thank you": "THANKING_YOU_SIGN",
   

//     happy: "HAPPYY_SIGN",
//     joyful: "HAPPYY_SIGN",
//     glad: "HAPPYY_SIGN",
//     pleased: "HAPPYY_SIGN",

//     help: "HELPP_SIGN",
//     assist: "HELPP_SIGN",
//     support: "HELPP_SIGN",
//     aid: "HELPP_SIGN",

//     stop: "STOPP_SIGN",
//     halt: "STOPP_SIGN",
//     cease: "STOPP_SIGN",
//     pause: "STOPP_SIGN",

//     love: "LOVEE_SIGN",
//     affection: "LOVEE_SIGN",
//     care: "LOVEE_SIGN",
//     adore: "LOVEE_SIGN",

//     please: "PLEASEE_SIGN",
//     kindly: "PLEASEE_SIGN",
//     request: "PLEASEE_SIGN",

//     go: "GOO_SIGN",
//     move: "GOO_SIGN",
//     proceed: "GOO_SIGN",
//     advance: "GOO_SIGN",
//   };

//   const animationMap = {
//     GREET_SIGN: "/models/hello.glb",
//     PLEASEE_SIGN: "/models/please.glb",
//     LOVEE_SIGN: "/models/love.glb",
//     HAPPYY_SIGN: "/models/happy.glb",
//     HELPP_SIGN: "/models/help.glb",
//     NAM_SIGN: "/models/name2.glb",
//     APOLOGY_SIGN: "/models/sorry.glb",
//     STOPP_SIGN: "/models/stop.glb",
//     GOO_SIGN: "/models/go.glb",
//     THANKING_YOU_SIGN: "/models/thankyou2.glb",
//   };

//   const loadFBXModel = (url) => {
//     if (!url) return;
  
//     const loader = new FBXLoader();
//     loader.load(
//       url,
//       (fbx) => {
//         if (modelRef.current) {
//           modelRef.current.clear();
//         }
  
//         modelRef.current = fbx;
//         if (mixer.current) {
//           mixer.current = new AnimationMixer(fbx);
//           const action = mixer.current.clipAction(fbx.animations[0]);
//           action.setLoop(THREE.LoopOnce);
//           action.clampWhenFinished = true;
//           action.play();
//         }
//       },
//       undefined, 
//       (error) => {
//         console.error("Error loading model:", error);
//       }
//     );
//   };
  

//   const handleConvert = async () => {
//     if (!word.trim()) {
//       setAslGloss("");
//       setShowModal(true);
//       return;
//     }
  
//     setLoading(true);
//     setAslGloss("");
//     setShowModal(false);
  

//     try {
//           const token = "your-auth-token";
//       const response = await axios.post(
//         "http://localhost:9005/text/process-text",
//         { text: word },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
    
    
      
//       const gloss = response.data.result[0].translation_text.split(": ").pop();
//       console.log("Received Gloss:", gloss); 
      
//       setAslGloss(gloss);
//       const animationFile = mapGlossToAnimation(gloss);
//       console.log("Selected Animation File:", animationFile); 
      
//       if (!animationFile) {
//         setShowModal(true); 
//       }
//       setAnimationUrl(animationFile);
//     } catch (error) {
//       setShowModal(true);
//       console.error("Error response:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
    
//   };
  

//   const mapGlossToAnimation = (gloss) => {
//     const normalizedGloss = gloss.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
//     console.log("Normalized Gloss:", normalizedGloss); 
    
//     const animationKey = synonym_map[normalizedGloss.toLowerCase()] 
//     console.log("Animation Key:", animationKey);
    
//     const animationFile = animationMap[animationKey];
//     console.log("Animation File:", animationFile); 
    
//     if (animationFile) {
//       setActiveWord(animationKey);
//       console.log("Animation key:", activeWord);
//      return animationFile;
//     } else {
//       console.log("No model found for word:", normalizedGloss); 
//       return "";
//     }
//   };
  


//   return (
//     <div className="flex flex-col items-center justify-start w-full min-h-screen bg-purple-20">
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg">
//             <p className="text-xl font-medium mb-4">No Animation Found!</p>
//             <p className="text-gray-700">No matching animation available for this word.</p>
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
//               onClick={() => setShowModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="mt-6">
//         {!activeWord ? (
//           <BlinkCharacter />
//         ) : (
//           <>
//             <Character />
//             <div style={{ width: "1px", height: "1px" }}>
//               <Canvas>
//                 <ambientLight intensity={1} />
//                 <spotLight position={[50, 50, 50]} />
//                 {modelRef.current ? <primitive object={modelRef.current} /> : null}
//               </Canvas>
//             </div>
//           </>
//         )}
//       </div>
      

//       <div className="flex space-x-4 items-center mt-8">
//         <input
//           type="text"
//           value={word}
//           onChange={(e) => {
//              setWord(e.target.value);
//             console.log("word", word);
//           }}
//           placeholder="Enter text to generate sign language"
//           className="border-solid text-center h-[4rem] w-[20rem] rounded-[0.4rem]"
//         />
//         <button
//           onClick={handleConvert}
//           className="bg-blue-500 text-white px-3 py-3 h-[2.5rem] rounded-[0.4rem] flex items-center hover:bg-blue-600"
//           disabled={loading}
//         >
//           {loading ? "Converting..." : <ArrowRightIcon className="h-6 w-6" />}
//         </button>
//       </div>

//       {aslGloss && <div className="mt-0 text-lg font-semibold text-gray-700">{aslGloss}</div>}
//     </div>
//   );
// };

// export default WordToASLConverter;




//   // useEffect(() => {
//   //   console.log("Active Word:", activeWord);
//   //   if (activeWord) {
//   //         setWord(activeWord);
//   //       }
//   // }, [activeWord]);
