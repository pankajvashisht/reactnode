import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap/Modal";
const Modals = ({ show,onHide, title, body,footer }) => {
  return (
    <>
     

      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          {footer}
          <Button variant="danger" onClick={onHide}>
            close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
Modals.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

Modals.defaultProps = {
    footer: null,
};

export default Modals;
