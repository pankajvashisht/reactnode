import React, { useState, useEffect } from 'react';
import {
	Container,
	FormFeedback,
	ListGroupItem,
	Row,
	Col,
	Card,
	CardHeader,
	FormSelect,
} from 'shards-react';
import swal from 'sweetalert';
import ReactLoading from 'react-loading';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/Button/button';
import { AppInfo, updateInfo } from '../../Apis/apis';
const quillModules = {
	toolbar: [
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link', 'image'],
		['clean'],
	],
};
const Settings = () => {
	const [options, setOptions] = useState([]);
	const [seleted, setSeletced] = useState({});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		getInfomations();
	}, []);
	const getInfomations = () => {
		AppInfo()
			.then(({ data }) => {
				setOptions(data.data);
				if (data.data.length > 0) {
					setSeletced({ ...data.data[0] });
				}
			})
			.catch(({ message }) => {
				swal('Error', message, 'error');
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const updateContent = () => {
		setLoading(true);
		updateInfo(seleted)
			.then(() => {
				swal('success', 'Information updated Successfully', 'success');
			})
			.catch(({ message }) => {
				swal('Error', message, 'error');
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const handleInput = ({ target: { name, value } }) => {
		const texts = options.find((item) => item.title === value);
		setSeletced({ texts });
	};
	return (
		<Container fluid className='main-content-container px-4'>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title='Setting'
					subtitle='App Informations'
					className='text-sm-left'
				/>
			</Row>
			<Card small>
				<CardHeader className='border-bottom'>
					<h6 className='m-0'>Information</h6>
				</CardHeader>
				<ListGroupItem className='p-3'>
					{loading && (
						<center>
							<ReactLoading type='spin' color='#ffff00' />
						</center>
					)}
					<Row>
						<Col>
							<Row form>
								<Col md='12'>
									<label htmlFor='fePassword'>Select Option</label>
									<FormSelect onChange={handleInput} name='title'>
										<option value=''>--Please select Type--</option>
										{options.map((value, key) => (
											<option
												value={value.title}
												key={key}
												selected={seleted.title === value.title}
											>
												{value}
											</option>
										))}
									</FormSelect>
									<FormFeedback> Select Type Field is required</FormFeedback>
								</Col>
							</Row>
							<Row form>
								<Col md='12'>
									<label htmlFor='fePassword'>Edit Content</label>
									<ReactQuill
										toolbar={quillModules}
										value={seleted.value}
										onChange={(value) =>
											handleInput({ target: { name: 'description', value } })
										}
									/>
								</Col>
							</Row>
							<hr></hr>
							<Button
								classes='btn btn-info text-center'
								type='button'
								children='Save'
								onClick={updateContent}
							/>
						</Col>
					</Row>
				</ListGroupItem>
			</Card>
		</Container>
	);
};

export default Settings;
