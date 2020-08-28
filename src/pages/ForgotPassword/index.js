import React, { useState } from 'react';
import { ForgetPasswordAPI } from '../../Apis/apis';
import swal from 'sweetalert';
import '../login/login.css';
import { Link } from 'react-router-dom';
import Input from '../../components/Input/input';
import Loader from '../../components/common/Loader';

const ForgetPassword = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const sendMail = (event) => {
		event.preventDefault();
		if (!email) {
			swal('Error', 'email is required', 'error');
			return false;
		}
		setLoading(true);
		ForgetPasswordAPI(email)
			.then(() => {
				swal('Error', 'Email sent', 'error');
			})
			.catch(({ message = '' }) => {
				if (message) {
					swal('Error', message, 'error');
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};
	return (
		<div className='container'>
			<div className='row forget-password-div'>
				{loading && <Loader />}
				<div className='col-md-4 col-md-offset-4'>
					<div className='panel panel-default'>
						<div className='panel-body'>
							<div className='text-center'>
								<h3>
									<i className='fa fa-lock fa-4x'></i>
								</h3>
								<h2 className='text-center'>Forgot Password?</h2>
								<p>You can reset your password here.</p>
								<div className='panel-body'></div>
								<form className='form' onSubmit={sendMail}>
									<div class='form-group'>
										<div class='input-group'>
											<Input
												type='email'
												action={({ target: { value } }) => setEmail(value)}
												classes='form-control'
												name='login'
												value={email}
												placeholder='Email'
											/>
										</div>
									</div>
									<div class='form-group'>
										<input
											name='recover-submit'
											class='btn  btn-danger btn-block'
											value='Reset Password'
											type='submit'
										/>
									</div>
								</form>
							</div>
							<div className='d-flex justify-content-center mt-3 login_container'>
								<Link to='/login' className='forget'>
									Login
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ForgetPassword;
