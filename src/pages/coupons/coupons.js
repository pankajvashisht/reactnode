import React, { Component } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import Button from '../../components/Button/button';
import { Link } from 'react-router-dom';
import { getCoupons } from '../../Apis/apis';
import DeleteData from '../../components/common/DeleteData';
import StatusUpdate from '../../components/common/StatusUpdate';
import Loader from '../../components/common/Loader';
import { convertDate } from '../../utils/validations';
import Input from '../../components/Input/input';
class Coupons extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			users: [],
			searchtext: '',
			loading: true,
		};
	}

	componentWillMount() {
		getCoupons()
			.then((data) => {
				this.setState({ users: data.data.data, loading: false });
			})
			.catch((err) => this.setState({ loading: false }));
	}

	addCoupon = () => {
		this.props.history.push('/add-coupon');
	};
	search = ({ target: { value } }) => {
		this.setState({ searchtext: value, loading: true });
		getCoupons(value)
			.then((data) => {
				this.setState({ users: data.data.data, loading: false });
			})
			.catch((err) => this.setState({ loading: false }));
	};
	render() {
		return (
			<Container fluid className='main-content-container px-4'>
				<Row noGutters className='page-header py-4'>
					<PageTitle
						sm='4'
						title='Coupons listing'
						subtitle='Coupons listing'
						className='text-sm-left'
					/>
				</Row>
				<Row noGutters className='page-header py-4 pull-right'>
					<Button
						classes='btn btn-info '
						children='Add Coupon'
						action={this.addCoupon}
					/>
				</Row>

				<Row>
					<Col>
						<Card small className='mb-4'>
							<CardHeader className='border-bottom'>
								<Row>
									<Col md='4'>
										<h6 className='m-0'>Coupons</h6>
									</Col>
									<Col md='4'></Col>
									<Col md='4'>
										<Input
											classes='form-control'
											name='search'
											placeholder='Search'
											action={this.search}
											value={this.state.searchtext}
										/>
									</Col>
								</Row>
							</CardHeader>
							<CardBody className='p-0 pb-3'>
								<table className='table mb-0'>
									<thead className='bg-light'>
										<tr>
											<th scope='col' className='border-0'>
												#
											</th>
											<th scope='col' className='border-0'>
												Name
											</th>
											<th scope='col' className='border-0'>
												Start Date
											</th>
											<th scope='col' className='border-0'>
												End Date
											</th>
											<th scope='col' className='border-0'>
												Discount
											</th>
											<th scope='col' className='border-0'>
												Status
											</th>
											<th scope='col' className='border-0'>
												Action
											</th>
										</tr>
									</thead>
									<tbody>
										{this.state.loading && <Loader />}
										{this.state.users.map((user, key) => (
											<tr key={key}>
												<td>{key + 1}</td>
												<td>{user.name}</td>
												<td>{convertDate(user.start_time)}</td>
												<td>{convertDate(user.end_time)}</td>
												<td>{user.discount} %</td>
												<td>
													<StatusUpdate
														key={key}
														data={user}
														table='coupons'
														onUpdate={(data) => {
															this.setState((this.state.users[key] = data));
														}}
													/>
												</td>
												<td>
													<button
														className='btn btn-info btn-sm'
														style={{ color: 'white' }}
													>
														<Link
															to={{
																pathname: '/edit-coupon',
																state: { coupen: user },
															}}
														>
															Edit
														</Link>
													</button>
													&nbsp;
													<DeleteData
														key={key}
														table='coupons'
														data={user.id}
														ondelete={() => {
															this.setState(this.state.users.splice(key, 1));
														}}
														children='Delete'
													/>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Coupons;
