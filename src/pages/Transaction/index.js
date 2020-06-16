import React, { Component } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { Redirect ,Link} from "react-router-dom";
import { transaction } from "../../Apis/apis";
import StatusUpdate from "../../components/common/StatusUpdate";
import Input from "../../components/Input/input";
import Loader from "../../components/common/Loader";
import { CSVLink } from 'react-csv'
class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      transaction: [],
      exportdata: [],
      searchtext:"",
      loading:true
    };
  }
  addPost = () => {
    this.setState({ redirect: true });
  };

  fileType = type => {
    const statusCheck = () => {
      return type === 1 ? "badge  badge-success" : "badge badge-info";
    };
    const text = () => {
      return type === 1 ? "Pdf" : "Audio";
    };
    return <span className={statusCheck()}>{text()}</span>;
  };

  componentDidMount() {
    transaction()
      .then(response => {
        const { data } = response.data;
        this.setState({ transaction: data,loading:false });
        if(data.length > 0){
          const newExcal = [];
          data.map(val => {
            const excal = {
              title:val.title,
              price:val.price,
              AuthorName:val.author_name,
              post_type:val.post_type === 1 ? 'EPUB':'AUDIO',
              Genre:val.genre,
              ISMB:val.ismb
            };
            newExcal.push(excal);
          });
          console.log(newExcal);
          this.setState({ exportdata: newExcal });
        }
      })
      .catch(err => this.setState({ loading:false}));
  }

  search = event => {
    const text = event.target.value;
    this.setState({searchtext:text,loading:true});
    transaction(1, text)
      .then(data => {
        this.setState({ transaction: data.data.data ,loading:false});
      })
      .catch(err => this.setState({ loading:false}));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="add-post" />;
    }
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Transaction"
            subtitle="All Transaction"
            className="text-sm-left"
          />
        <button className="btn btn-danger float-right" style={{margin: "10px", marginLeft: "636px"}}>
            <CSVLink data={this.state.exportdata} filename="record.csv">Export</CSVLink>
        </button>
        </Row>
       
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <Row>
                  <Col md="4">
                    <h6 className="m-0">Transaction</h6>
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
                        Title
                      </th>
                      <th scope="col" className="border-0">
                        Username
                      </th>
                      <th scope="col" className="border-0">
                        File
                      </th>
                      <th scope="col" className="border-0">
                        File type
                      </th>
                      <th scope="col" className="border-0">
                        Status
                      </th>
                      <th scope="col" className="border-0">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.loading && (<Loader />)}
                    {this.state.transaction.map((post, key) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{post.title}</td>
                        <td>{post.username}</td>
                        <td><Link
                            to={{
                              pathname: "/post-details",
                              state: {
                                postDetails: post
                              }
                            }}
                          >View Details</Link></td>
                        <td>{this.fileType(post.post_type)}</td>
                        <td>
                          <StatusUpdate
                            data={post}
                            table="users_posts"
                            onUpdate={data => {
                              this.setState((this.state.transaction[key] = data));
                            }}
                          />
                        </td>
                        <td>{post.amount}</td>
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

export default Transaction;
