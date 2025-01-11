import React, { useState } from "react";
import axios from "axios";

const WordToASLConverter = () => {
  const [word, setWord] = useState("");
  const [aslGloss, setAslGloss] = useState("");
  const [loading, setLoading] = useState(false);

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

      console.log("Backend response:", response.data.result[0].translation_text.split(": ").pop());
      setAslGloss(response.data.result[0].translation_text.split(": ").pop());
    
    } catch (error) {
      setAslGloss(
        error.response?.data?.message || "Error converting text. Please try again later."
      );
      console.error("Error response:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Convert Word to ASL Gloss</h1>
      <div className="flex space-x-4">
      <input
  type="text"
  placeholder="Enter a word..."
  value={word}
  onChange={(e) => setWord(e.target.value)}
  className="p-4 border rounded-lg w-[1600px] h-[400px] text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
/>



        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          disabled={loading} 
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>
      {aslGloss && (
        <div className="mt-6 text-lg font-semibold text-gray-700">
          {aslGloss}
        </div>
      )}
    </div>
  );
};

export default WordToASLConverter;
