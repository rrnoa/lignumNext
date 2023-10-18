// UploadImage.js
import { useContext } from "react";
import { useRouter } from "next/router";
import { ImageContext } from "../contexts/ImageContext";

export default function UploadImage() {
  const { setUploadedImage } = useContext(ImageContext);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      router.push("/ImageEditorInit");
    }
  };

  return (
    <div>
      <div className="upload--xs">
        <div className="button button--input button--black">
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <span>Select an image</span>
        </div>
        <p className="my-d1-2 text-center">Or</p>
        <div className="button button--white">Take a photo</div>
      </div>

      <div className="upload--md">
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <label htmlFor="file">
          <div className="aux">
            <div className="upload--md__button">Select an image</div>
            <div className="upload--md__text">Or drop here</div>
          </div>
        </label>
      </div>
      <p className="text-center--xs">
        Use images not smaller than 1024 px x 1024 px, 10MB Max
      </p>
    </div>
  );
}
