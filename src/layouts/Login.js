import React from "react";
import PropTypes from "prop-types";
import { Container, Row } from "shards-react";


const Login = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
    {children}
    </Row>
  </Container>
);

Login.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

Login.defaultProps = {
  noNavbar: true,
  noFooter: false
};

export default Login;
