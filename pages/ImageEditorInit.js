import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageContext } from "../contexts/ImageContext";
import { ImageCroppedContext } from "../contexts/ImageCroppedContext";
import { ImagePixelatedContext } from "../contexts/ImagePixelatedContext";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import getCroppedImg from "@/libs/cropImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export default function ImageEditorInit() {
  const router = useRouter();
  const { uploadedImage } = useContext(ImageContext);
  const { setCroppedImage } = useContext(ImageCroppedContext);
  const { setXBlocks, setYBlocks } = useContext(ImagePixelatedContext);

  const [width, setWidth] = useState(24);
  const [height, setHeight] = useState(24);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropImageUrl, setCropImageUrl] = useState(); //esto es para mostrar en el sideBar puede que no haga falta
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    const cropUrl = await getCroppedImg(uploadedImage, croppedAreaPixels);
    setCropImageUrl(cropUrl); //actualiza el preview del crop
    setCroppedImage(cropUrl); //actualiza el context
  };

  const handleWidth = (event) => {
    let { min, max, value } = event.target;
    //value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setWidth(value);
  };

  const handleHeight = (event) => {
    let { min, max, value } = event.target;
    //value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    setHeight(value);
  };

  const handlePreview = async () => {
    setXBlocks(width); //para el contexto
    setYBlocks(height); //para el contexto
    router.push("/preview");
  };

  return (
    <div>
      <Header />
      <section>
        <div className="wrapper-md">
          <article className="article--tool">
            <div className="article--tool__header hidden block-md">
              <h5>Prepare your image</h5>
              <p>Choose your panel size and crop the image</p>
            </div>
            <div className="article--tool__body">
              <div className="row">
                <div className="col-12 col-8-md">
                  <div className="article--tool__box">
                    {uploadedImage && (
                      <Cropper
                        image={uploadedImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={width / height}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    )}
                    <div className="buttons-box">
                      <button
                        className="button button--box button--edit"
                        onClick={() => router.push("/EditImageScreen")}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button className="button button--box button--images">
                        <FontAwesomeIcon icon={faImages} />
                      </button>
                    </div>
                  </div>
                </div>
                <Sidebar
                  width={width}
                  height={height}
                  handleWidth={handleWidth}
                  handleHeight={handleHeight}
                  cropImageUrl={cropImageUrl}
                  router={router}
                  handlePreview={handlePreview}
                />
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
function Header() {
  return (
    <header className="header">
      <Link href="/">
        <Image
          src="lignum-logo-black.svg"
          width={120}
          height={120}
          alt="Logo Lignum"
        />
      </Link>
      <Link className="button button--cart" href="/">
        <Image
          src="icons/shopping-cart-gray.svg"
          width={24}
          height={24}
          alt="Shopping Cart"
        />
        <span className="text-gray1">Cart</span>
      </Link>
    </header>
  );
}

function Sidebar({
  width,
  handleWidth,
  height,
  handleHeight,
  cropImageUrl,
  router,
  handlePreview,
}) {
  return (
    <div className="col-12 col-4-md flex column between panel--footer-xs">
      <div className="box">
        <p className="semibold">Panel size</p>
        <div className="mb-d3 s1 italic text-gray1">
          Starting from 24 x 24 inches
        </div>
        <div className="box__input">
          <div className="input">
            <label>W</label>
            <input
              placeholder="24"
              type="number"
              value={width}
              onChange={handleWidth}
            />
          </div>
          <div className="input">
            <label>H</label>
            <input
              placeholder="24"
              type="number"
              value={height}
              onChange={handleHeight}
            />
          </div>
        </div>
      </div>
      <div className="hidden block-md">
        {cropImageUrl ? (
          <div className="prepare-preview">
            <img src={cropImageUrl} alt="Cropped Preview" />
          </div>
        ) : (
          <p className="text-gray1 text-center italic s1">
            Preview will appear here
          </p>
        )}
      </div>
      <button
        className="button button--brand button--preview"
        onClick={handlePreview}
      >
        Preview
      </button>
    </div>
  );
}
