import React from "react";
import PropTypes from "prop-types";
import Image from "./Image";
const style ={
    marginLeft: "33%",
    height: "300px",
    width: "300px",
    position:"absolute"
};
const Loader = () => (<Image style={style} src={require('../../images/loader.gif')} />);
Loader.propTypes = {
  src: PropTypes.string.isRequired
};

Loader.defaultProps = {
  circle: null,
  classes: "",
  alt: "image",
  height: "50",
  width: "50"
};

export default Loader;
