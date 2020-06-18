import React, { useState } from 'react';
import {
	Container,
	FormFeedback,
	ListGroupItem,
	Row,
	Col,
	Form,
	FormInput,
	Card,
	CardHeader,
	FormSelect,
} from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/Button/button';
import { addAdmin } from '../../Apis/apis';
import { getLoginInfo } from '../../utils/store';
import swal from 'sweetalert';
const formValue = {
	name: '',
	email: '',
	password: '',
	profile: '',
	admin_type: '',
};
const AddAdmin = () => {
	const [userForm, setUserForm] = useState(formValue);
	const [disabled, setDisabled] = useState(false);
	let [vaildForm, setVaildForm] = useState(formValue);
	const checkValidation = () => {
		return Object.values(userForm).some((item) => item.length === 0);
	};

	const checkError = ({ target: { name, value } }) => {
		if (!value)
			setVaildForm({ ...vaildForm, [name]: 'this field is requried' });
	};

	const removeError = ({ target: { name } }) => {
		setVaildForm({ ...vaildForm, [name]: '' });
	};
	const addadmin = (event) => {
		event.preventDefault();
		if (checkValidation()) {
			return false;
		}
		setDisabled(true);
		addAdmin(userForm)
			.then(() => {
				swal('success', 'Admin Add successfully', 'success');
				reset();
			})
			.catch(({ message }) => {
				swal('Error', message, 'error');
			})
			.finally(() => {
				setDisabled(false);
			});
	};

	const reset = () => {
		setVaildForm({ ...formValue });
		setUserForm({ ...formValue });
	};

	const selectImage = (e) => {
		const file = e.target.files[0];
		const name = e.target.name;
		userForm[name] = file;
		setUserForm({ ...userForm });
	};

	const handleInput = ({ target: { name, value } }) => {
		setUserForm({ ...userForm, [name]: value });
	};

	return (
		<Container fluid className='main-content-container px-4'>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title='Admin'
					subtitle='Add Admin'
					className='text-sm-left'
				/>
			</Row>
			<Card small>
				<CardHeader className='border-bottom'>
					<h6 className='m-0'>Add Admin</h6>
				</CardHeader>
				<ListGroupItem className='p-3'>
					<Row>
						<Col>
							<Form onSubmit={addadmin}>
								<Row form>
									<Col md='6' className='form-group'>
										<label htmlFor='feEmailAddress'>Name</label>
										<FormInput
											id='feEmailAddress'
											type='text'
											placeholder='Name'
											name='name'
											value={userForm.name}
											valid={userForm.name}
											invalid={vaildForm.name}
											onBlur={checkError}
											onFocus={removeError}
											onChange={handleInput}
										/>
										<FormFeedback> Nmae Field is required</FormFeedback>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>Password</label>
										<FormInput
											id='fePassword'
											type='password'
											placeholder='Password'
											value={userForm.password}
											valid={userForm.password}
											invalid={vaildForm.password}
											onBlur={checkError}
											onFocus={removeError}
											onChange={handleInput}
											name='password'
										/>
										<FormFeedback> password Field is required</FormFeedback>
									</Col>
								</Row>
								<Row form>
									<Col md='4' className='form-group'>
										<label htmlFor='feEmailAddress'>Email</label>
										<FormInput
											id='feEmailAddress'
											type='email'
											placeholder='Email'
											value={userForm.email}
											valid={userForm.email}
											invalid={vaildForm.email}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='email'
										/>
										<FormFeedback> Email Field is required</FormFeedback>
									</Col>
									<Col md='4'>
										<label htmlFor='fePassword'>Profile</label>
										<FormInput
											id='fePassword'
											type='file'
											placeholder='Password'
											valid={userForm.profile}
											invalid={vaildForm.profile}
											onChange={selectImage}
											onBlur={checkError}
											onFocus={removeError}
											name='profile'
										/>
										<FormFeedback> profile Field is required</FormFeedback>
									</Col>
									<Col md='4'>
										<label htmlFor='fePassword'>Admin Type</label>
										<FormSelect
											valid={userForm.admin_type}
											invalid={vaildForm.admin_type}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											disabled={getLoginInfo().admin_role}
											name='admin_type'
										>
											<option value=''>--Please select Admin Type--</option>
											<option value='1'> Second Level Admin </option>
											<option
												selected={
													getLoginInfo().admin_role === 1 ? true : false
												}
												value='2'
											>
												{' '}
												Third Level Admin{' '}
											</option>
										</FormSelect>
										<FormFeedback> Admin Type Field is required</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Button
									classes='btn btn-info text-center'
									type='submit'
									children='Add Admin'
									disabled={disabled}
								/>
							</Form>
						</Col>
					</Row>
				</ListGroupItem>
			</Card>
		</Container>
	);
};

export default AddAdmin;
