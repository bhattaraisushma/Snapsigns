import React, { useState, createContext, useContext } from "react";


 export const context = createContext();

export const ContextProvider = ({ children }) => {
  const [isPlease, setIsPlease] = useState(false);
  const [isHello, setIsHello] = useState(false);
  const [activeWord, setActiveWord] = useState(""); 
  const[selectedWord, setSelectedWord] = useState("");
  const [map,setMap]=useState("");


 
  return (
    <context.Provider value={{ isPlease, setIsPlease ,isHello,setIsHello,activeWord, setActiveWord,map,setMap}}>
      {children}
    </context.Provider>
  );
};




