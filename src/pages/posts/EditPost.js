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
import { types, errorEditFields } from './constants';
import {
	checkAllRequiredFields,
	checkRequiredField,
	dateFormate,
	convertDate,
} from '../../utils/validations';

const EditPost = ({
	location: {
		state: { post = {} },
	},
}) => {
	const history = useHistory();
	post.released_date =
		post.released_date === 0
			? Math.round(new Date().getTime() / 1000, 0)
			: post.released_date;
	const [userForm, setUserForm] = useState({
		...post,
	});
	const [errors, setErros] = useState(errorEditFields);
	const [disabled, setDisabled] = useState(null);
	const [fileType, setFileType] = useState('image/*');
	const checkValidation = () => {
		const errorObject = checkAllRequiredFields(errorEditFields, userForm);
		setErros({ ...errors, ...errorObject });
		return !Object.values(errorObject).every((item) => !item);
	};
	const checkError = ({ target: { name, value } }) => {
		setErros({ ...errors, ...checkRequiredField(name, value) });
	};

	const removeError = ({ target: { name } }) => {
		setErros({ ...errors, [name]: '' });
	};

	const addNewPost = (event) => {
		event.preventDefault();
		if (checkValidation()) {
			return false;
		}
		setDisabled(true);
		EditPostAPI({ ...userForm })
			.then(() => {
				setDisabled(false);
				history.push('/posts');
				swal('success', 'Post Edit successfully', 'success');
			})
			.catch((err) => {
				setDisabled(false);
				swal('Error', 'Some went wrong', 'error');
			});
	};

	const validationRemove = (value) => {
		if (value === '1') {
			delete errors.audio;
			delete errors.sample_audio;
			delete userForm.audio;
			delete errors.sample_audio;
		} else if (value === '2') {
			userForm.sample_audio = '';
			delete errors.audio;
			delete userForm.audio;
		} else if (value === '3') {
			userForm.sample_audio = '';
			errors.audio = '';
			userForm.audio = '';
		}
		setErros({ ...errors });
		setUserForm({ ...userForm });
	};

	const selectImage = ({ target: { name, files } }) => {
		const file = files[0];
		if (name === 'sample_audio') {
			const fileSize = file.size / 1024 / 1024;
			if (fileSize > 2.5) {
				setErros({ ...errors, [name]: 'Audio should be less then 2.5' });
			}
		}
		setUserForm({ ...userForm, [name]: file });
	};

	const handleInput = ({ target: { name, value }, target }) => {
		if (name === 'post_type') {
			setFileType(types[value]);
			validationRemove(value);
		}
		if (name === 'rsb') {
			value = target.checked ? 1 : 0;
		}
		setUserForm({ ...userForm, [name]: value });
	};
	return (
		<Container fluid className='main-content-container px-4'>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title={`Edit Post ${userForm.title}`}
					subtitle='Edit Post'
					className='text-sm-left'
				/>
			</Row>
			<Card small>
				<CardHeader className='border-bottom'>
					<h6 className='m-0'>Edit Post {userForm.title}</h6>
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
											name='title'
											onBlur={checkError}
											onFocus={removeError}
											value={userForm.title}
											valid={userForm.title}
											invalid={errors.name}
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
											value={userForm.price}
											valid={userForm.price}
											invalid={errors.price}
											onBlur={checkError}
											onFocus={removeError}
											onChange={handleInput}
											name='price'
										/>
										<FormFeedback> {errors.price}</FormFeedback>
									</Col>
								</Row>
								<Row>
									<Col md='6'>
										<FormInput
											type='checkbox'
											className='form-check-input'
											valid={userForm.rsb}
											checked={userForm.rsb === 1 ? true : false}
											onChange={handleInput}
											style={{
												width: '40%',
											}}
											name='rsb'
										/>
										<label htmlFor='fePassword'>RSB</label>
										<FormFeedback> {errors.rsb}</FormFeedback>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>Sale Price</label>
										<FormInput
											type='number'
											placeholder='Price (e.g. 1.99)'
											step='any'
											value={userForm.sale_price}
											valid={userForm.sale_price}
											onChange={handleInput}
											name='sale_price'
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
											valid={userForm.cover_pic}
											accept='image/*'
											invalid={errors.cover_pic}
											onChange={selectImage}
											onBlur={checkError}
											onFocus={removeError}
											name='cover_pic'
										/>
										<FormFeedback> {errors.cover_pic}</FormFeedback>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>Author name</label>
										<FormInput
											type='text'
											placeholder='Author Name'
											value={userForm.author_name}
											valid={userForm.author_name}
											invalid={errors.author_name}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='author_name'
										/>
										<FormFeedback> {errors.author_name}</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Row form>
									<Col md='6' className='form-group'>
										<label htmlFor='feEmailAddress'>Genre</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.genre}
												invalid={errors.genre}
												onChange={handleInput}
												name='genre'
												value={userForm.genre}
												onBlur={checkError}
												onFocus={removeError}
											>
												<option
													selected={
														userForm.genre === 'Children' ? true : false
													}
													value='Children'
												>
													{' '}
													Children{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Contemporary' ? true : false
													}
													value='Contemporary'
												>
													{' '}
													Contemporary{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Children' ? true : false
													}
													value='Fantasy'
												>
													{' '}
													Fantasy{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Children' ? true : false
													}
													value='Futuristic'
												>
													{' '}
													Futuristic{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Children' ? true : false
													}
													value='Historical'
												>
													{' '}
													Historical{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Children' ? true : false
													}
													value='Inspiration/Self-help'
												>
													{' '}
													Inspiration/Self-help{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Children' ? true : false
													}
													value='Paranormal'
												>
													{' '}
													Paranormal{' '}
												</option>
												<option
													selected={userForm.genre === 'Romance' ? true : false}
													value='Romance'
												>
													{' '}
													Romance{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Science Fiction' ? true : false
													}
													value='Science Fiction'
												>
													{' '}
													Science Fiction{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Speculative' ? true : false
													}
													value='Speculative'
												>
													{' '}
													Speculative{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Spirituality' ? true : false
													}
													value='Spirituality'
												>
													{' '}
													Spirituality{' '}
												</option>
												<option
													selected={userForm.genre === 'Urban' ? true : false}
													value='Urban'
												>
													{' '}
													Urban{' '}
												</option>
												<option
													selected={userForm.genre === 'Western' ? true : false}
													value='Western'
												>
													{' '}
													Western{' '}
												</option>
												<option
													selected={
														userForm.genre === 'Young Adult' ? true : false
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
									<Col>
										<label htmlFor='feEmailAddress'>Fiction</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.fiction}
												invalid={errors.fiction}
												value={userForm.fiction}
												onChange={handleInput}
												name='fiction'
												onBlur={checkError}
												onFocus={removeError}
											>
												<option value=''>--Please select Fiction--</option>
												<option
													selected={
														userForm.fiction === 'fiction' ? true : false
													}
													value='fiction'
												>
													Fiction
												</option>
												<option
													selected={
														userForm.fiction === 'Nonfiction' ? true : false
													}
													value='nonfiction'
												>
													Nonfiction
												</option>
											</FormSelect>
											<FormFeedback> Fiction field is required</FormFeedback>
										</InputGroup>
									</Col>
								</Row>
								<Row>
									<Col md='6' className='form-group'>
										<label htmlFor='feEmailAddress'>
											Please select applicable Ratings
										</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.rating}
												invalid={errors.rating}
												multiple={true}
												onChange={handleInput}
												onBlur={checkError}
												onFocus={removeError}
												name='rating'
											>
												<option value=''>--Please select Rating--</option>
												<option
													selected={
														userForm.rating === 'Children' ? true : false
													}
													value='Children'
												>
													{' '}
													Children{' '}
												</option>
												<option
													selected={
														userForm.rating === 'Tweens (9 to 12)'
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
														userForm.rating === 'Teens (13 to 17)'
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
														userForm.rating === 'Adult (18 and Up)'
															? true
															: false
													}
													value='Adult (18 and Up)'
												>
													{' '}
													Adult (18 and Up){' '}
												</option>
												<option
													selected={userForm.rating === 'Clean' ? true : false}
													value='Clean'
												>
													{' '}
													Clean{' '}
												</option>
												<option
													selected={
														userForm.rating === 'Profanity' ? true : false
													}
													value='Profanity'
												>
													{' '}
													Profanity{' '}
												</option>
												<option
													selected={
														userForm.rating === 'Graphic Situations'
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
														userForm.rating === 'Mature (Adult Content)'
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
									<Col md='6'>
										<label htmlFor='fePassword'>Social Media Name</label>
										<FormInput
											type='text'
											placeholder='Social Media Name'
											value={userForm.soical_media_name}
											valid={userForm.soical_media_name}
											invalid={errors.soical_media_name}
											onBlur={checkError}
											onFocus={removeError}
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
												valid={userForm.post_type}
												invalid={errors.post_type}
												onChange={handleInput}
												name='post_type'
												onBlur={checkError}
												onFocus={removeError}
												value={userForm.post_type}
											>
												<option value=''>--Please select Post type--</option>
												<option
													selected={userForm.post_type === 1 ? true : false}
													value='1'
												>
													{' '}
													EPub / pdf
												</option>
												<option
													selected={userForm.post_type === 3 ? true : false}
													value='3'
												>
													{' '}
													Audio/ PDF
												</option>
											</FormSelect>
											<FormFeedback> Posttype field is required</FormFeedback>
										</InputGroup>
									</Col>
									<Col md='6'>
										<label>Select File</label>
										<FormInput
											type='file'
											placeholder='Password'
											valid={userForm.url}
											accept={fileType}
											invalid={errors.url}
											onBlur={checkError}
											onFocus={removeError}
											onChange={selectImage}
											name='url'
										/>
										<FormFeedback> File field is required</FormFeedback>
									</Col>
								</Row>
								{(userForm.posttype === '2' || userForm.posttype === '3') && (
									<Row form>
										<Col md='6'>
											<label>Audio Sample</label>
											<FormInput
												type='file'
												placeholder='Password'
												valid={userForm.sample_audio}
												accept='audio/*'
												invalid={errors.sample_audio}
												onChange={selectImage}
												onBlur={checkError}
												onFocus={removeError}
												name='sample_audio'
											/>
											<FormFeedback> {errors.sample_audio}</FormFeedback>
										</Col>
										{userForm.posttype === '3' ? (
											<Col md='6'>
												<label>Audio File</label>
												<FormInput
													type='file'
													valid={userForm.audio}
													accept='audio/*'
													invalid={errors.audio}
													onChange={selectImage}
													onBlur={checkError}
													onFocus={removeError}
													name='audio'
												/>
												<FormFeedback> Audio field is required</FormFeedback>
											</Col>
										) : null}
									</Row>
								)}
								<Row form>
									<Col md='6'>
										<label htmlFor='fePassword'>ISBN</label>
										<FormInput
											type='text'
											placeholder='ISBN'
											rows='5'
											valid={userForm.description}
											onChange={handleInput}
											name='ismb'
											value={userForm.ismb}
										/>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>Released Date</label>
										<FormInput
											type='date'
											placeholder='released_date'
											rows='5'
											max={dateFormate()}
											value={convertDate(userForm.released_date)}
											valid={userForm.released_date}
											invalid={errors.released_date}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='released_date'
										/>
										<FormFeedback>Released Date field is required</FormFeedback>
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
											valid={userForm.description}
											invalid={errors.description}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='description'
											value={userForm.description}
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
