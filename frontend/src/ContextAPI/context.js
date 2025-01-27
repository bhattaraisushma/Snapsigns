import React, { useState, createContext, useContext } from "react";


 export const context = createContext();

export const ContextProvider = ({ children }) => {
  const [isPlease, setIsPlease] = useState(false);

 
  return (
    <context.Provider value={{ isPlease, setIsPlease }}>
      {children}
    </context.Provider>
  );
};