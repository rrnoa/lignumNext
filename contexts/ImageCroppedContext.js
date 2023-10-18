import { createContext, useState } from "react";

export const ImageCroppedContext = createContext();

const ImageCroppedProvider = ({ children }) => {
  const [croppedImage, setCroppedImage] = useState(null);

  return (
    <ImageCroppedContext.Provider value={{ croppedImage, setCroppedImage }}>
      {children}
    </ImageCroppedContext.Provider>
  );
};

export default ImageCroppedProvider;
