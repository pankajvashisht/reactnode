import React, { Component } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle"

class Dashboard extends Component {
  render() {
    return (
      <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Dashboard" subtitle="dashboard" className="text-sm-left" />
    </Row>
    <Row>
      
        <Col className="col-lg mb-4" >
        <Card small>
          user
        </Card>
        </Col>
        <Col className="col-lg mb-4" >
        <Card small>
          Post
        </Card>
        </Col>
        <Col className="col-lg mb-4" >
        <Card small>
          Payments
        </Card>
        </Col>
        
      
    </Row>

    {/* Default Light Table */}
    

    {/* Default Dark Table */}
   
  </Container>
    );
  }
}

export default Dashboard;