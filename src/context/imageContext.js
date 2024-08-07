// ImageContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a Context for the image data
const ImageContext = createContext();

// Create a provider component
export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook for using the image context
export const useImages = () => {
  return useContext(ImageContext);
};
