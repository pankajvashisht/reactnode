import React, { Component } from "react";
import { Container, Row, Col, Card } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { dashBaord } from "../../Apis/apis";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  state = {
    total_users: 0,
    total_posts: 0,
    total_amount: 0,
    admin_role:1
  };
  componentWillMount() {
    let login_datails = JSON.parse(localStorage.getItem('userInfo'));
    if (login_datails.admin_role === 0) {
      this.setState({ admin_role: 0 });
    }
    dashBaord()
      .then(data => {
        let final = data.data.data;
        final = Object.values(final);
        this.setState({
          total_posts: final[0],
        });
        if (login_datails.admin_role === 1) {
           this.setState({
             total_amount: final[2],
             total_users: final[1],
           });
        }
      })
      .catch(err => console.warn(err));
  }

  style = {
    count: {
      textAlign: "center",
      paddingTop: "20px",
      color: "white",
      fontSize: "20px",
      fontFamily: "inherit"
    },
    text: {
      textAlign: "center",
      paddingBottom: "50px",
      color: "white"
    }
  };

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Dashboard"
            subtitle="dashboard"
            className="text-sm-left"
          />
        </Row>
        <Row>
          {this.state.admin_role ===1 ? (
            <Card className="col-lg mb-4">
              <Card className="bg-info" small>
                <Link to="users">
                  <div style={this.style.count}>
                    <b>Users</b>
                  </div>
                  <div style={this.style.text}>{this.state.total_users}</div>
                </Link>
              </Card>
            </Card>
          ):null}
          {!this.state.admin_role && <Col className="col-lg mb-4"></Col>}
          <Col className="col-lg mb-4">
            <Card className="bg-danger" small>
              <Link to="posts">
                <div style={this.style.count}>
                  <b>Posts</b>
                </div>
                <div style={this.style.text}>{this.state.total_posts}</div>
              </Link>
            </Card>
          </Col>
          {!this.state.admin_role && <Col className="col-lg mb-4"></Col>}
          {this.state.admin_role ===1? (
            <Col className="col-lg mb-4">
              <Card className="bg-warning" small>
                <Link to="transaction">
                  <div style={this.style.count}>
                    <b>Transaction Amount</b>
                  </div>
                  <div style={this.style.text}>{this.state.total_amount}</div>
                </Link>
              </Card>
            </Col>
          ):null}
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
