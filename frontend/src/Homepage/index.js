import React from 'react'
<<<<<<< HEAD
// import Character from '../Animated'
import WordDisplay from '../list';
import Character from '../Animated'
import WordToASLConverter from '../gloss'
>>>>>>> b4979d5f037be2f21e55f5bb7723a61b079d6797
const Homepage = () => {
  return (
    <div className='flex flex-col h-screen bg-purple-200 gap-5 justify-center items-center'>
    
<<<<<<< HEAD
      {/* <Character/>  */}
     
    <p className='text-6xl italic'>Show your <span className='text-purple-700'>creativity </span> here</p>
=======
      {/* <Character/> */}
     <WordToASLConverter/>
    
>>>>>>> b4979d5f037be2f21e55f5bb7723a61b079d6797
      <input type="text" placeholder="Enter text to generate sign language" className='border-solid  text-center h-[5rem] w-[20rem] rounded-[4rem]' />
      <WordDisplay/>
    </div>
  )
}

export default Homepage
