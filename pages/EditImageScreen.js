import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { ImageContext } from "../contexts/ImageContext";
import RotateScreen from "@/components/RotateScreen";
import HslScreen from "@/components/HslScreen";
import {
  faAdjust,
  faRotate,
  faPalette,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import ContrastScreen from "@/components/ContrastScreen";

function EditImageScreen() {
  const { uploadedImage, setUploadedImage } = useContext(ImageContext);
  const [activeScreen, setActiveScreen] = useState("all");
  return (
    <div>
      <Header />
      <section>
        <div className="wrapper-md">
          <article className="article--tool">
            <div className="article--tool__header hidden block-md">
              <h5>Edit image</h5>
              <p>Use the editor for retouching your image</p>
            </div>
            <div className="article--tool__body">
              <div className="edit">
                <div className="edit__sidetool">
                  {activeScreen === "all" && (
                    <>
                      <button
                        className="button button--box"
                        onClick={() => setActiveScreen("rotate")}
                      >
                        <FontAwesomeIcon icon={faRotate} />
                      </button>
                      <button
                        className="button button--box"
                        onClick={() => setActiveScreen("hue")}
                      >
                        <FontAwesomeIcon icon={faPalette} />
                      </button>
                      <button
                        className="button button--box"
                        onClick={() => setActiveScreen("contrast")}
                      >
                        <FontAwesomeIcon icon={faAdjust} />
                      </button>
                    </>
                  )}
                  {activeScreen === "rotate" && (
                    <div className="hidden block-md">
                      <button
                        className="button button--box button--no-hover"
                        onClick={() => setActiveScreen("rotate")}
                      >
                        <FontAwesomeIcon icon={faRotate} />
                      </button>
                      <p className="mt-d6 text-center">Rotate</p>
                    </div>
                  )}
                  {activeScreen === "hue" && (
                    <div className="hidden block-md">
                      <button
                        className="button button--box button--no-hover"
                        onClick={() => setActiveScreen("hue")}
                      >
                        <FontAwesomeIcon icon={faPalette} />
                      </button>
                      <p className="mt-d6 text-center">HUE</p>
                    </div>
                  )}
                  {activeScreen === "contrast" && (
                    <div className="hidden block-md">
                      <button
                        className="button button--box button--no-hover"
                        onClick={() => setActiveScreen("contrast")}
                      >
                        <FontAwesomeIcon icon={faAdjust} />
                      </button>
                      <p className="mt-d6 text-center">Contrast</p>
                    </div>
                  )}
                </div>
                <div className="flex column">
                  <div className="edit__canvas">
                    {uploadedImage && (
                      <img src={uploadedImage} alt="Image to edit" />
                    )}
                  </div>
                  <div className="edit__bottomtool">
                    {activeScreen === "rotate" && (
                      <RotateScreen
                        setActiveScreen={setActiveScreen}
                        uploadedImage={uploadedImage}
                        setUploadedImage={setUploadedImage}
                      />
                    )}
                    {activeScreen === "hue" && (
                      <HslScreen
                        setActiveScreen={setActiveScreen}
                        uploadedImage={uploadedImage}
                        setUploadedImage={setUploadedImage}
                      />
                    )}
                    {activeScreen === "contrast" && (
                      <ContrastScreen
                        setActiveScreen={setActiveScreen}
                        uploadedImage={uploadedImage}
                        setUploadedImage={setUploadedImage}
                      />
                    )}
                    {activeScreen === "all" && (
                      <button
                        className="button button--brand button--finish"
                        onClick={() => window.history.back()}
                      >
                        Finish edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="panel--footer-xs">
              <div className="flex middle around">
                {activeScreen === "all" && (
                  <>
                    <button
                      className="button button--box"
                      onClick={() => setActiveScreen("rotate")}
                    >
                      <FontAwesomeIcon icon={faRotate} />
                    </button>
                    <button
                      className="button button--box"
                      onClick={() => setActiveScreen("hue")}
                    >
                      <FontAwesomeIcon icon={faPalette} />
                    </button>
                    <button
                      className="button button--box"
                      onClick={() => setActiveScreen("contrast")}
                    >
                      <FontAwesomeIcon icon={faAdjust} />
                    </button>
                  </>
                )}
              </div>
              <div>
                {activeScreen === "rotate" && (
                  <RotateScreen
                    setActiveScreen={setActiveScreen}
                    uploadedImage={uploadedImage}
                    setUploadedImage={setUploadedImage}
                  />
                )}
                {activeScreen === "hue" && (
                  <HslScreen
                    setActiveScreen={setActiveScreen}
                    uploadedImage={uploadedImage}
                    setUploadedImage={setUploadedImage}
                  />
                )}
                {activeScreen === "contrast" && (
                  <ContrastScreen
                    setActiveScreen={setActiveScreen}
                    uploadedImage={uploadedImage}
                    setUploadedImage={setUploadedImage}
                  />
                )}
                {activeScreen === "all" && (
                  <button
                    className="button button--brand button--finish"
                    onClick={() => window.history.back()}
                  >
                    Finish edit
                  </button>
                )}
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
          src="/lignum-logo-black.svg"
          width={120}
          height={120}
          alt="Logo Lignum"
        />
      </Link>
      <Link className="button button--cart" href="/">
        <Image
          src="/icons/shopping-cart-gray.svg"
          width={24}
          height={24}
          alt="Shopping Cart"
        />
        <span className="text-gray1">Cart</span>
      </Link>
    </header>
  );
}

export default EditImageScreen;
