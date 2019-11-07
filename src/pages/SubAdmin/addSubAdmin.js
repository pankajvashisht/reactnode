import React, { useState } from 'react';
import {
  Container,
  FormFeedback,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  Card,
  CardHeader,
} from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/Button/button';
import { addAdmin } from '../../Apis/apis';
import swal from 'sweetalert';

const AddAdmin = () => {
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    profile: '',
  });
  const [disabled, setDisabled] = useState(null);
  let [vaildForm, setVaildForm] = useState({
    name: null,
    email: null,
    password: null,
    profile: null,
  });
  const checkValidation = (field = null) => {
    let validation = false;
    for (let vaild in vaildForm) {
      if (userForm[vaild] === '') {
        validation = true;
        vaildForm[vaild] = false;
      } else {
        vaildForm[vaild] = true;
      }
    }
    setVaildForm({ ...vaildForm });
    return validation;
  };

  const addadmin = (event) => {
    event.preventDefault();
    if (checkValidation()) {
      return false;
    }
    setDisabled(true);
    addAdmin(userForm)
      .then((data) => {
        setDisabled(false);
        swal('success', 'Admin Add successfully', 'success');
        reset();
      })
      .catch((err) => {
        setDisabled(false);
        const message =
          err.response.data.code === 403
            ? err.response.data.error_message
            : 'Some went wrong';
        swal('Error', message, 'error');
      });
  };

  const reset = () => {
    for (let vaild in vaildForm) {
      userForm[vaild] = '';
      vaildForm[vaild] = null;
    }
    setVaildForm({ ...vaildForm });
    setUserForm({ ...userForm });
  };

  const selectImage = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    userForm[name] = file;
    setUserForm({ ...userForm });
    checkValidation();
  };

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    userForm[name] = value;
    setUserForm({ ...userForm });
    checkValidation();
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Admin"
          subtitle="Add Admin"
          className="text-sm-left"
        />
      </Row>
      <Card small>
        <CardHeader className="border-bottom">
          <h6 className="m-0">Add Admin</h6>
        </CardHeader>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form onSubmit={addadmin}>
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
                      invalid={
                        vaildForm.name === false && vaildForm.name != null
                      }
                      onChange={handleInput}
                    />
                    <FormFeedback> Nmae Field is required</FormFeedback>
                  </Col>
                  <Col md="6">
                    <label htmlFor="fePassword">Password</label>
                    <FormInput
                      id="fePassword"
                      type="password"
                      placeholder="Password"
                      value={userForm.password}
                      valid={vaildForm.password}
                      invalid={
                        !vaildForm.password && vaildForm.password != null
                      }
                      onChange={handleInput}
                      name="password"
                    />
                    <FormFeedback> password Field is required</FormFeedback>
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
                      invalid={!vaildForm.email && vaildForm.email != null}
                      onChange={handleInput}
                      name="email"
                    />
                    <FormFeedback> Email Field is required</FormFeedback>
                  </Col>
                  <Col md="6">
                    <label htmlFor="fePassword">Profile</label>
                    <FormInput
                      id="fePassword"
                      type="file"
                      placeholder="Password"
                      valid={vaildForm.profile}
                      invalid={!vaildForm.profile && vaildForm.profile != null}
                      onChange={selectImage}
                      name="profile"
                    />
                    <FormFeedback> profile Field is required</FormFeedback>
                  </Col>
                  <FormFeedback> Profile Field is required</FormFeedback>
                </Row>
                <hr></hr>
                <Button
                  classes="btn btn-info text-center"
                  type="submit"
                  children="Add Admin"
                  disabled={disabled}
                />
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </Card>
    </Container>
  );
};

export default AddAdmin;
