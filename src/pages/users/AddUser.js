import React, { useState } from "react";
import {
  Container,
  FormFeedback,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  Card,
  CardHeader
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/Button/button";

const AddUser = () => {

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    profile: ""
  });
  let [vaildForm, setVaildForm] = useState({
    name: null,
    email: null,
    password: null,
    profile: null
  });
  const checkValidation = (field = null) => {
      for (let vaild in vaildForm) {
        if (userForm[vaild] === "" ) {
          vaildForm[vaild] = false;
        } else {
          vaildForm[vaild] = true;
        }
    }
    setVaildForm({...vaildForm});
  };

  const addUser = (e) => {
    e.preventDefault();
    checkValidation();
    console.log(userForm);
  }

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    userForm[name] = value;
    setUserForm({...userForm});
    checkValidation();
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="user"
          subtitle="Add User"
          className="text-sm-left"
        />
      </Row>
      <Card small>
        <CardHeader className="border-bottom">
          <h6 className="m-0">Add Users</h6>
        </CardHeader>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form onSubmit={addUser}>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feEmailAddress">Name</label>
                    <FormInput
                      id="feEmailAddress"
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={userForm.name}
                      valid={vaildForm.name}
                      invalid={(vaildForm.name === false && vaildForm.name != null)}
                      onChange = {handleInput}
                    />
                    <FormFeedback > Nmae Field is required</FormFeedback>
                  </Col>
                  <Col md="6">
                    <label htmlFor="fePassword">Password</label>
                    <FormInput
                      id="fePassword"
                      type="password"
                      placeholder="Password"
                      value={userForm.password}
                      valid={vaildForm.password}
                      invalid={!vaildForm.password && vaildForm.password!=null}
                      onChange = {handleInput}
                      name="password"
                    />
                    <FormFeedback > Password Field is required</FormFeedback>
                  </Col>
                </Row>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feEmailAddress">Email</label>
                    <FormInput
                      id="feEmailAddress"
                      type="email"
                      placeholder="Email"
                      value={userForm.email}
                      valid={vaildForm.email}
                      invalid={!vaildForm.email && vaildForm.email!=null}
                      onChange = {handleInput}
                      name="email"

                    />
                     <FormFeedback > Email Field is required</FormFeedback>
                  </Col>
                  <Col md="6">
                    <label htmlFor="fePassword">Profile</label>
                    <FormInput
                      id="fePassword"
                      type="file"
                      placeholder="Password"
                      valid={vaildForm.profile}
                      invalid={!vaildForm.profile && vaildForm.profile!=null}
                      onChange = {handleInput}
                      name="profile"
                    />
                  </Col>
                  <FormFeedback > Profile Field is required</FormFeedback>
                </Row>
                <hr></hr>
                <Button
                  classes="btn btn-info text-center"
                  type="submit"
                  children="Add User"
                />
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </Card>
    </Container>
  );
};

export default AddUser;
