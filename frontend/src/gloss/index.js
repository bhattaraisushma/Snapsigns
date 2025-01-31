import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import * as THREE from "three";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Canvas } from "@react-three/fiber";
import { AnimationMixer } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { context } from "../ContextAPI/context";
import Character from "../Animated/character";
import BlinkCharacter from "../blink.js";

const WordToASLConverter = ({ selectedWord, setSelectedWord }) => {
  const [word, setWord] = useState(selectedWord || "");
  const [aslGloss, setAslGloss] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); 
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
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();
      }
    });
  };

  const handleConvert = async () => {
    if (!word.trim()) {
      setAslGloss("");
      setShowModal(true);
      return;
    }

    setLoading(true);
    setAslGloss("");
    setShowModal(false);

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
      if (!animationFile) {
        setShowModal(true); 
      }
      setAnimationUrl(animationFile);
    } catch (error) {
      setShowModal(true);
      console.error("Error response:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const mapGlossToAnimation = (gloss) => {
    const normalizedGloss = gloss.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    const animationMap = {
      Hello: "/models/hello.glb",
      Please: "/models/please.glb",
      Love:"/models/love.glb",
    };

    if (animationMap[normalizedGloss]) {
      setActiveWord(normalizedGloss);
      return animationMap[normalizedGloss];
    } else {
      return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-purple-20">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-xl font-medium mb-4">No Animation Found!</p>
            <p className="text-gray-700">No matching animation available for this word.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {!selectedWord ? (
          <BlinkCharacter />
        ) : (
          <>
            <Character />
            <div style={{ width: "50px", height: "50px" }}>
              <Canvas>
                <ambientLight intensity={1} />
                <spotLight position={[50, 50, 50]} />
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

      {aslGloss && <div className="mt-0 text-lg font-semibold text-gray-700">{aslGloss}</div>}
    </div>  );
};

export default WordToASLConverter;

