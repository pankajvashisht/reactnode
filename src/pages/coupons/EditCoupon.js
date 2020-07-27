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
import { addCoupons } from '../../Apis/apis';
import Loader from '../../components/common/Loader';
import { convertTime, convertDate } from '../../utils/validations';
import swal from 'sweetalert';
const formValue = {
	start_time: '',
	end_time: '',
	discount: '',
	name: '',
	coupon_type: '',
};
const EditCoupon = ({
	location: {
		state: { coupen = {} },
	},
	history,
}) => {
	coupen.start_time = convertDate(coupen.start_time);
	coupen.end_time = convertDate(coupen.end_time);
	const [couponForm, setCouponForm] = useState({ ...coupen });
	const [disabled, setDisabled] = useState(false);
	const [vaildForm, setVaildForm] = useState(formValue);
	const checkValidation = () => {
		return Object.values(couponForm).some((item) => item.length === 0);
	};

	const checkError = ({ target: { name, value } }) => {
		if (!value)
			setVaildForm({ ...vaildForm, [name]: 'this field is requried' });
	};

	const removeError = ({ target: { name } }) => {
		setVaildForm({ ...vaildForm, [name]: '' });
	};
	const editCoupon = (event) => {
		event.preventDefault();
		if (checkValidation()) {
			return false;
		}
		setDisabled(true);
		const formData = { ...couponForm };
		formData.start_time = convertTime(formData.start_time);
		formData.end_time = convertTime(formData.end_time);
		addCoupons(formData)
			.then(() => {
				swal('success', 'Coupon Edit successfully', 'success');
				history.push('/coupons');
			})
			.catch(({ message }) => {
				swal('Error', message, 'error');
			})
			.finally(() => {
				setDisabled(false);
			});
	};
	const handleInput = ({ target: { name, value } }) => {
		setCouponForm({ ...couponForm, [name]: value });
	};

	return (
		<Container fluid className='main-content-container px-4'>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title='Coupon'
					subtitle={`Edit Coupon ${couponForm.name}`}
					className='text-sm-left'
				/>
			</Row>
			<Card small>
				<CardHeader className='border-bottom'>
					<h6 className='m-0'>Edit Coupon {couponForm.name}</h6>
				</CardHeader>
				<ListGroupItem className='p-3'>
					{disabled && <Loader />}
					<Row>
						<Col>
							<Form onSubmit={editCoupon}>
								<Row form>
									<Col md='12' className='form-group'>
										<label htmlFor='name'>Name</label>
										<FormInput
											id='name'
											type='text'
											placeholder='Coupon Name'
											value={couponForm.name}
											valid={couponForm.name}
											invalid={vaildForm.name}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='name'
										/>
										<FormFeedback> {vaildForm.name}</FormFeedback>
									</Col>
								</Row>
								<Row form>
									<Col md='6' className='form-group'>
										<label htmlFor='feEmailAddress'>State date</label>
										<FormInput
											id='feEmailAddress'
											type='date'
											placeholder='Name & Publisher'
											name='start_time'
											min={new Date().toISOString().split('T')[0]}
											value={couponForm.start_time}
											valid={couponForm.start_time}
											invalid={vaildForm.start_time}
											onBlur={checkError}
											onFocus={removeError}
											onChange={handleInput}
										/>
										<FormFeedback> {vaildForm.start_time}</FormFeedback>
									</Col>
									<Col md='6'>
										<label htmlFor='fePassword'>End Date</label>
										<FormInput
											type='date'
											min={couponForm.start_time}
											placeholder='End Date'
											value={couponForm.end_time}
											valid={couponForm.end_time}
											invalid={vaildForm.end_time}
											onBlur={checkError}
											onFocus={removeError}
											onChange={handleInput}
											name='end_time'
										/>
										<FormFeedback> {vaildForm.end_time} </FormFeedback>
									</Col>
								</Row>
								<Row form>
									<Col md='6' className='form-group'>
										<label htmlFor='discount'>Discount</label>
										<FormInput
											id='discount'
											type='number'
											step='any'
											placeholder='Discount'
											value={couponForm.discount}
											valid={couponForm.discount}
											invalid={vaildForm.discount}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='discount'
										/>
										<FormFeedback> {vaildForm.discount}</FormFeedback>
									</Col>
									<Col md='6' className='form-group'>
										<label htmlFor='discount'>Coupon Type</label>
										<FormSelect
											type='select'
											value={couponForm.coupon_type}
											valid={couponForm.coupon_type}
											invalid={vaildForm.coupon_type}
											onChange={handleInput}
											onBlur={checkError}
											onFocus={removeError}
											name='coupon_type'
										>
											<option value=''>--Please select type--</option>
											<option
												selected={couponForm.coupon_type === 'rsb'}
												value='rsb'
											>
												RSB
											</option>
											<option
												selected={couponForm.coupon_type === 'lbr'}
												value='lbr'
											>
												LBR
											</option>
										</FormSelect>
										<FormFeedback> {vaildForm.coupon_type}</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Button
									classes='btn btn-info text-center'
									type='submit'
									children='Update Coupon'
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

export default EditCoupon;
