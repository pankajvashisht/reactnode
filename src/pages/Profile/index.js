import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'shards-react';
import swal from 'sweetalert';
import UserDetails from '../../components/user-profile-lite/UserDetails';
import UserAccountDetails from '../../components/user-profile-lite/UserAccountDetails';
import PageTitle from '../../components/common/PageTitle';
import { editAdmin } from '../../Apis/apis';
import Loader from '../../components/common/Loader';
const Profile = () => {
	const [userinfo, UpdateUserInfo] = useState({});
	const [loading, setLoading] = useState(false);
	const [vaildForm, setVaildForm] = useState({
		name: '',
		email: '',
	});
	useEffect(() => {
		const login_datails = JSON.parse(localStorage.getItem('userInfo'));
		delete login_datails.password;
		UpdateUserInfo(login_datails);
	}, []);
	const updateInfo = ({ target: { name, value } }) => {
		UpdateUserInfo({ ...userinfo, [name]: value });
	};
	const selectProfile = ({ target: { files, name } }) => {
		const file = files[0];
		UpdateUserInfo({ ...userinfo, [name]: file });
	};
	const checkError = ({ target: { name, value } }) => {
		if (!value)
			setVaildForm({ ...vaildForm, [name]: 'this field is requried' });
	};
	const checkValidation = () => {
		let isVaild = false;
		Object.values(vaildForm).forEach((value) => {
			if (value.length > 0) {
				isVaild = true;
			}
		});
		return isVaild;
	};

	const removeError = ({ target: { name } }) => {
		setVaildForm({ ...vaildForm, [name]: '' });
	};
	const updateProfile = (event) => {
		event.preventDefault();
		if (checkValidation()) {
			return false;
		}
		setLoading(true);
		editAdmin(userinfo)
			.then(({ data }) => {
				localStorage.removeItem('userInfo');
				localStorage.setItem('userInfo', JSON.stringify(data.data));
				swal('success', 'Admin Edit successfully', 'success');
				window.location.reload();
			})
			.catch(({ message }) => {
				swal('Error', message, 'error');
			})
			.finally(() => {
				setLoading(false);
			});
	};
	return (
		<Container fluid className='main-content-container px-4'>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title='Admin'
					subtitle='Admin Profile'
					className='text-sm-left'
				/>
			</Row>
			<Row>
				<Col lg='4'>
					<UserDetails userDetails={{ ...userinfo }} />
				</Col>
				{loading && <Loader />}
				<Col lg='8'>
					<UserAccountDetails
						userDetails={userinfo}
						onUpdate={updateProfile}
						onChange={updateInfo}
						selectProfile={selectProfile}
						vaildForm={vaildForm}
						checkError={checkError}
						removeError={removeError}
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default Profile;
