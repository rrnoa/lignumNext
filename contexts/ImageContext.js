import { createContext, useState } from "react";

export const ImageContext = createContext();

const ImageProvider = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  return (
    <ImageContext.Provider value={{ uploadedImage, setUploadedImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageProvider;
