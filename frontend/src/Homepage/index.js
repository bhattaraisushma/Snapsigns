import React from 'react'
// import Character from '../Animated'
import WordDisplay from '../list';


const Homepage = () => {
  return (
    <div className='flex flex-col h-screen bg-purple-200 gap-5 justify-center items-center'>
    
      {/* <Character/>  */}
     
    <p className='text-6xl italic'>Show your <span className='text-purple-700'>creativity </span> here</p>
      <input type="text" placeholder="Enter text to generate sign language" className='border-solid  text-center h-[5rem] w-[20rem] rounded-[4rem]' />
      <WordDisplay/>
    </div>
  )
}

export default Homepage
