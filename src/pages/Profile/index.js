import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "shards-react";
import UserDetails from "../../components/user-profile-lite/UserDetails";
import UserAccountDetails from "../../components/user-profile-lite/UserAccountDetails";
import PageTitle from "../../components/common/PageTitle";

const Profile = () => {
  const [userinfo, UpdateUserInfo] = useState([]);
  useEffect(() => {
    const login_datails = JSON.parse(localStorage.getItem("userInfo"));
    UpdateUserInfo([login_datails]);
  });

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Admin"
          subtitle="Admin Profile"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col lg="4">
          <UserDetails userDetails={userinfo[0]} />
        </Col>
        <Col lg="8">
          <UserAccountDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
