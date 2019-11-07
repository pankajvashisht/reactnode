import React from "react";
import PropTypes from "prop-types";
const PdfView = ({  url, height, width }) => ( <embed src= {url} width= {width} height= {height} />)

PdfView.propTypes = {
  url: PropTypes.string.isRequired,
};

PdfView.defaultProps = {

  height:"375",
  width:"100%"
};

export default PdfView;