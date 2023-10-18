import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { adjustHSL } from "@/libs/cropImage";

const HslScreen = ({ setActiveScreen, uploadedImage, setUploadedImage }) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);
  const [originalImage, setOriginalImage] = useState(uploadedImage); //almaceno la imagen que tiene crop antes de modificar
  //const [editedImage, setEditedImage] = useState(imageSrc); // Esta imagen mostrará los cambios.

  const hueHandler = async () => {
    const hI = await adjustHSL(originalImage, hue, saturation, lightness);
    setUploadedImage(hI);
  };

  /*const adjustHandler = async () => {
    try {
      const newImage = await adjustHSL(originalImage, hue, saturation, lightness);
      setEditedImage(newImage.src);
    } catch (error) {
      console.error('Error adjusting the image:', error);
    }
  };*/

  const accept = () => {
    setActiveScreen("all");
  };

  const reject = () => {
    setActiveScreen("all");
    setUploadedImage(originalImage);
  };

  return (
    <div className="button-container">
      <div className="flex column flex-row-md middle-md">
        <div className="mb-d1-2 mb-0-md mr-x2 mr-d1-2-md">
          <input
            type="range"
            className="range--hue"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(+e.target.value)}
            onMouseUp={hueHandler}
          />
        </div>
        <div className="mb-d1-2 mb-0-md mr-x2 mr-d1-2-md">
          <input
            type="range"
            className="range--saturation"
            min="-1"
            max="1"
            step="0.01"
            value={saturation}
            onChange={(e) => setSaturation(+e.target.value)}
            onMouseUp={hueHandler}
          />
        </div>
        <div className="mb-d1-2 mb-0-md mr-x2 mr-d1-2-md">
          <input
            type="range"
            className="range--lightness"
            min="-1"
            max="1"
            step="0.01"
            value={lightness}
            onChange={(e) => setLightness(+e.target.value)}
            onMouseUp={hueHandler}
          />
        </div>
      </div>
      <div className="inline-flex">
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

export default HslScreen;
