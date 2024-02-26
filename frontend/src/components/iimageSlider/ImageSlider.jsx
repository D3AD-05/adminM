import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ImageSlider = ({ images }) => {
  const slides = images
    ? images.map((image) => ({
        original: image,
        thumbnail: image,
      }))
    : [];

  return (
    <div style={{ maxWidth: "300px" }}>
      <ImageGallery items={slides} />
    </div>
  );
};

export default ImageSlider;
