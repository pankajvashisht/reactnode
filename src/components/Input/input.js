import React from "react";
import PropTypes from 'prop-types';

const Input = ({
    placeholder, action, name, classes, type, value
  }) =>  (     
    <input className={classes} type={type} value={value} onChange={action} name={name} placeholder={placeholder} />
)
Input.propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired
  };
  
  Input.defaultProps = {
    action:null,
    type:"text",
    value:""
  };

export default Input;