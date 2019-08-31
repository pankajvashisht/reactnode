import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
} from "shards-react";

const UserDetails = ({ userDetails }) => {
  return (
    <Card small className="mb-4 pt-3">
      <CardHeader className="border-bottom text-center">
        <div className="mb-3 mx-auto">
          <img
            className="rounded-circle"
            src={userDetails.profile}
            alt={userDetails.name}
            width="110"
          />
        </div>
        <h4 className="mb-0">{userDetails.name}</h4>
        <span className="text-muted d-block mb-2">{userDetails.jobTitle}</span>
      </CardHeader>
    </Card>
  );
};

UserDetails.propTypes = {
  /**
   * The user details object.
   */
  userDetails: PropTypes.object
};

UserDetails.defaultProps = {
  userDetails: {
    name: "Sierra Brooks",
    profile: require("./../../images/avatars/0.jpg"),
  }
};

export default UserDetails;
