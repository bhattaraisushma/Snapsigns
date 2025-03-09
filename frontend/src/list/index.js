import React, { useContext, useState } from "react";
import { context } from "../ContextAPI/context";

const synonym_map = {
  hello: ["hi", "hey", "greeting"],
  name: ["identity"],
  sorry: ["apologize", "regret"],
  "thank you": ["thanks", "appreciate", "grateful"],
  happy: ["joyful", "glad", "pleased"],
  help: ["assist", "support", "aid"],
  stop: ["halt", "cease", "pause"],
  love: ["affection", "care", "adore"],
  please: ["kindly", "request"],
  go: ["move", "proceed", "advance"],
};

function WordDisplay() {
  const { activeWord, setActiveWord } = useContext(context);
  const words = Object.keys(synonym_map);
  const [selectedWord, setSelectedWord] = useState(null);

  const handleWordClick = (word) => {
    setActiveWord(word);
    setSelectedWord(word in synonym_map ? word : null);
  };

  return (
    <div className="flex items-center justify-center bg-white h-full p-4">
      <div className="w-3/5">
        <h1 className="text-3xl font-bold mb-6 text-center">Words to Convert to ASL</h1>
        <ul className="bg-white w-full p-4 rounded-lg shadow-lg border-[3px] border-purple-200">
          {words.map((word, index) => (
            <li
              key={index}
              className={`text-lg text-gray-800 p-2 border-b last:border-b-0 cursor-pointer hover:bg-purple-100 ${
                activeWord === word ? "bg-purple-200" : ""
              }`}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </li>
          ))}
        </ul>
      </div>

      {selectedWord && synonym_map[selectedWord] && (
        <div className="w-2/5 ml-6 bg-white-100 p-4 rounded-lg shadow-lg border-[3px] border-gray-300 relative">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            onClick={() => setSelectedWord(null)}
          >
            ❌
          </button>
          <h3 className="text-xl font-semibold text-center">Similar Words</h3>
          <ul className="mt-2 text-center">
            {synonym_map[selectedWord].map((synonym, index) => (
              <li
                key={index}
                className="text-lg text-gray-700 p-2 cursor-pointer hover:bg-gray-200 rounded"
                onClick={() => handleWordClick(synonym)}
              >
                {synonym}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WordDisplay;


