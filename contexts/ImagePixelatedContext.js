import { createContext, useState } from "react";

export const ImagePixelatedContext = createContext();

const ImagePixelatedProvider = ({ children }) => {
  const [pixelatedImage, setPixelatedImage] = useState(null);
  const [colorsArray, setColorsArray] = useState([]);
  const [blockSize, setBlockSize] = useState(0);
  const [xBlocks, setXBlocks] = useState(0);
  const [yBlocks, setYBlocks] = useState(0);

  const contextValue = {
    pixelatedImage,
    setPixelatedImage,
    colorsArray,
    setColorsArray,
    blockSize,
    setBlockSize,
    xBlocks,
    setXBlocks,
    yBlocks,
    setYBlocks,
  };

  return (
    <ImagePixelatedContext.Provider value={contextValue}>
      {children}
    </ImagePixelatedContext.Provider>
  );
};

export default ImagePixelatedProvider;
