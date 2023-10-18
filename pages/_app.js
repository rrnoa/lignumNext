import ImageProvider from "@/contexts/ImageContext";
import ImageCroppedProvider from "@/contexts/ImageCroppedContext";
import ImagePixelatedProvider from "@/contexts/ImagePixelatedContext";
import "../styles/main.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ImageProvider>
        <ImageCroppedProvider>
          <ImagePixelatedProvider>
            <Component {...pageProps} />
          </ImagePixelatedProvider>
        </ImageCroppedProvider>
      </ImageProvider>
    </>
  );
}

export default MyApp;
