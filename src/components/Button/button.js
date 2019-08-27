import React from "react";
import PropTypes from 'prop-types';

const Button = ({
    children, action, classes, type, disabled
  }) =>  (     
    <button className={classes} type={type} onClick={action} disabled = {disabled}>
        {children}
    </button>
)
Button.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.string.isRequired
  };
  
  Button.defaultProps = {
    action:null,
    type:"button",
    disabled:null
  };

export default Button;