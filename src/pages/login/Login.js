import React, { Component } from 'react';
import { Adminlogin } from '../../Apis/apis';
import swal from 'sweetalert';
import './login.css';
import { Redirect } from 'react-router-dom';
import Button from '../../components/Button/button';
import Input from '../../components/Input/input';
import Loader from '../../components/common/Loader';
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			formErrors: { email: '', password: '' },
			loading: false,
			isLogin: false,
		};
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { password, email } = this.state;
		this.setState({ loading: true });
		if (email.length === 0 || password.length === 0) {
			swal('Error', 'Email or password is required', 'error');
			return false;
		}
		Adminlogin({ email, password })
			.then((response) => {
				let login_details = response.data.data;
				localStorage.setItem('userInfo', JSON.stringify(login_details));
				this.setState({ isLogin: true });
			})
			.catch(({ message = '' }) => {
				if (message) {
					swal('Error', message, 'error');
				}
			})
			.finally(() => {
				this.setState({ loading: false });
			});
	};
	handlePassword = (event) => {
		this.setState({ password: event.target.value });
	};

	handleEmail = (event) => {
		this.setState({ email: event.target.value });
	};

	render() {
		if (this.state.isLogin) {
			return <Redirect to='/' />;
		}
		return (
			<div className='container h-100 someback'>
				<div className='d-flex justify-content-center h-100'>
					<div className='user_card'>
						<div className='d-flex justify-content-center'>
							<div className='brand_logo_container'>
								<img
									src={require('../../logo.jpeg')}
									className='brand_logo'
									alt='Logo'
								/>
							</div>
						</div>

						<div className='d-flex justify-content-center form_container'>
							<form onSubmit={this.handleSubmit}>
								<div className='input-group mb-3'>
									<div className='input-group-append'>
										<span className='input-group-text'>
											<i className='fas fa-user'></i>
										</span>
									</div>
									<Input
										type='email'
										action={this.handleEmail}
										classes='form-control'
										name='login'
										value={this.state.email}
										placeholder='Email'
									/>
									{this.state.loading && <Loader />}
								</div>

								<div className='input-group mb-2'>
									<div className='input-group-append'>
										<span className='input-group-text'>
											<i className='fas fa-key'></i>
										</span>
									</div>
									<Input
										type='password'
										action={this.handlePassword}
										classes='fadeIn form-control input_pass'
										value={this.state.password}
										name='password'
										placeholder='password'
									/>
								</div>
							</form>
						</div>
						<div className='d-flex justify-content-center mt-3 login_container'>
							<Button
								action={this.handleSubmit}
								type='submit'
								children='Login'
								classes='btn login_btn'
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
