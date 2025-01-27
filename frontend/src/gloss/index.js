// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ArrowRightIcon } from "@heroicons/react/24/solid";
// import Character from '../Animated/character';
// const WordToASLConverter = ({ selectedWord, setSelectedWord }) => {
//   const [word, setWord] = useState(selectedWord || "");
//   const [aslGloss, setAslGloss] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (selectedWord) {
//       setWord(selectedWord);
//     }
//   }, [selectedWord]);

//   const handleConvert = async () => {
//     if (!word.trim()) {
//       setAslGloss("Please enter a word!");
//       return;
//     }

//     console.log("Submitting text to backend:", word);
//     setLoading(true);
//     setAslGloss("");

//     try {
//       const token = "your-auth-token";
//       const response = await axios.post(
//         "http://localhost:9005/text/process-text",
//         { text: word },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAslGloss(response.data.result[0].translation_text.split(": ").pop());
//     } catch (error) {
//       setAslGloss(error.response?.data?.message || "Error converting text.");
//       console.error("Error response:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-end mb-[6rem] w-full min-h-screen bg-purple-200">
//        <Character/>
//       <div className="flex space-x-4 items-center">
//         <input
//           type="text"
//           value={word}
//           onChange={(e) => {
//             setWord(e.target.value);
//             setSelectedWord("");
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

//       {aslGloss && (
//         <div className="mt-6 text-lg font-semibold text-gray-700">{aslGloss}</div>
//       )}
//     </div>
//   );
// };

// export default WordToASLConverter;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ArrowRightIcon } from "@heroicons/react/24/solid";

// const WordToASLConverter = ({ selectedWord, setSelectedWord }) => {
//   const [word, setWord] = useState(selectedWord || "");
//   const [aslGloss, setAslGloss] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (selectedWord) {
//       setWord(selectedWord);
//     }
//   }, [selectedWord]);

//   const handleConvert = async () => {
//     if (!word.trim()) {
//       setAslGloss("Please enter a word!");
//       return;
//     }

//     console.log("Submitting text to backend:", word);
//     setLoading(true);
//     setAslGloss("");

//     try {
//       const token = "your-auth-token"; // Replace with your actual token
//       const response = await axios.post(
//         "http://localhost:9005/text/process-text",
//         { text: word },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAslGloss(response.data.result[0].translation_text.split(": ").pop());
//     } catch (error) {
//       setAslGloss(error.response?.data?.message || "Error converting text.");
//       console.error("Error response:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-end mb-[6rem] w-full min-h-screen bg-purple-200">
//       <div className="flex space-x-4 items-center">
//         <input
//           type="text"
//           value={word}
//           onChange={(e) => {
//             setWord(e.target.value);
//             setSelectedWord("");
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

//       {aslGloss && (
//         <div className="mt-6 text-lg font-semibold text-gray-700">{aslGloss}</div>
//       )}
//     </div>
//   );
// };

// export default WordToASLConverter;


import React, { useState, useEffect, useRef,useContext } from "react";
import axios from "axios";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Canvas } from "@react-three/fiber";
import { AnimationMixer } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { context } from "../ContextAPI/context";
import Character from '../Animated/character';
const WordToASLConverter = ({ selectedWord, setSelectedWord }) => {
  const [word, setWord] = useState(selectedWord || "");
  const [aslGloss, setAslGloss] = useState("");
  const [loading, setLoading] = useState(false);
  const modelRef = useRef(null);
  const mixer = useRef(null);
  const [animationUrl, setAnimationUrl] = useState("");

  // Update word when selectedWord changes
  useEffect(() => {
    if (selectedWord) {
      setWord(selectedWord);
    }
  }, [selectedWord]);

  useEffect(() => {
    if (animationUrl) {
      loadFBXModel(animationUrl);
    }
  }, [animationUrl]);

  // Load FBX model using FBXLoader
  const loadFBXModel = (url) => {
    const loader = new FBXLoader();
    loader.load(url, (fbx) => {
      if (modelRef.current) {
        modelRef.current.clear();
      }

      modelRef.current = fbx;
      if (mixer.current) {
        mixer.current = new AnimationMixer(fbx);
        const action = mixer.current.clipAction(fbx.animations[0]); // Play the first animation
        action.play();
      }
    });
  };

  const{isPlease,setIsPlease,activeWord, setActiveWord}=useContext(context);
  // Handle the ASL conversion
  const handleConvert = async () => {
    if (!word.trim()) {
      setAslGloss("Please enter a word!");
      return;
    }

    setLoading(true);
    setAslGloss("");

    try {
      const token = "your-auth-token"; // Replace with actual token
      const response = await axios.post(
        "http://localhost:9005/text/process-text",
        { text: word },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const gloss = response.data.result[0].translation_text.split(": ").pop();
      setAslGloss(gloss);

      // Map the gloss to an animation
      const animationFile = mapGlossToAnimation(gloss);
      setAnimationUrl(animationFile);
    } catch (error) {
      setAslGloss(error.response?.data?.message || "Error converting text.");
      console.error("Error response:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Map gloss to the corresponding animation file
  const mapGlossToAnimation = (gloss) => {
    console.log("Received gloss:", gloss); // Debugging step
  
    // Normalize the gloss: Convert to lowercase and capitalize the first letter
    const normalizedGloss = gloss.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  
    const animationMap = {
      "Hello": "../Animations/Hello.fbx",
      "Please": '/models/please.glb',
      // Add more mappings as needed
    };
  
    if (animationMap[normalizedGloss]) {
      setActiveWord(normalizedGloss);
      // if(normalizedGloss==="Please"){
      //   setIsPlease(true);

      //   console.log("Please is true");
      // }
      // if(normalizedGloss==="Hello"){
      //  setIsHello(true)
      //  console.log("Hello is true");
      // }
      console.log(`Matched animation from gloss index.js: ${animationMap[normalizedGloss]}`);
       // Log the mapped animation file
      return animationMap[normalizedGloss];
    } else {
      console.log("No matching animation found for gloss:", gloss); // Debug if no match is found
      return ""; // Return empty string if no mapping exists
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-end mb-[6rem] w-full min-h-screen bg-purple-200">
     <Character/>
     
      <div className="flex space-x-4 items-center">
        <input
          type="text"
          value={word}
          onChange={(e) => {
            setWord(e.target.value);
            setSelectedWord("");
          }}
          placeholder="Enter text to generate sign language"
          className="border-solid text-center h-[4rem] w-[20rem] rounded-[0.4rem]"
        />
        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white px-3 py-3 h-[2.5rem] rounded-[0.4rem] flex items-center hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Converting..." : <ArrowRightIcon className="h-6 w-6" />}
        </button>
      </div>

      {aslGloss && (
        <div className="mt-6 text-lg font-semibold text-gray-700">{aslGloss}</div>
      )}

      <div style={{ width: "100%", height: "400px" }}>
      <Canvas>
  <ambientLight intensity={0.5} />
  <spotLight position={[10, 10, 10]} />
  {modelRef.current ? (
    <primitive object={modelRef.current} />
  ) : (
    ""
  )}
</Canvas>
      </div>
    </div>
  );
};

export default WordToASLConverter;
