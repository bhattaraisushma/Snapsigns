
import React, { useState } from 'react';
import WordDisplay from '../list';
import WordToASLConverter from '../gloss';

const Homepage = () => {
  const [selectedWord, setSelectedWord] = useState("");

  return (
    <div className='flex flex-row h-screen bg-purple-200 items-center'>
      <div className='h-screen w-[40%]'>
        <WordDisplay setSelectedWord={setSelectedWord} />
      </div>
      <WordToASLConverter selectedWord={selectedWord} setSelectedWord={setSelectedWord} />
    </div>
  );
};

export default Homepage;
