import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Canvas } from "@react-three/fiber";
import { AnimationMixer } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { context } from "../ContextAPI/context";
import Character from '../Animated/character';
import BlinkCharacter from "../blink.js";

const WordToASLConverter = ({ selectedWord, setSelectedWord }) => {
  const [word, setWord] = useState(selectedWord || "");
  const [aslGloss, setAslGloss] = useState("");
  const [loading, setLoading] = useState(false);
  const modelRef = useRef(null);
  const mixer = useRef(null);
  const [animationUrl, setAnimationUrl] = useState("");
  const { isPlease, setIsPlease, activeWord, setActiveWord } = useContext(context);

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

  const loadFBXModel = (url) => {
    if (!url) return;

    const loader = new FBXLoader();
    loader.load(url, (fbx) => {
      if (modelRef.current) {
        modelRef.current.clear();
      }

      modelRef.current = fbx;
      if (mixer.current) {
        mixer.current = new AnimationMixer(fbx);
        const action = mixer.current.clipAction(fbx.animations[0]);
        action.play();
      }
    });
  };

  const handleConvert = async () => {
    if (!word.trim()) {
      setAslGloss("Please enter a word!");
      return;
    }

    setLoading(true);
    setAslGloss("");

    try {
      const token = "your-auth-token"; 
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

      const animationFile = mapGlossToAnimation(gloss);
      setAnimationUrl(animationFile);
    } catch (error) {
      setAslGloss(error.response?.data?.message || "Error converting text.");
      console.error("Error response:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const mapGlossToAnimation = (gloss) => {
    console.log("Received gloss:", gloss);

    const normalizedGloss = gloss.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    console.log("HeLLO")
    const animationMap = {
      "Hello": "/models/finalhello.glb",
      "Please": '/models/finalplease.glb'
    };

    if (animationMap[normalizedGloss]) {
      setActiveWord(normalizedGloss);
      console.log(`Matched animation from gloss: ${animationMap[normalizedGloss]}`);
      return animationMap[normalizedGloss];
    } else {
      console.log("No matching animation found for gloss:", gloss);
      return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-purple-200">
     
      <div className="mt-6">
        {!selectedWord || !animationUrl ? (
          <BlinkCharacter />
        ) : (
          <>
            <Character />
            <div style={{ width: "100%", height: "400px" }}>
              <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} />
                {modelRef.current ? <primitive object={modelRef.current} /> : null}
              </Canvas>
            </div>
          </>
        )}
      </div>
      
      <div className="flex space-x-4 items-center mt-8">
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

      {aslGloss && <div className="mt-6 text-lg font-semibold text-gray-700">{aslGloss}</div>}
    </div>
  );
};

export default WordToASLConverter;
