import React from 'react'
import Character from '../Animated'

const Homepage = () => {
  return (
    <div className='flex flex-col h-screen bg-purple-200 gap-5 justify-center items-center'>
    
      <Character/>
     
    
      <input type="text" placeholder="Enter text to generate sign language" className='border-solid  text-center h-[5rem] w-[20rem] rounded-[4rem]' />
    </div>
  )
}

export default Homepage
