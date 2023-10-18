import dynamic from "next/dynamic";
import UploadImage from "@/components/UploadImage";
import Link from "next/link";
import Image from "next/image";

const DynamicUploadImage = dynamic(() => import("../components/UploadImage"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
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
      <section>
        <div className="wrapper-md">
          <article className="article--tool">
            {/* UPLOAD IMAGE */}
            <div className="article--tool__header">
              <h5>Upload your image</h5>
              <p>Image you want to transform into a panel</p>
            </div>
            <div className="article--tool__upload mb-x5-md">
              <DynamicUploadImage />
              <div className="footer--upload">Lignum Block</div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
