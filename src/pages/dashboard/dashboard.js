import React, { Component } from "react";
import { Container, Row, Col, Card } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { dashBaord } from "../../Apis/apis";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  state = {
    total_users: 0,
    total_posts: 0,
    total_amount: 0
  };
  componentWillMount() {
    dashBaord()
      .then(data => {
        let final = data.data.data;
        final = Object.values(final);
        this.setState({
          total_amount: final[2],
          total_posts: final[0],
          total_users: final[1]
        });
      })
      .catch(err => console.warn(err));
  }

  style = {
    count: {
      textAlign: "center",
      paddingTop: "20px",
      color: "white"
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
          <Col className="col-lg mb-4">
            <Card className="bg-info" small>
              <Link to="users">
                <div style={this.style.count}>
                  <b>Users</b>
                </div>
                <div style={this.style.text}>{this.state.total_users}</div>
              </Link>
            </Card>
          </Col>
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
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
