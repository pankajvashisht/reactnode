import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/button";
import swal from "sweetalert";
import { deleteUser } from "../../Apis/apis";
const DeleteData = ({ classes, children, table, data,ondelete }) => {
  const deleted = ( ) => {
    swal({
      title: `Are you sure want delete?`,
      text: `Are you sure want to delete ` + table,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        deleteUser({table:table,id:data}).then(data => {
          swal(table+" have been deleted", {
            icon: "success"
          });
          ondelete(data);
        }).catch(err => {
          swal("Something went wrong", {
            icon: "error"
          });
        });
      } else {
        swal("Process Cancel");
      }
    });
  };

  return (
    <Button
      classes={classes}
      children={children}
      action={deleted}
    />
  );
};

DeleteData.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.string.isRequired,
  table: PropTypes.string.isRequired,
  data: PropTypes.number.isRequired
};

DeleteData.defaultProps = {
  type: "button",
  disabled: null,
  classes: "btn btn-danger"
};

export default DeleteData;
