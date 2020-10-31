import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import PdfView from '../../components/common/PdfView';
import Audio from '../../components/common/Audio';
import Image from '../../components/common/Image';
import StarRatings from 'react-star-ratings';
import { review } from '../../Apis/apis';
import { EpubView } from 'react-reader';
const PostDetails = (props) => {
	const [postdetail] = useState({ ...props.location.state.postDetails });
	console.log(postdetail);
	const [rating, setRating] = useState([]);
	useEffect(() => {
		review(postdetail.id).then((data) => {
			const response = data.data.data;
			setRating(response);
		});
	}, [postdetail.id]);
	const dates = (dates) => {
		var date = new Date(dates * 1000);
		return (
			date.getDay() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
		);
	};
	const pdfURL = (pdf) => {
		return pdf.replace('+zip', '');
	};
	const fileType = (type) => {
		const statusCheck = () => {
			return type !== 3
				? type === 1
					? 'badge  badge-success'
					: 'badge badge-info'
				: 'badge badge-warning';
		};
		const text = () => {
			return type !== 3 ? (type === 1 ? 'Epub' : 'Audio') : 'Epub/Audio';
		};
		return <span className={statusCheck()}>{text()}</span>;
	};
	const status = (type) => {
		const statusCheck = () => {
			return type === 1 ? 'badge  badge-success' : 'badge badge-danger';
		};
		const text = () => {
			return type === 1 ? 'Active' : 'Deactive';
		};
		return <span className={statusCheck()}>{text()}</span>;
	};
	return (
		<Container
			fluid
			style={{ marginButtom: '20px' }}
			className='main-content-container px-4'
		>
			<Row noGutters className='page-header py-4'>
				<PageTitle
					sm='4'
					title='Post Details'
					subtitle='Post Details'
					className='text-sm-left'
				/>
			</Row>
			<Row>
				<Col md='12'>
					<Card>
						<CardHeader className='bg-info' style={{ color: 'white' }}>
							Post Details
						</CardHeader>
						<CardBody className='p-3'>
							<div>
								<b> Title </b> : {postdetail.title}
							</div>
							<hr></hr>
							<div>
								<b> Description </b> : {postdetail.description}
							</div>
							<div>
								<b> Author Name </b> : {postdetail.author_name}
							</div>
							<hr></hr>
							<div>
								<b> Price </b> : {postdetail.price}
							</div>
							<hr></hr>
							<div>
								<b> Post Type </b> : {fileType(postdetail.post_type)}
							</div>
							<hr></hr>
							<div>
								<b> status </b> : {status(postdetail.status)}
							</div>
							<hr></hr>
							<div>
								<b> Created </b> : {dates(postdetail.created)}
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col md='12'>
					<Card>
						<CardHeader style={{ color: 'white' }} className='bg-info'>
							Attached File
						</CardHeader>
						<CardBody>
							{postdetail.post_type !== 3 ? (
								postdetail.post_type === 1 ? (
									<EpubView
										url={pdfURL(postdetail.url)}
										title={'Alice in wonderland'}
										location={'epubcfi(/6/2[cover]!/6)'}
										locationChanged={(epubcifi) => console.log(epubcifi)}
									/>
								) : (
									// <PdfView url={pdfURL(postdetail.url)} />
									<b>
										<b>Audio</b> <Audio url={postdetail.audio} />
										<b>Audio Sample</b> <Audio url={postdetail.audio_sample} />
									</b>
								)
							) : (
								<div>
									<b>Audio</b> : <Audio url={postdetail.audio} />
									<b>Audio Sample</b> : <Audio url={postdetail.audio_sample} />
									<hr></hr>
									<PdfView url={pdfURL(postdetail.url)} />
								</div>
							)}
						</CardBody>
					</Card>
				</Col>
			</Row>
			{postdetail.cover_pic.length > 0 && (
				<Row style={{ marginTop: '10px' }}>
					<Col md='12'>
						<Card>
							<CardHeader style={{ color: 'white' }} className='bg-info'>
								Cover Picture
							</CardHeader>
							<CardBody>
								<div
									style={{
										width: '100%',
										height: '300px',
										backgroundImage: `url(${postdetail.cover_pic})`,
										backgroundSize: 'contain',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: '50% 50%',
										objectFit: 'cover',
									}}
								></div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			)}
			{postdetail.hasOwnProperty('profile') && (
				<Row style={{ marginTop: '10px' }}>
					<Col md='12'>
						<Card>
							<CardHeader style={{ color: 'white' }} className='bg-info'>
								User Information
							</CardHeader>
							<CardBody>
								<div>
									<b> Name </b> : {postdetail.name}
								</div>
								<hr></hr>
								<div>
									<b> Email </b> : {postdetail.email}
								</div>
								<hr></hr>
								<div>
									<b> Profile Pic </b> : <Image src={postdetail.image} />
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			)}
			<Row style={{ marginTop: '10px' }}>
				<Col md='12'>
					<Card>
						<CardHeader style={{ color: 'white' }} className='bg-info'>
							Reviews
						</CardHeader>
						<CardBody>
							{rating.map((data) => (
								<Card style={{ marginBottom: '10px' }}>
									<CardBody>
										<div>
											{data.comment}
											<br />
										</div>
										<StarRatings
											rating={data.rating}
											starRatedColor='blue'
											numberOfStars={5}
											starDimension='15px'
											starSpacing='5px'
											name='rating'
										/>
									</CardBody>
								</Card>
							))}
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default PostDetails;
