import React from "react";
import PropTypes from "prop-types";
const Audio = ({ url, height, width }) => (
  <audio controls height={height} width={width}>
    <source src={url} type="audio/ogg" />>
    <source src={url} type="audio/mpeg" />> Your browser does not support
    the audio tag.
  </audio>
);

Audio.propTypes = {
  url: PropTypes.string.isRequired
};

Audio.defaultProps = {
  height: "375",
  width: "100%"
};

export default Audio;
