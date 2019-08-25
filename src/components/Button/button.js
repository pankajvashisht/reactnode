import React from "react";
import PropTypes from 'prop-types';

const Button = ({
    children, action, classes, type
  }) =>  (     
    <button className={classes} type={type} onClick={action}>
        {children}
    </button>
)
Button.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.string.isRequired
  };
  
  Button.defaultProps = {
    action:null,
    type:"button"
  };

export default Button;