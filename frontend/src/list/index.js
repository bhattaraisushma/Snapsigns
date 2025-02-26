import React from "react";
import { useContext } from "react";
import { context } from "../ContextAPI/context";
function WordDisplay() {
  const {activeWord, setActiveWord} = useContext(context);
  const words = ["hello", "name", "sorry", "thank you", "happy", "help", "stop", "love", "please", "go","advance"];

  return (
    <div className="flex flex-col items-center justify-center bg-white h-full">
      <h1 className="text-3xl font-bold mb-6">Words to Convert to ASL</h1>
      <ul className="bg-white w-3/4 p-4 rounded-lg shadow-lg border-[3px] border-purple-200">
        {words.map((word, index) => (
          <li
            key={index}
            className="text-lg text-gray-800 p-2 border-b last:border-b-0 cursor-pointer hover:bg-purple-100"
            onClick={() => setActiveWord(word)}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WordDisplay;

