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
const types = ["image/*", "application/pdf, .epub, .mobi", "audio/*", "application/pdf,  .epub, .mobi"];

const PostAdd = () => {
  const [userForm, setUserForm] = useState({
    form: {
      audio: "",
      sample_audio: "",
      posttype: "",
      url: "",
      price: "",
      name: "",
      description: "",
      cover_pic: "",
      author_name:"",
      soical_media_name:"",
      genre:"",
    },
    validation: {
      posttype: null,
      url: null,
      price: null,
      name: null,
      description: null,
      sample_audio: null,
      audio: null,
      cover_pic: null,
      author_name: null,
      soical_media_name:null,
      genre:null
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
    if (value === "1") {
      delete userForm.form.audio;
      delete userForm.form.sample_audio;
      delete userForm.validation.audio;
      delete userForm.validation.sample_audio;
    } else if (value === "2") {
      userForm.form.sample_audio = "";
      delete userForm.validation.audio;
      delete userForm.form.audio;
      userForm.validation.sample_audio = null;
    } else if (value === "3") {
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
                      step="any"
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
                {disabled && <Loader />}
                <Row form>
                  <Col md="6">
                    <label>Cover Pic</label>
                    <FormInput
                      type="file"
                      valid={userForm.validation.cover_pic}
                      accept="image/*"
                      invalid={
                        !userForm.validation.cover_pic &&
                        userForm.validation.cover_pic != null
                      }
                      onChange={selectImage}
                      name="cover_pic"
                    />
                    <FormFeedback> Cover Pic field is required</FormFeedback>
                  </Col>
                  <Col md="6">
                    <label htmlFor="fePassword">Author name</label>
                    <FormInput
                      type="text"
                      placeholder="Author Name"
                      value={userForm.form.author_name}
                      valid={userForm.validation.author_name}
                      invalid={
                        !userForm.validation.author_name &&
                        userForm.validation.author_name != null
                      }
                      onChange={handleInput}
                      name="author_name"
                    />
                    <FormFeedback> Author name field is required</FormFeedback>
                  </Col>
                </Row>
                <hr></hr>
                <Row form>
                  <Col md="6" className="form-group">
                    <label htmlFor="feEmailAddress">Genre</label>
                    <InputGroup className="mb-3">
                      <InputGroupAddon type="prepend">
                        <InputGroupText>Options</InputGroupText>
                      </InputGroupAddon>
                      <FormSelect
                        valid={userForm.validation.genre}
                        invalid={
                          !userForm.validation.genre &&
                          userForm.validation.genre != null
                        }
                        onChange={handleInput}
                        name="genre"
                      >
                        <option value="">--Please select Genre--</option>
                        <option value="Children"> Children </option>
                        <option value="Fantasy"> Fantasy </option>
                        <option value="Futuristic"> Futuristic </option>
                        <option value="Historical"> Historical </option>
                        <option value="nspiration/Self-help"> nspiration/Self-help </option>
                        <option value="Paranormal"> Paranormal </option>
                        <option value="Romance"> Romance </option>
                        <option value="Science Fiction"> Science Fiction </option>
                        <option value="Speculative"> Speculative </option>
                        <option value="Spirituality"> Spirituality </option>
                        <option value="Urban"> Urban </option>
                        <option value="Western"> Western </option>
                        <option value="Young Adult"> Young Adult </option>

                      </FormSelect>
                      <FormFeedback> Genre field is required</FormFeedback>
                    </InputGroup>
                  </Col>
                  <Col md="6">
                  <label htmlFor="fePassword">Soical Media Name</label>
                    <FormInput
                      type="text"
                      placeholder="Soical Media Name"
                      value={userForm.form.soical_media_name}
                      valid={userForm.validation.soical_media_name}
                      invalid={
                        !userForm.validation.soical_media_name &&
                        userForm.validation.soical_media_name != null
                      }
                      onChange={handleInput}
                      name="soical_media_name"
                    />
                    <FormFeedback> Soical Media Name field is required</FormFeedback>
                  </Col>
                </Row>
                <hr></hr>
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
                        <option value="1"> EPub </option>
                        <option value="2"> Audio </option>
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
                    <label htmlFor="fePassword">Synopsis</label>
                    <FormTextarea
                      type="file"
                      placeholder="Synopsis"
                      rows="5"
                      valid={userForm.validation.description}
                      invalid={
                        !userForm.validation.description &&
                        userForm.validation.description != null
                      }
                      onChange={handleInput}
                      name="description"
                    />
                    <FormFeedback> Synopsis field is required</FormFeedback>
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
