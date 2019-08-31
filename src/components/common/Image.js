import React, { useState } from "react";
import PropTypes from "prop-types";
import Modals from "./Modals";

const Image = ({ classes, src, circle, alt, height, width,style }) => {
  const [modalshow, SetModal] = useState(false);
  const showImage = () => {
    console.log(modalshow);
    SetModal(true);
    return (
      <Modals
        show={modalshow}
        title="Image Review"
        body={
          <img
            src={src}
            alt={alt}
            className={classes}
            style={circle}
            height={height}
            width={width}
          />
        }
        onHide={() => {
          SetModal(false);
        }}
      />
    );
  };
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onClick={showImage}
      className={classes}
      height={height}
      width={width}
    />
  );
};
Image.propTypes = {
  src: PropTypes.string.isRequired
};

Image.defaultProps = {
  circle: null,
  classes: "",
  alt: "image",
  height: "50",
  width: "50",
  style:{ cursor: "pointer" }
};

export default Image;
