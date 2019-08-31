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
  CardHeader,
  InputGroupAddon,
  InputGroupText,
  FormSelect,
  InputGroup,
  FormTextarea
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/Button/button";
import { addPost } from "../../Apis/apis";
import swal from "sweetalert";
import Loader from "../../components/common/Loader";
const types = ["image/*", "application/pdf", "audio/*", "application/pdf"];

const PostAdd = () => {
  const [userForm, setUserForm] = useState({
    form: {
      audio: "",
      sample_audio: "",
      posttype: "",
      url: "",
      price: "",
      name: "",
      description: ""
    },
    validation: {
      posttype: null,
      url: null,
      price: null,
      name: null,
      description: null,
      sample_audio: null,
      audio: null
    }
  });
  const [disabled, setDisabled] = useState(null);
  const [fileType, setFileType] = useState("image/*");
  const checkValidation = (field = null) => {
    let validation = false;
    for (let vaild in userForm.validation) {
      if (userForm.form[vaild] === "") {
        validation = true;
        userForm.validation[vaild] = false;
      } else {
        userForm.validation[vaild] = true;
      }
    }
    setUserForm({ ...userForm });
    return validation;
  };

  const addNewPost = event => {
    event.preventDefault();
    if (checkValidation()) {
      return false;
    }
    setDisabled(true);
    addPost({ ...userForm.form })
      .then(data => {
        setDisabled(false);
        swal("success", "Post Add successfully", "success");
        reset();
      })
      .catch(err => {
        setDisabled(false);
        console.log(err.response);
        swal("Error", "Some went wrong", "error");
      });
  };

  const reset = () => {
    for (let vaild in userForm.validation) {
      userForm.validation[vaild] = null;
      userForm.form[vaild] = "";
    }
    setUserForm({ ...userForm });
  };

  const validationRemove = value => {
    if (value === '1') {
      delete userForm.form.audio;
      delete userForm.form.sample_audio;
      delete userForm.validation.audio;
      delete userForm.validation.sample_audio;
    } else if (value === '2') {
      userForm.form.sample_audio = "";
      delete userForm.validation.audio;
      delete userForm.form.audio;
      userForm.validation.sample_audio = null;
    } else if (value === '3') {
      userForm.form.sample_audio = "";
      userForm.form.audio = "";
      userForm.validation.audio = null;
    }
    setUserForm({ ...userForm });
  };

  const selectImage = e => {
    const file = e.target.files[0];
    const name = e.target.name;
    userForm.form[name] = file;
    setUserForm({ ...userForm });
    checkValidation();
  };

  const handleInput = e => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "posttype") {
      setFileType(types[value]);
      validationRemove(value);
    }
    userForm.form[name] = value;
    setUserForm({ ...userForm });
    checkValidation();
  };
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Posts"
          subtitle="Add Post"
          className="text-sm-left"
        />
      </Row>
      <Card small>
        <CardHeader className="border-bottom">
          <h6 className="m-0">Add Post</h6>
        </CardHeader>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form onSubmit={addNewPost}>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feEmailAddress">Title</label>
                    <FormInput
                      type="text"
                      placeholder="Title"
                      name="name"
                      value={userForm.form.name}
                      valid={userForm.validation.name}
                      invalid={
                        userForm.validation.name === false &&
                        userForm.validation.name != null
                      }
                      onChange={handleInput}
                    />
                    <FormFeedback> Title field is required</FormFeedback>
                  </Col>
                  <Col md="6">
                    <label htmlFor="fePassword">Price</label>
                    <FormInput
                      type="number"
                      placeholder="Price"
                      value={userForm.form.price}
                      valid={userForm.validation.price}
                      invalid={
                        !userForm.validation.price &&
                        userForm.validation.price != null
                      }
                      onChange={handleInput}
                      name="price"
                    />
                    <FormFeedback> Price field is required</FormFeedback>
                  </Col>
                </Row>
                {disabled && (<Loader />)}
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feEmailAddress">Post Type</label>
                    <InputGroup className="mb-3">
                      <InputGroupAddon type="prepend">
                        <InputGroupText>Options</InputGroupText>
                      </InputGroupAddon>
                      <FormSelect
                        valid={userForm.validation.posttype}
                        invalid={
                          !userForm.validation.posttype &&
                          userForm.validation.posttype != null
                        }
                        onChange={handleInput}
                        name="posttype"
                      >
                        <option value="">--Please select Post type--</option>
                        <option value="1"> PDF </option>
                        <option value="2"> Audio </option>
                        <option value="3"> Audio & Pdf </option>
                      </FormSelect>
                      <FormFeedback> Posttype field is required</FormFeedback>
                    </InputGroup>
                  </Col>
                  <Col md="6">
                    <label>Select File</label>
                    <FormInput
                      type="file"
                      placeholder="Password"
                      valid={userForm.validation.url}
                      accept={fileType}
                      invalid={
                        !userForm.validation.url &&
                        userForm.validation.url != null
                      }
                      onChange={selectImage}
                      name="url"
                    />
                    <FormFeedback> File field is required</FormFeedback>
                  </Col>
                </Row>
                {(userForm.form.posttype === "2" ||
                  userForm.form.posttype === "3") && (
                  <Row form>
                    <Col md="6">
                      <label>Audio Sample</label>
                      <FormInput
                        type="file"
                        placeholder="Password"
                        valid={userForm.validation.sample_audio}
                        accept="audio/*"
                        invalid={
                          !userForm.validation.sample_audio &&
                          userForm.validation.sample_audio != null
                        }
                        onChange={selectImage}
                        name="sample_audio"
                      />
                      <FormFeedback> Sample field is required</FormFeedback>
                    </Col>
                    {userForm.form.posttype === "3" ? (
                      <Col md="6">
                        <label>Audio File</label>
                        <FormInput
                          type="file"
                          valid={userForm.validation.audio}
                          accept="audio/*"
                          invalid={
                            !userForm.validation.audio &&
                            userForm.validation.audio != null
                          }
                          onChange={selectImage}
                          name="audio"
                        />
                        <FormFeedback> Audio field is required</FormFeedback>
                      </Col>
                    ) : null}
                  </Row>
                )}
                <Row form>
                  <Col md="12">
                    <label htmlFor="fePassword">Description</label>
                    <FormTextarea
                      type="file"
                      placeholder="Description"
                      rows="5"
                      valid={userForm.validation.description}
                      invalid={
                        !userForm.validation.description &&
                        userForm.validation.description != null
                      }
                      onChange={handleInput}
                      name="description"
                    />
                    <FormFeedback> Description field is required</FormFeedback>
                  </Col>
                </Row>
                <hr></hr>
                <Button
                  classes="btn btn-info text-center"
                  type="submit"
                  children="Add Post"
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

export default PostAdd;
