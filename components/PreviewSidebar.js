// components/Sidebar.js
import React, { useState, useContext } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { ImageCroppedContext } from "@/contexts/ImageCroppedContext";
import { ImagePixelatedContext } from "@/contexts/ImagePixelatedContext";

const Sidebar = ({ setBlockSize, blockSize }) => {
  const { croppedImage, setCroppedImage } = useContext(ImageCroppedContext);
  const { xBlocks, yBlocks, pixelatedImage } = ImagePixelatedContext;

  return (
    <div className="col-12 col-4-md flex column between">
      <div className="preview--md">
        <div className="controls">
          <button className="button button--box">
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
        </div>
        {croppedImage && <img src={croppedImage} alt="Original Image" />}
      </div>
      <div className="flex between">
        <div className="block-size">
          <p className="mb-d3 semibold">Block size</p>
          <div className="block-size__content">
            <label htmlFor="one">
              <input
                type="radio"
                id="one"
                name="blockSize"
                checked={blockSize == 1}
                onChange={() => setBlockSize(1)}
              />
              <div className="number">
                <span>1&quot;</span>
              </div>
            </label>
            <label htmlFor="two">
              <input
                type="radio"
                id="two"
                name="blockSize"
                checked={blockSize == 2}
                onChange={() => setBlockSize(2)}
              />
              <div className="number">
                <span>2&quot;</span>
              </div>
            </label>
            <label htmlFor="three">
              <input
                type="radio"
                id="three"
                name="blockSize"
                checked={blockSize == 3}
                onChange={() => setBlockSize(3)}
              />
              <div className="number">
                <span>3&quot;</span>
              </div>
            </label>
          </div>
        </div>
        <div className="price">
          <p className="mb-d3 semibold">Estimated price</p>
          <div className="price__content">
            <span>$</span>
            <span className="h2 semibold">250</span>
          </div>
        </div>
      </div>
      <div className="buttons mt mb-x3 mb-0-md">
        <Link className="button button--black" href="/">
          Buy 3D model
        </Link>
        <Link className="button button--brand mt-d1-2" href="/">
          Buy your panel now
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
