// components/MainPreview.js
import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { ImagePixelatedContext } from "../contexts/ImagePixelatedContext";
import ThreeScene from "./ThreeScene";

const MainPreview = ({ blockSize }) => {
  const { pixelatedImage, setCroppedImage } = useContext(ImagePixelatedContext);
  return (
    <div>
      <div className="preview-info">
        <div>
          <p>
            <span className="semibold">Dimensions: </span>24 x 24 x 1 Inches
          </p>
          <p>
            <span className="semibold">Blocks count: </span>280
          </p>
        </div>
        <button className="button button--box hidden-md">
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </div>
      <ThreeScene blockSize={blockSize} />
    </div>
  );
};
export default MainPreview;
