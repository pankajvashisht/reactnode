import React, { Component } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/Button/button";
import { Redirect } from "react-router-dom";
import { getUser } from "../../Apis/apis";
import DeleteData from "../../components/common/DeleteData";
import StatusUpdate from "../../components/common/StatusUpdate";
import Image from "../../components/common/Image";
import Input from "../../components/Input/input";
import Loader from "../../components/common/Loader";
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      users: [],
      searchtext:'',
      loading:true
    };
  }

  componentWillMount() {
    getUser()
      .then(data => {
        console.log(data.data.data);
        this.setState({ users: data.data.data,loading:false });
      })
      .catch(err => this.setState({ oading:false }));
  }
  
  addUser = () => {
    this.setState({ redirect: true });
  };
  search = event => {
    const text = event.target.value
    this.setState({searchtext:text,loading:true})
    getUser(1, text)
      .then(data => {
        console.log(data.data.data);
        this.setState({ users: data.data.data,loading:false });
      })
      .catch(err => this.setState({ oading:false }));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="add-user" />;
    }
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Users listing"
            subtitle="Rigister Users"
            className="text-sm-left"
          />
        </Row>
        <Row noGutters className="page-header py-4 pull-right">
          <Button
            classes="btn btn-info "
            children="Add User"
            action={this.addUser}
          />
        </Row>

        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
              <Row>
                  <Col md="4">
                    <h6 className="m-0">Active User</h6>
                  </Col>
                  <Col md="4"></Col>
                  <Col md="4">
                    <Input
                      classes="form-control"
                      name="search"
                      placeholder="Search"
                      action={this.search}
                      value={this.state.searchtext}
                    />
                  </Col>
                </Row>
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
                  {this.state.loading && (<Loader />)}
                    {this.state.users.map((user, key) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Image key={key} src={user.profile} />
                        </td>
                        <td>
                          <StatusUpdate
                            key={key}
                            data={user}
                            table="users"
                            onUpdate={data => {
                              this.setState(this.state.users[key] = data);
                            }}
                          />
                        </td>
                        <td>
                          <DeleteData
                            key={key}
                            table="users"
                            data={user.id}
                            ondelete={() => {
                              this.setState(this.state.users.splice(key, 1));
                            }}
                            children="Delete"
                          />
                        </td>
                      </tr>
                    ))}
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

export default User;
