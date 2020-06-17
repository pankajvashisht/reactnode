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
const Settings = () => {
	const [options, setOptions] = useState([]);
	const [seleted, setSeletced] = useState({});
	const [loading, setLoading] = useState(true);
	const [editorText, setEditorText] = useState('');
	useEffect(() => {
		getInfomations();
	}, []);
	const getInfomations = () => {
		AppInfo()
			.then(({ data }) => {
				setOptions(data.data);
				if (data.data.length > 0) {
					const selectedData = data.data[0];
					setEditorText(selectedData.value);
					setSeletced({ ...selectedData });
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
		const changeText = { ...seleted };
		changeText.value = editorText;
		updateInfo(changeText)
			.then(() => {
				const option = options;
				const index = option.findIndex((item) => changeText.id === item.id);
				option[index] = changeText;
				setOptions(option);
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
		setEditorText(texts.value);
		setSeletced({ ...texts });
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
									<FormSelect
										onChange={handleInput}
										value={seleted.title}
										name='title'
									>
										<option value=''>--Please select Type--</option>
										{options.map((value, key) => (
											<option value={value.title} key={key}>
												{value.title}
											</option>
										))}
									</FormSelect>
									<FormFeedback> Select Type Field is required</FormFeedback>
								</Col>
							</Row>
							<hr></hr>
							<Row form>
								<Col md='12'>
									<label htmlFor='fePassword'>Edit Content</label>
									<ReactQuill
										value={editorText}
										onChange={(value) => setEditorText(value)}
									/>
								</Col>
							</Row>
							<hr></hr>
							<center>
								<Button
									classes='btn btn-info text-center'
									children='Save'
									action={updateContent}
								/>
							</center>
						</Col>
					</Row>
				</ListGroupItem>
			</Card>
		</Container>
	);
};

export default Settings;
