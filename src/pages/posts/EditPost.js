import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
	InputGroupAddon,
	InputGroupText,
	FormSelect,
	InputGroup,
	FormTextarea,
} from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/Button/button';
import { EditPostAPI } from '../../Apis/apis';
import swal from 'sweetalert';
import Loader from '../../components/common/Loader';
const types = ['image/*', '.epub, .mobi', 'audio/*', '.epub, .mobi'];

const EditPost = ({
	location: {
		state: { post = {} },
	},
}) => {
	console.log(post);
	const history = useHistory();
	const [userForm, setUserForm] = useState({
		form: {
			...post,
		},
		validation: {
			post_type: null,
			url: null,
			price: null,
			title: null,
			description: null,
			author_name: null,
			soical_media_name: null,
			genre: null,
			rating: null,
		},
	});
	const [disabled, setDisabled] = useState(null);
	const [fileType, setFileType] = useState('image/*');
	const checkValidation = (field = null) => {
		let validation = false;
		for (let vaild in userForm.validation) {
			if (userForm.form[vaild] === '') {
				validation = true;
				userForm.validation[vaild] = false;
			} else {
				userForm.validation[vaild] = true;
			}
		}
		setUserForm({ ...userForm });
		return validation;
	};

	const addNewPost = (event) => {
		event.preventDefault();
		if (checkValidation()) {
			return false;
		}
		setDisabled(true);
		EditPostAPI({ ...userForm.form })
			.then((data) => {
				setDisabled(false);
				history.push('/posts');
				swal('success', 'Post Edit successfully', 'success');
				reset();
			})
			.catch((err) => {
				setDisabled(false);
				swal('Error', 'Some went wrong', 'error');
			});
	};

	const reset = () => {
		for (let vaild in userForm.validation) {
			userForm.validation[vaild] = null;
			userForm.form[vaild] = '';
		}
		setUserForm({ ...userForm });
	};

	const validationRemove = (value) => {
		if (value === '1') {
			delete userForm.form.audio;
			delete userForm.form.sample_audio;
			delete userForm.validation.audio;
			delete userForm.validation.sample_audio;
		} else if (value === '2') {
			userForm.form.sample_audio = '';
			delete userForm.validation.audio;
			delete userForm.form.audio;
			userForm.validation.sample_audio = null;
		} else if (value === '3') {
			userForm.form.sample_audio = '';
			userForm.form.audio = '';
			userForm.validation.audio = null;
		}
		setUserForm({ ...userForm });
	};

	const selectImage = (e) => {
		const file = e.target.files[0];
		const name = e.target.name;
		userForm.form[name] = file;
		setUserForm({ ...userForm });
		checkValidation();
	};

	const handleInput = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		if (name === 'post_type') {
			setFileType(types[value]);
			validationRemove(value);
		}
		userForm.form[name] = value;
		setUserForm({ ...userForm });
		checkValidation();
	};
	return (
		<Container fluid className='main-content-container px-4'>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title={`Edit Post ${userForm.form.title}`}
					subtitle='Edit Post'
					className='text-sm-left'
				/>
			</Row>
			<Card small>
				<CardHeader className='border-bottom'>
					<h6 className='m-0'>Edit Post {userForm.form.title}</h6>
				</CardHeader>
				<ListGroupItem className='p-3'>
					<Row>
						<Col>
							<Form onSubmit={addNewPost}>
								<Row form>
									<Col md='6' className='form-group'>
										<label htmlFor='feEmailAddress'>Title</label>
										<FormInput
											type='text'
											placeholder='Title'
											name='name'
											value={userForm.form.title}
											valid={userForm.validation.title}
											invalid={
												userForm.validation.title === false &&
												userForm.validation.title != null
											}
											onChange={handleInput}
										/>
										<FormFeedback> Title field is required</FormFeedback>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>Price</label>
										<FormInput
											type='number'
											placeholder='Price (e.g. 1.99)'
											step='any'
											value={userForm.form.price}
											valid={userForm.validation.price}
											invalid={
												!userForm.validation.price &&
												userForm.validation.price != null
											}
											onChange={handleInput}
											name='price'
										/>
										<FormFeedback> Price field is required</FormFeedback>
									</Col>
								</Row>
								{disabled && <Loader />}
								<Row form>
									<Col md='6'>
										<label>Cover Pic</label>
										<FormInput
											type='file'
											valid={userForm.validation.cover_pic}
											accept='image/*'
											invalid={
												!userForm.validation.cover_pic &&
												userForm.validation.cover_pic != null
											}
											onChange={selectImage}
											name='cover_pic'
										/>
										<FormFeedback> Cover Pic field is required</FormFeedback>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>Author name</label>
										<FormInput
											type='text'
											placeholder='Author Name'
											value={userForm.form.author_name}
											valid={userForm.validation.author_name}
											invalid={
												!userForm.validation.author_name &&
												userForm.validation.author_name != null
											}
											onChange={handleInput}
											name='author_name'
										/>
										<FormFeedback> Author name field is required</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Row form>
									<Col md='4' className='form-group'>
										<label htmlFor='feEmailAddress'>Genre</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.validation.genre}
												invalid={
													!userForm.validation.genre &&
													userForm.validation.genre != null
												}
												onChange={handleInput}
												name='genre'
											>
												<option value=''>--Please select Genre--</option>
												<option
													selected={
														userForm.form.genre === 'Children' ? true : false
													}
													value='Children'
												>
													{' '}
													Children{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Contemporary'
															? true
															: false
													}
													value='Contemporary'
												>
													{' '}
													Contemporary{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Children' ? true : false
													}
													value='Fantasy'
												>
													{' '}
													Fantasy{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Children' ? true : false
													}
													value='Futuristic'
												>
													{' '}
													Futuristic{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Children' ? true : false
													}
													value='Historical'
												>
													{' '}
													Historical{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Children' ? true : false
													}
													value='Inspiration/Self-help'
												>
													{' '}
													Inspiration/Self-help{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Children' ? true : false
													}
													value='Paranormal'
												>
													{' '}
													Paranormal{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Romance' ? true : false
													}
													value='Romance'
												>
													{' '}
													Romance{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Science Fiction'
															? true
															: false
													}
													value='Science Fiction'
												>
													{' '}
													Science Fiction{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Speculative' ? true : false
													}
													value='Speculative'
												>
													{' '}
													Speculative{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Spirituality'
															? true
															: false
													}
													value='Spirituality'
												>
													{' '}
													Spirituality{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Urban' ? true : false
													}
													value='Urban'
												>
													{' '}
													Urban{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Western' ? true : false
													}
													value='Western'
												>
													{' '}
													Western{' '}
												</option>
												<option
													selected={
														userForm.form.genre === 'Young Adult' ? true : false
													}
													value='Young Adult'
												>
													{' '}
													Young Adult{' '}
												</option>
											</FormSelect>
											<FormFeedback> Genre field is required</FormFeedback>
										</InputGroup>
									</Col>
									<Col md='4' className='form-group'>
										<label htmlFor='feEmailAddress'>
											Please select applicable Ratings
										</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.validation.rating}
												invalid={
													!userForm.validation.rating &&
													userForm.validation.rating != null
												}
												multiple={true}
												onChange={handleInput}
												name='rating'
											>
												<option value=''>--Please select Rating--</option>
												<option
													selected={
														userForm.form.rating === 'Children' ? true : false
													}
													value='Children'
												>
													{' '}
													Children{' '}
												</option>
												<option
													selected={
														userForm.form.rating === 'Tweens (9 to 12)'
															? true
															: false
													}
													value='Tweens (9 to 12)'
												>
													{' '}
													Tweens (9 to 12){' '}
												</option>
												<option
													selected={
														userForm.form.rating === 'Teens (13 to 17)'
															? true
															: false
													}
													value='Teens (13 to 17)'
												>
													{' '}
													Teens (13 to 17){' '}
												</option>
												<option
													selected={
														userForm.form.rating === 'Adult (18 and Up)'
															? true
															: false
													}
													value='Adult (18 and Up)'
												>
													{' '}
													Adult (18 and Up){' '}
												</option>
												<option
													selected={
														userForm.form.rating === 'Clean' ? true : false
													}
													value='Clean'
												>
													{' '}
													Clean{' '}
												</option>
												<option
													selected={
														userForm.form.rating === 'Profanity' ? true : false
													}
													value='Profanity'
												>
													{' '}
													Profanity{' '}
												</option>
												<option
													selected={
														userForm.form.rating === 'Graphic Situations'
															? true
															: false
													}
													value='Graphic Situations'
												>
													{' '}
													Graphic Situations{' '}
												</option>
												<option
													selected={
														userForm.form.rating === 'Mature (Adult Content)'
															? true
															: false
													}
													value='Mature (Adult Content)'
												>
													{' '}
													Mature (Adult Content){' '}
												</option>
											</FormSelect>
											<FormFeedback> Rating field is required</FormFeedback>
										</InputGroup>
									</Col>
									<Col md='4'>
										<label htmlFor='fePassword'>Social Media Name</label>
										<FormInput
											type='text'
											placeholder='Social Media Name'
											value={userForm.form.soical_media_name}
											valid={userForm.validation.soical_media_name}
											invalid={
												!userForm.validation.soical_media_name &&
												userForm.validation.soical_media_name != null
											}
											onChange={handleInput}
											name='soical_media_name'
										/>
										<FormFeedback>
											{' '}
											Social Media Name field is required
										</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Row form>
									<Col md='6' className='form-group'>
										<label htmlFor='feEmailAddress'>Post Type</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.validation.post_type}
												invalid={
													!userForm.validation.post_type &&
													userForm.validation.post_type != null
												}
												onChange={handleInput}
												name='post_type'
											>
												<option value=''>--Please select Post type--</option>
												<option
													selected={
														userForm.form.post_type === 1 ? true : false
													}
													value='1'
												>
													{' '}
													EPub / pdf
												</option>
												<option
													selected={
														userForm.form.post_type === 3 ? true : false
													}
													value='3'
												>
													{' '}
													Audio/ PDF
												</option>
											</FormSelect>
											<FormFeedback> post Type field is required</FormFeedback>
										</InputGroup>
									</Col>
									<Col md='6'>
										<label>Select File</label>
										<FormInput
											type='file'
											placeholder='Password'
											valid={userForm.validation.url}
											accept={fileType}
											invalid={
												!userForm.validation.url &&
												userForm.validation.url != null
											}
											onChange={selectImage}
											name='url'
										/>
										<FormFeedback> File field is required</FormFeedback>
									</Col>
								</Row>
								{(userForm.form.post_type === '2' ||
									userForm.form.post_type === '3') && (
									<Row form>
										<Col md='6'>
											<label>Audio Sample</label>
											<FormInput
												type='file'
												placeholder='Password'
												valid={userForm.validation.sample_audio}
												accept='audio/*'
												invalid={
													!userForm.validation.sample_audio &&
													userForm.validation.sample_audio != null
												}
												onChange={selectImage}
												name='sample_audio'
											/>
											<FormFeedback> Sample field is required</FormFeedback>
										</Col>
										{userForm.form.post_type === '3' ? (
											<Col md='6'>
												<label>Audio File</label>
												<FormInput
													type='file'
													valid={userForm.validation.audio}
													accept='audio/*'
													invalid={
														!userForm.validation.audio &&
														userForm.validation.audio != null
													}
													onChange={selectImage}
													name='audio'
												/>
												<FormFeedback> Audio field is required</FormFeedback>
											</Col>
										) : null}
									</Row>
								)}
								<Row form>
									<Col md='12'>
										<label htmlFor='fePassword'>ISBN</label>
										<FormInput
											type='text'
											value={userForm.form.ismb}
											placeholder='ISBN'
											rows='5'
											valid={userForm.validation.description}
											onChange={handleInput}
											name='ismb'
										/>
									</Col>
								</Row>
								<hr></hr>
								<Row form>
									<Col md='12'>
										<label htmlFor='fePassword'>Synopsis</label>
										<FormTextarea
											type='file'
											placeholder='Synopsis'
											rows='5'
											valid={userForm.validation.description}
											invalid={
												!userForm.validation.description &&
												userForm.validation.description != null
											}
											value={userForm.form.description}
											onChange={handleInput}
											name='description'
										/>
										<FormFeedback> Synopsis field is required</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Button
									classes='btn btn-info text-center'
									type='submit'
									children='Update Post'
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

export default EditPost;
