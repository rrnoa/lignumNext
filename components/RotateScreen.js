import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faRotateRight,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { rotateImage, flipImage } from "@/libs/cropImage";
import Image from "next/image";

const RotateScreen = ({ setActiveScreen, uploadedImage, setUploadedImage }) => {
  const [originalImage, setOriginalImage] = useState(uploadedImage); //almaceno la imagen que tiene crop antes de modificar

  const rotateLeft = async () => {
    const rI = await rotateImage(uploadedImage, -90);
    setUploadedImage(rI);
  };

  const rotateRight = async () => {
    const rI = await rotateImage(uploadedImage, 90);
    setUploadedImage(rI);
  };

  const flip = async (horizontal, vertical) => {
    const fI = await flipImage(uploadedImage, horizontal, vertical);
    setUploadedImage(fI);
  };

  const accept = () => {
    setActiveScreen("all");
  };

  const reject = () => {
    setActiveScreen("all");
    setUploadedImage(originalImage);
  };

  return (
    <>
      {/* Buttons */}
      <div className="button-container">
        <div className="inline-flex">
          <button className="button button--box" onClick={rotateLeft}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          <button className="button button--box" onClick={rotateRight}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <button
            className="button button--box"
            onClick={() => flip(true, false)}
          >
            <Image
              src="/icons/flip-left.svg"
              width={16}
              height={16}
              alt="Flip left"
            />
          </button>
          <button
            className="button button--box"
            onClick={() => flip(false, true)}
          >
            <Image
              src="/icons/flip-right.svg"
              width={16}
              height={16}
              alt="Flip right"
            />
          </button>
        </div>
        <div className="aux">
          <button
            onClick={reject}
            className="button button--box button--cancel"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <button onClick={accept} className="button button--box button--black">
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      </div>
    </>
  );
};

export default RotateScreen;
