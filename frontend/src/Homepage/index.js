import React from 'react'
// <<<<<<< HEAD
// import Character from '../Animated'
import WordDisplay from '../list';
import Character from '../Animated'
import WordToASLConverter from '../gloss'
// >>>>>>> b4979d5f037be2f21e55f5bb7723a61b079d6797
const Homepage = () => {
  return (
    <div className='flex flex-row h-screen bg-purple-200   items-center'>
    
    <div className='h-screen w-[40%] '>
    <WordDisplay/>
    </div>
      {/* <Character/> */}
     <WordToASLConverter/>
    
      {/* <input type="text" placeholder="Enter text to generate sign language" className='border-solid  text-center h-[5rem] w-[20rem] rounded-[4rem]' />
    */}
     
    </div>
  )
}

export default Homepage
