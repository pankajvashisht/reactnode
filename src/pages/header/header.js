import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import logo from '../../logo.svg';
import Dashboard from '../dashboard/dashboard';
import Users from '../users/users';
import Posts from '../posts/post';
import Login from '../login/Login';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isLogin: false, 
      redirect: false
    };
  }
  
  componentDidMount(){
    setInterval(()=> {
      this.setState({redirect:true});
    },5000);
  }
  
  render() {
    const { redirect } = this.state;
     if (redirect) {
       return <Redirect to='/login'/>;
     }
    return (
      <Router>
              
                <div>
                    <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                      <a className="navbar-brand" href="#">
                        <img src={logo} alt="logo" style={{width:'40px'}}/>
                      </a>
                      <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                          <Link className="nav-link " to="/">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-link" to="/users">Users</Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/posts">Posts</Link>              
                        </li>
                      </ul>
                      <ul className="navbar-nav my-2 my-lg-0">
                      <li className="nav-item">
                          <Link className="nav-link " to="/">Dashboard</Link>
                        </li>
                      </ul>
                    </nav>
                    <div className="container-fluid" style={{marginTop:'80px'}}>
                        <Switch>
                          <Route exact path="/" component={Dashboard} />
                          <Route path="/users" component={Users} />
                          <Route path="/posts" component={Posts} />
                          <Route path="/login" component={Login} />
                        </Switch>
                    </div>
      </div>
      </Router>
    );
  }
}

export default Header;
