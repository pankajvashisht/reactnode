import React, { Component } from 'react';
import Logincss from './login.css'
import {Adminlogin} from '../../Apis/apis'
import swal from 'sweetalert';
import {  Redirect } from 'react-router-dom';

class Login extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formErrors: {email: '', password: ''},
      isLogin:false
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const { password, email } = this.state;
    if(email.length === 0 || password.length === 0){
      swal("Error", "Email or password is required", "error");
      return false;
    }
    Adminlogin({email, password})
      .then(response => { 
         let login_details = response.data.data;
          localStorage.setItem('userInfo', JSON.stringify(login_details));
          this.setState({ isLogin: true } )
      })
      .catch(error => {
          if(error.response){
            swal("Error", error.response.data.error_message, "error");
          }
          
      });
  };
   handlePassword = event => {
    this.setState({password:event.target.value});
  }

  handleEmail = event => {
    this.setState({email:event.target.value});
  }

  render() {
    if (this.state.isLogin) {
      return <Redirect to="/" />
    }
    return (
        <div className="wrapper fadeInDown">
        <div id="formContent">
        
          <div className="fadeIn first">
            <h3> Login as Admin </h3>
          </div>
          <form  onSubmit={this.handleSubmit}>
            <input type="email" id="login" onChange={this.handleEmail} className="fadeIn second" name="login" value={this.state.email} placeholder="Email" />
            <input type="password" id="password" onChange={this.handlePassword} className="fadeIn third" value={this.state.password} name="login" placeholder="password" />
            <input type="submit" className="fadeIn fourth" value="Log In" />
          </form>
      
          <div id="formFooter">
            <a className="underlineHover" href="#">Forgot Password?</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;