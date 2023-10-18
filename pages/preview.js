// pages/preview.js
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "../components/PreviewSidebar";
import MainPreview from "../components/MainPreview";

import { ImageCroppedContext } from "../contexts/ImageCroppedContext";
import { ImagePixelatedContext } from "../contexts/ImagePixelatedContext";

const PreviewPage = () => {
  //este es como un puente entre el sideBar y el MainView
  //para pasar el tamaño de los bloques desde el sidebar para el MainView
  const [blockSize, setBlockSize] = useState(1);

  const { croppedImage } = useContext(ImageCroppedContext);

  return (
    <div>
      <Header />
      <section>
        <div className="wrapper-md">
          <article className="article--tool">
            <div className="article--tool__header">
              <div className="hidden block-md">
                <h5>Preview</h5>
                <p>This is how your panel will look</p>
              </div>
            </div>
            <div className="article--tool__body">
              <div className="row">
                <div className="col-12 col-8-md">
                  <div className="article--tool__canvas">
                    <MainPreview blockSize={blockSize} />
                  </div>
                </div>
                <Sidebar blockSize={blockSize} setBlockSize={setBlockSize} />
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

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

export default PreviewPage;
