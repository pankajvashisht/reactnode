import React from 'react';
import PropTypes from 'prop-types';
import {
	Card,
	CardHeader,
	ListGroup,
	ListGroupItem,
	Row,
	Col,
	Form,
	FormInput,
	Button,
	FormFeedback,
} from 'shards-react';

const UserAccountDetails = ({
	userDetails,
	onChange,
	onUpdate,
	selectProfile,
	checkError,
	removeError,
	vaildForm,
}) => (
	<Card small className='mb-4'>
		<CardHeader className='border-bottom'>
			<h6 className='m-0'>{userDetails.name}</h6>
		</CardHeader>
		<ListGroup flush>
			<ListGroupItem className='p-3'>
				<Row>
					<Col>
						<Form onSubmit={onUpdate}>
							<Row form>
								{/* First Name */}
								<Col md='6' className='form-group'>
									<label htmlFor='feFirstName'>Admin Name</label>
									<FormInput
										id='feFirstName'
										name='name'
										placeholder='Admin Name'
										value={userDetails.name}
										onChange={onChange}
										valid={userDetails.name}
										invalid={vaildForm.name}
										onBlur={checkError}
										onFocus={removeError}
									/>
									<FormFeedback> Name field is required</FormFeedback>
								</Col>
								{/* Last Name */}
								<Col md='6' className='form-group'>
									<label htmlFor='feLastName'>Email</label>
									<FormInput
										id='feLastName'
										name='email'
										placeholder='Email'
										value={userDetails.email}
										onChange={onChange}
										valid={userDetails.email}
										invalid={vaildForm.email}
										onBlur={checkError}
										onFocus={removeError}
									/>
									<FormFeedback> Email Field is required</FormFeedback>
								</Col>
							</Row>
							<Row form>
								{/* Email */}
								<Col md='6' className='form-group'>
									<label htmlFor='feEmail'>Profile</label>
									<FormInput
										type='file'
										onChange={selectProfile}
										name='profile'
									/>
								</Col>
								{/* Password */}
								<Col md='6' className='form-group'>
									<label htmlFor='fePassword'>Password</label>
									<FormInput
										type='password'
										id='fePassword'
										placeholder='Password'
										value={userDetails.password}
										onChange={onChange}
									/>
								</Col>
							</Row>

							<Button theme='accent' type='button'>
								Update Account
							</Button>
						</Form>
					</Col>
				</Row>
			</ListGroupItem>
		</ListGroup>
	</Card>
);

UserAccountDetails.propTypes = {
	/**
	 * The component's title.
	 */
	title: PropTypes.string,
};

UserAccountDetails.defaultProps = {
	title: 'Account Details',
};

export default UserAccountDetails;
