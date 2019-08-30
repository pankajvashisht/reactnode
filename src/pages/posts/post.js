import React, { Component } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Button from "../../components/Button/button";
import { Redirect } from "react-router-dom";
import { getPost } from "../../Apis/apis";
import DeleteData from "../../components/common/DeleteData";
import StatusUpdate from "../../components/common/StatusUpdate";
import Input from "../../components/Input/input";
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      posts: []
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
    getPost()
      .then(data => {
        console.log(data.data.data);
        this.setState({ posts: data.data.data });
      })
      .catch(err => console.warn(err));
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
            title="Post listing"
            subtitle="All Posts"
            className="text-sm-left"
          />
        </Row>
        <Row noGutters className="page-header py-4 pull-right">
          <Button
            classes="btn btn-info "
            children="Add Post"
            action={this.addPost}
          />
        </Row>
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">posts</h6>
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
                        Price
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.posts.map((post, key) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{post.title}</td>
                        <td>{post.price}</td>
                        <td>{post.url}</td>
                        <td>{this.fileType(post.post_type)}</td>
                        <td>
                          <StatusUpdate
                            data={post}
                            table="posts"
                            onUpdate={data => {
                              this.setState((this.state.posts[key] = data));
                            }}
                          />
                        </td>
                        <td>
                          <DeleteData
                            table="posts"
                            data={post.id}
                            classes="btn btn-danger btn-sm"
                            ondelete={() => {
                              this.setState(this.state.posts.splice(key, 1));
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

export default Post;
