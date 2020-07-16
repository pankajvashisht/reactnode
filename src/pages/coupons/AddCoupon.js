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
} from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/Button/button';
import { addCoupons } from '../../Apis/apis';
import Loader from '../../components/common/Loader';
import { convertTime } from '../../utils/validations';
import swal from 'sweetalert';
const formValue = {
	start_time: '',
	end_time: '',
	discount: '',
};
const AddAdmin = () => {
	const [couponForm, setCouponForm] = useState({ ...formValue });
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
	const addCoupon = (event) => {
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
				swal('success', 'Coupon Add successfully', 'success');
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
		setCouponForm({ ...formValue });
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
					subtitle='Add Coupon'
					className='text-sm-left'
				/>
			</Row>
			<Card small>
				<CardHeader className='border-bottom'>
					<h6 className='m-0'>Add Coupon</h6>
				</CardHeader>
				<ListGroupItem className='p-3'>
					{disabled && <Loader />}
					<Row>
						<Col>
							<Form onSubmit={addCoupon}>
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
									<Col md='12' className='form-group'>
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
											name='email'
										/>
										<FormFeedback> {vaildForm.discount}</FormFeedback>
									</Col>
								</Row>
								<hr></hr>
								<Button
									classes='btn btn-info text-center'
									type='submit'
									children='Add Coupon'
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
