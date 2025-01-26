import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Character from '../Animated/character';
const WordToASLConverter = ({ selectedWord, setSelectedWord }) => {
  const [word, setWord] = useState(selectedWord || "");
  const [aslGloss, setAslGloss] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedWord) {
      setWord(selectedWord);
    }
  }, [selectedWord]);

  const handleConvert = async () => {
    if (!word.trim()) {
      setAslGloss("Please enter a word!");
      return;
    }

    console.log("Submitting text to backend:", word);
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
      setAslGloss(response.data.result[0].translation_text.split(": ").pop());
    } catch (error) {
      setAslGloss(error.response?.data?.message || "Error converting text.");
      console.error("Error response:", error.response?.data || error.message);
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default WordToASLConverter;