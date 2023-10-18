import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { adjustContrast } from "@/libs/cropImage";

const ContrastScreen = ({
  setActiveScreen,
  uploadedImage,
  setUploadedImage,
}) => {
  const [contrast, setContrast] = useState(0);
  const [originalImage, setOriginalImage] = useState(uploadedImage); //almaceno la imagen que tiene crop antes de modificar

  const accept = () => {
    setActiveScreen("all");
  };

  const reject = () => {
    setActiveScreen("all");
    setUploadedImage(originalImage);
  };

  const adjustContrastHandler = async () => {
    const newImage = await adjustContrast(originalImage, contrast);
    setUploadedImage(newImage);
  };

  return (
    <div className="button-container">
      <div className="aux">
        <label>Contrast: </label>
        <input
          type="range"
          className="range--brand"
          min="-255"
          max="255"
          value={contrast}
          onChange={(e) => setContrast(+e.target.value)}
          onMouseUp={adjustContrastHandler}
        />
      </div>
      <div className="aux">
        <button onClick={reject} className="button button--box button--cancel">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button onClick={accept} className="button button--box button--black">
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </div>
  );
};

export default ContrastScreen;
