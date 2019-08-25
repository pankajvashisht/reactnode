import React, { Component } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody  } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/Button/button";
import { Redirect } from "react-router-dom";
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }
  addPost = () => {
    this.setState({redirect:true})    
  }
  render() {
    if(this.state.redirect){
      return <Redirect to="add-post" />
    }
    return (
      <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Post listing" subtitle="All Posts" className="text-sm-left" />
      </Row>
      <Row noGutters className="page-header py-4 pull-right">
            <Button classes="btn btn-info " children="Add Post" action={this.addPost} />
      </Row>
    <Row>
    <Col>
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Active Users</h6>
        </CardHeader>
        <CardBody className="p-0 pb-3">
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  #
                </th>
                <th scope="col" className="border-0">
                  Name
                </th>
                <th scope="col" className="border-0">
                  Email
                </th>
                <th scope="col" className="border-0">
                 Profile
                </th>
                <th scope="col" className="border-0">
                  Status
                </th>
                <th scope="col" className="border-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Ali</td>
                <td>Kerry</td>
                <td>Russian Federation</td>
                <td>Gdańsk</td>
                <td>107-0339</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Clark</td>
                <td>Angela</td>
                <td>Estonia</td>
                <td>Borghetto di Vara</td>
                <td>1-660-850-1647</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Jerry</td>
                <td>Nathan</td>
                <td>Cyprus</td>
                <td>Braunau am Inn</td>
                <td>214-4225</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Colt</td>
                <td>Angela</td>
                <td>Liberia</td>
                <td>Bad Hersfeld</td>
                <td>1-848-473-7416</td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </Col>
  </Row>
  </Container>
    );
  }
}

export default Post;