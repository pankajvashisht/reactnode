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
	InputGroupAddon,
	InputGroupText,
	FormSelect,
	InputGroup,
} from 'shards-react';
import DatePicker from 'react-date-picker';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/Button/button';
import { addPost } from '../../Apis/apis';
import swal from 'sweetalert';
import Loader from '../../components/common/Loader';
import {
	types,
	formFields,
	errorFields,
	options,
	optionData,
} from './constants';
import Select from 'react-select';

import {
	checkAllRequiredFields,
	checkRequiredField,
} from '../../utils/validations';

const PostAdd = () => {
	const [userForm, setUserForm] = useState(formFields);
	const [errors, setErros] = useState(errorFields);
	const [disabled, setDisabled] = useState(null);
	const [fileType, setFileType] = useState('image/*');
	const checkValidation = () => {
		const errorObject = checkAllRequiredFields(errors, userForm);
		console.log(errorObject);
		setErros({ ...errors, ...errorObject });
		let checking = false;
		Object.keys(errorObject).forEach((item) => {
			if (errorObject[item]) {
				checking = true;
			}
		});
		return checking;
	};

	const addNewPost = (event) => {
		event.preventDefault();
		console.log(checkValidation());
		if (checkValidation()) {
			return false;
		}
		setDisabled(true);
		addPost({ ...userForm })
			.then(() => {
				setDisabled(false);
				swal('success', 'Post Add successfully', 'success');
				reset();
			})
			.catch((err) => {
				setDisabled(false);
				console.log(err.response);
				swal('Error', 'Some went wrong', 'error');
			});
	};

	const setSelected = (value) => {
		if (value.length > 0) setErros({ ...errors, rating: '' });
		setUserForm({ ...userForm, rating: value });
	};

	const checkError = ({ target: { name, value } }) => {
		console.log(name, value);
		setErros({ ...errors, ...checkRequiredField(name, value) });
	};

	const removeError = ({ target: { name } }) => {
		setErros({ ...errors, [name]: '' });
	};

	const reset = () => {
		setErros({ ...formFields });
		setUserForm({ ...errorFields });
	};

	const validationRemove = (value) => {
		if (value === '1') {
			delete errors.audio;
			delete errors.sample_audio;
			delete userForm.audio;
			delete userForm.sample_audio;
			errors.url = '';
		} else if (value === '2') {
			userForm.sample_audio = '';
			delete errors.audio;
			delete userForm.audio;
		} else if (value === '3') {
			delete errors.url;
			userForm.url = '';
			userForm.sample_audio = '';
			errors.audio = '';
			errors.sample_audio = '';
			userForm.audio = '';
		}
		console.log(errors);
		setErros({ ...errors });
		setUserForm({ ...userForm });
	};

	const selectImage = ({ target: { name, files } }) => {
		const file = files[0];
		if (name === 'sample_audio') {
			const fileSize = file.size / 1024 / 1024;
			if (fileSize > 2.5) {
				setErros({ ...errors, [name]: 'Audio should be less then 2.5 mb' });
			}
		}
		setUserForm({ ...userForm, [name]: file });
	};

	const handleInput = ({ target: { name, value }, target }) => {
		if (name === 'posttype') {
			setFileType(types[value]);
			validationRemove(value);
		}
		if (name === 'rsb') {
			value = target.checked ? 1 : 0;
		}
		if (name === 'lbr') {
			value = target.checked ? 1 : 0;
		}
		setUserForm({ ...userForm, [name]: value });
	};
	return (
		<Container fluid className='main-content-container px-4'>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title='Posts'
					subtitle='Add Post'
					className='text-sm-left'
				/>
			</Row>
			<Card small>
				<CardHeader className='border-bottom'>
					<h6 className='m-0'>Add Post</h6>
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
											onBlur={checkError}
											onFocus={removeError}
											value={userForm.name}
											valid={userForm.name}
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
									<Col md='3'>
										<FormInput
											type='checkbox'
											className='form-check-input'
											value={userForm.rsb}
											valid={userForm.rsb}
											onChange={handleInput}
											style={{
												width: '40%',
											}}
											name='rsb'
										/>
										<label htmlFor='fePassword'>RSB</label>
										<FormFeedback> {errors.rsb}</FormFeedback>
									</Col>
									<Col md='3'>
										<FormInput
											type='checkbox'
											className='form-check-input'
											value={userForm.lbr}
											valid={userForm.lbr}
											onChange={handleInput}
											style={{
												width: '40%',
											}}
											name='lbr'
										/>
										<label htmlFor='fePassword'>LBR</label>
										<FormFeedback> {errors.lbr}</FormFeedback>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>On Sale Price</label>
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
									<Col md='4'>
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
									<Col md='4'>
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
									<Col md='4'>
										<label htmlFor='fePassword'>Pages</label>
										<FormInput
											type='number'
											placeholder='Pages'
											min={1}
											value={userForm.pages}
											valid={userForm.pages}
											invalid={errors.pages}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='pages'
										/>
										<FormFeedback> {errors.pages}</FormFeedback>
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
												onBlur={checkError}
												onFocus={removeError}
											>
												<option value=''>--Please select Genre--</option>
												<option value='Children'> Children </option>
												<option value='Contemporary'> Contemporary </option>
												<option value='Fantasy'> Fantasy </option>
												<option value='Futuristic'> Futuristic </option>
												<option value='Historical'> Historical </option>
												<option value='Inspiration/Self-help'>
													{' '}
													Inspiration/Self-help{' '}
												</option>
												<option value='Paranormal'> Paranormal </option>
												<option value='Romance'> Romance </option>
												<option value='Science Fiction'>
													{' '}
													Science Fiction{' '}
												</option>
												<option value='Speculative'> Speculative </option>
												<option value='Spirituality'> Spirituality </option>
												<option value='Urban'> Urban </option>
												<option value='Western'> Western </option>
												<option value='Young Adult'> Young Adult </option>
											</FormSelect>
											<FormFeedback> Genre field is required</FormFeedback>
										</InputGroup>
									</Col>
									<Col>
										<label htmlFor='feEmailAddress'>Genre Type</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.fiction}
												invalid={errors.fiction}
												onChange={handleInput}
												name='fiction'
												onBlur={checkError}
												onFocus={removeError}
											>
												<option value=''>--Please select genre type --</option>
												<option value='fiction'> Fiction </option>
												<option value='nonfiction'> Nonfiction </option>
											</FormSelect>
											<FormFeedback> Fiction field is required</FormFeedback>
										</InputGroup>
									</Col>
								</Row>
								<Row>
									<Col md='6' className='form-group'>
										<label htmlFor='feEmailAddress'>
											Please select ALL applicable Ratings, press Ctrl Key OR
											Command Key & select options
										</label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<Select
												isMulti
												options={options}
												value={userForm.rating}
												onChange={setSelected}
												labelledBy={'Select'}
												valid={userForm.rating}
												invalid={errors.rating}
												className={`form-control  new-select ${
													userForm.rating ? 'is-valid' : ''
												} ${errors.rating ? 'is-invalid' : ''}`}
												name='rating'
											/>

											{errors.rating && (
												<div className='invalid-feedback'>
													Rating field is required
												</div>
											)}
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
										<label htmlFor='feEmailAddress'> EPub or Audio </label>
										<InputGroup className='mb-3'>
											<InputGroupAddon type='prepend'>
												<InputGroupText>Options</InputGroupText>
											</InputGroupAddon>
											<FormSelect
												valid={userForm.posttype}
												invalid={errors.posttype}
												onChange={handleInput}
												name='posttype'
												onBlur={checkError}
												onFocus={removeError}
											>
												<option value=''>--Please select Post type--</option>
												<option value='1'> EPub </option>
												<option value='3'> Audio </option>
											</FormSelect>
											<FormFeedback>
												{' '}
												EPub or Audio field is required
											</FormFeedback>
										</InputGroup>
									</Col>
									{userForm.posttype === '1' && (
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
									)}
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
										/>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>Released Date</label>
										<DatePicker
											onChange={(value) =>
												handleInput({
													target: { value, name: 'released_date' },
												})
											}
											onBlur={(value) =>
												checkError({ target: { name: 'released_date', value } })
											}
											onFocus={() =>
												removeError({
													target: { name: 'released_date' },
												})
											}
											value={userForm.released_date}
											className={`form-control date-picker ${
												userForm.released_date ? 'is-valid' : ''
											} ${errors.released_date ? 'is-invalid' : ''}`}
											maxDate={new Date()}
										/>
										<FormFeedback>Released Date field is required</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Row form>
									<Col md='12'>
										<label htmlFor='fePassword'>Synopsis</label>
										{/* <FormTextarea
											type='file'
											placeholder='Synopsis'
											rows='5'
											valid={userForm.description}
											invalid={errors.description}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='description'
										/> */}
										<ReactQuill
											toolbar={optionData}
											onBlur={(value) =>
												checkError({ target: { name: 'description', value } })
											}
											onFocus={() =>
												removeError({
													target: { name: 'description' },
												})
											}
											value={userForm.description}
											className={`${userForm.description ? 'is-valid' : ''} ${
												errors.description ? 'is-invalid' : ''
											}`}
											onChange={(value) =>
												handleInput({ target: { name: 'description', value } })
											}
										/>
										{errors.description && (
											<div class='invalid-feedback-error'>
												Synopsis field is required
											</div>
										)}
									</Col>
								</Row>
								<hr></hr>
								<Row form>
									<Col md='12'>
										<label htmlFor='fePassword'>Peek Inside</label>
										{/* <FormTextarea
											placeholder='Copy and Paste first six pages of Chapter One.'
											rows='5'
											valid={userForm.peek}
											invalid={errors.peek}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='peek'
										/> */}
										<ReactQuill
											toolbar={optionData}
											onBlur={(value) =>
												checkError({ target: { name: 'peek', value } })
											}
											onFocus={() =>
												removeError({
													target: { name: 'peek' },
												})
											}
											value={userForm.peek}
											className={`${userForm.peek ? 'is-valid' : ''} ${
												errors.peek ? 'is-invalid' : ''
											}`}
											onChange={(value) =>
												handleInput({ target: { name: 'peek', value } })
											}
										/>
										{errors.peek && (
											<div class='invalid-feedback-error'>
												Peek Inside field is required
											</div>
										)}
										<FormFeedback> </FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Button
									classes='btn btn-info text-center'
									type='submit'
									children='Add Post'
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

export default PostAdd;
