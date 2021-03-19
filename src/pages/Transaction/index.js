import React, { Component } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import { Redirect, Link } from 'react-router-dom';
import { transaction, transactionBYDate } from '../../Apis/apis';
import StatusUpdate from '../../components/common/StatusUpdate';
import Input from '../../components/Input/input';
import Loader from '../../components/common/Loader';
import { CSVLink } from 'react-csv';
import swal from 'sweetalert';
class Transaction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			transaction: [],
			exportdata: [],
			searchtext: '',
			loading: true,
			toDate: '',
			formDate: new Date().toISOString(),
			name: `record-${new Date().toISOString()}.csv`,
		};
		this.csvLink = React.createRef();
	}
	addPost = () => {
		this.setState({ redirect: true });
	};

	fileType = (type) => {
		const statusCheck = () => {
			return type === 1 ? 'badge  badge-success' : 'badge badge-info';
		};
		const text = () => {
			return type === 1 ? 'Pdf' : 'Audio';
		};
		return <span className={statusCheck()}>{text()}</span>;
	};

	componentDidMount() {
		transaction()
			.then((response) => {
				const { data } = response.data;
				this.setState({ transaction: data, loading: false });
				if (data.length > 0) {
					const newExcal = [];
					data.forEach((val) => {
						const excal = {
							AuthorName: val.author_name,
							email: val.email,
							Title: val.title,
							price: val.price,
							CouponName: val.couponName || '',
							CouponDiscount: val.couponDiscount || 0,
							PostType: val.post_type === 1 ? 'EPUB' : 'AUDIO',
							Genre: val.genre,
							ISBN: val.ismb,
							purchaseDate: new Date(val.purchaseDate * 1000).toISOString(),
							'Tax Amount': val.tax_amount || '',
							'Tax State': val.tax_state || '',
							'Tax Rate': val.tax_rate || '',
							Country: val.country || '',
							'Country Rate': val.country_rate || '',
						};
						newExcal.push(excal);
					});
					this.setState({ exportdata: newExcal });
				}
			})
			.catch((err) => this.setState({ loading: false }));
	}

	search = (event) => {
		const text = event.target.value;
		this.setState({ searchtext: text, loading: true });
		transaction(1, text)
			.then((data) => {
				this.setState({ transaction: data.data.data, loading: false });
			})
			.catch((err) => this.setState({ loading: false }));
	};
	covertUnixTime = (date) => {
		return Math.round(new Date(date).getTime() / 1000, 0);
	};
	downloadFile = () => {
		const { toDate, formDate } = this.state;
		if (toDate && formDate) {
			this.setState({ loading: true });
			transactionBYDate(
				this.covertUnixTime(toDate) + 86400,
				this.covertUnixTime(formDate)
			)
				.then((response) => {
					const { data } = response.data;
					if (data.length > 0) {
						const newExcal = [];
						data.forEach((val) => {
							const excal = {
								AuthorName: val.author_name,
								Title: val.title,
								price: val.price,
								CouponName: val.couponName || '',
								CouponDiscount: val.couponDiscount || 0,
								PostType: val.post_type === 1 ? 'EPUB' : 'AUDIO',
								Genre: val.genre,
								ISBN: val.ismb,
								purchaseDate: new Date(val.purchaseDate * 1000).toISOString(),
								'Tax Amount': val.tax_amount || '',
								'Tax State': val.tax_state || '',
								'Tax Rate': val.tax_rate || '',
								Country: val.country || '',
								'Country Rate': val.country_rate || '',
							};
							newExcal.push(excal);
						});
						this.setState({ exportdata: newExcal }, () => {
							this.csvLink.current.link.click();
						});
					} else {
						swal('Info', 'No Record found', 'error');
					}
				})
				.finally(() => {
					this.setState({ loading: false });
				});
			return false;
		}
		this.csvLink.current.link.click();
	};
	handleInput = ({ target: { name, value } }) => {
		this.setState({ [name]: value });
	};

	render() {
		if (this.state.redirect) {
			return <Redirect to='add-post' />;
		}
		const { admin_role } = JSON.parse(localStorage.getItem('userInfo'));
		return (
			<Container fluid className='main-content-container px-4'>
				<CSVLink
					data={this.state.exportdata}
					filename={this.state.name}
					className='hidden'
					ref={this.csvLink}
					target='_blank'
				/>
				<Row noGutters className='page-header py-4'>
					<Card className='mb-4 mb-full'>
						<CardHeader className='border-bottom filter-date'>
							<PageTitle
								sm='4'
								title='Transaction'
								subtitle='All Transaction'
								className='text-sm-left'
							/>

							<div className='filter'>
								<div>
									<label>Form Date</label>
									<input
										name='formDate'
										max={new Date().toISOString().split('T')[0]}
										type='date'
										value={this.state.formDate}
										className='form-control'
										onChange={this.handleInput}
									/>
								</div>
								<div>
									<label>To Date</label>
									<input
										max={new Date().toISOString().split('T')[0]}
										name='toDate'
										min={this.state.formDate}
										type='date'
										value={this.state.toDate}
										className='form-control'
										onChange={this.handleInput}
									/>
								</div>
								<div>
									<button
										onClick={this.downloadFile}
										className={`btn ${
											this.state.loading ? 'btn-danger' : 'btn-info'
										} float-right`}
									>
										{this.state.loading ? 'Please wait...' : 'Export File'}
									</button>
								</div>
							</div>
						</CardHeader>
					</Card>
				</Row>

				<Row>
					<Col>
						<Card small className='mb-4'>
							<CardHeader className='border-bottom'>
								<Row>
									<Col md='4'>
										<h6 className='m-0'>Transaction</h6>
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
												Title
											</th>
											{admin_role !== 2 && (
												<th scope='col' className='border-0'>
													Username
												</th>
											)}
											<th scope='col' className='border-0'>
												Pen Number
											</th>
											<th scope='col' className='border-0'>
												File
											</th>
											<th scope='col' className='border-0'>
												File type
											</th>
											<th scope='col' className='border-0'>
												Status
											</th>
											<th scope='col' className='border-0'>
												Amount
											</th>
										</tr>
									</thead>
									<tbody>
										{this.state.loading && <Loader />}
										{this.state.transaction.map((post, key) => (
											<tr key={key}>
												<td>{key + 1}</td>
												<td>{post.title}</td>
												{admin_role !== 2 && <td>{post.username}</td>}
												<td>{''}</td>
												<td>
													<Link
														to={{
															pathname: '/post-details',
															state: {
																postDetails: post,
															},
														}}
													>
														View Details
													</Link>
												</td>
												<td>{this.fileType(post.post_type)}</td>
												<td>
													<StatusUpdate
														data={post}
														table='users_posts'
														onUpdate={(data) => {
															this.setState(
																(this.state.transaction[key] = data)
															);
														}}
													/>
												</td>
												<td>{post.amount}</td>
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

export default Transaction;
