import React, { Component } from 'react';
import {Adminlogin} from '../../Apis/apis'
import swal from 'sweetalert';
import login from "./login.css"
import {  Redirect } from 'react-router-dom';
import Button from "../../components/Button/button";
import Input from "../../components/Input/input";
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
      <div class="container h-100 someback">
          <div class="d-flex justify-content-center h-100">
        <div class="user_card">
          <div class="d-flex justify-content-center">
            <div class="brand_logo_container">
              <img src="https://cdn.freebiesupply.com/logos/large/2x/pinterest-circle-logo-png-transparent.png" class="brand_logo" alt="Logo" />
            </div>
          </div>
          <div class="d-flex justify-content-center form_container">
            <form onSubmit={this.handleSubmit}>
              <div class="input-group mb-3">
                <div class="input-group-append">
                  <span class="input-group-text"><i class="fas fa-user"></i></span>
                </div>
                <Input type="email"  action={this.handleEmail} classes="form-control" name="login" value={this.state.email} placeholder="Email" />
            
              </div>
              <div class="input-group mb-2">
                <div class="input-group-append">
                  <span class="input-group-text"><i class="fas fa-key"></i></span>
                </div>
                <Input type="password"  action={this.handlePassword} classes="fadeIn form-control input_pass" value={this.state.password} name="password" placeholder="password" />
              </div>
              <div class="form-group">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="customControlInline" />
                  <label class="custom-control-label" for="customControlInline">Remember me</label>
                </div>
              </div>
            </form>
          </div>
          <div class="d-flex justify-content-center mt-3 login_container">
            <Button action={this.handleSubmit} type="submit" children="Login" classes="btn login_btn"  />
          </div>
          <div class="mt-4">
            <div class="d-flex justify-content-center links">
              Don't have an account? <a href="#" class="ml-2">Sign Up</a>
            </div>
            <div class="d-flex justify-content-center links">
              <a href="#">Forgot your password?</a>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default Login;