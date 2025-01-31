//Homepage/index.js

import React, { useState } from 'react';
import WordDisplay from '../list';
import WordToASLConverter from '../gloss';
import BlinkCharacter from '../blink';


const Homepage = () => {
  const [selectedWord, setSelectedWord] = useState("");

  return (
    <div className='h-screen  flex flex-row bg-purple-200 items-center'>

      <div className='h-screen w-[50%]'>
    
        <WordDisplay setSelectedWord={setSelectedWord} />
      </div>
    
      <WordToASLConverter selectedWord={selectedWord} setSelectedWord={setSelectedWord} />
    </div>
  );
};

export default Homepage;
