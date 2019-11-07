import React from "react";
import PropTypes from "prop-types";
import { updateUser } from "../../Apis/apis";
const StatusUpdate = ({  table, data, onUpdate }) => {

    const updateStatus = () => {
        if (data.status) {
            data.status = 0;
        }else{
            data.status = 1;
        }
        updateUser({table,status:data.status,id:data.id}).then(info => {
          onUpdate(data);
        }).catch(err => {})
        
    };
    const statusCheck = () => {return (data.status === 1) ? 'badge badge-pill badge-success': 'badge badge-pill badge-danger';}
    const text = () => {return (data.status === 1) ? 'Active': 'Deactive';}

    return (<span style={{cursor:"pointer"}} onClick={updateStatus} className={statusCheck()}>{text()}</span>);
  
};

StatusUpdate.propTypes = {
  classes: PropTypes.string.isRequired,
  table: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

StatusUpdate.defaultProps = {
  type: "button",
  disabled: null,
  classes: "badge badge-success"
};

export default StatusUpdate;