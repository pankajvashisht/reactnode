import React from "react";
import PropTypes from "prop-types";

const StatusUpdate = ({  table, data, onUpdate }) => {

    const updateStatus = () => {
        if (data.status) {
            data.status = 0;
        }else{
            data.status = 1;
        }
        onUpdate(data);
    };
    const statusCheck = () => {return (data.status === 1) ? 'badge badge-pill badge-success': 'badge badge-pill badge-danger';}
    const text = () => {return (data.status === 1) ? 'Active': 'Deactive';}

    return (<span style={{cursor:"pointer"}} onClick={updateStatus} className={statusCheck()}>{text()}</span>);
  
};

StatusUpdate.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.string.isRequired,
  table: PropTypes.string.isRequired,
  data: PropTypes.number.isRequired
};

StatusUpdate.defaultProps = {
  type: "button",
  disabled: null,
  classes: "badge badge-success"
};

export default StatusUpdate;