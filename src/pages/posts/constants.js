export const formFields = {
	audio: '',
	sample_audio: '',
	posttype: '',
	url: '',
	price: '',
	name: '',
	description: '',
	cover_pic: '',
	author_name: '',
	soical_media_name: '',
	genre: '',
	ismb: '',
	rating: '',
	sale_price: '',
	fiction: '',
	released_date: '',
	rsb: 0,
	peek: '',
	lbr: 0,
	pages: '',
};

export const errorFields = {
	posttype: '',
	url: '',
	price: '',
	name: '',
	description: '',
	sample_audio: '',
	audio: '',
	cover_pic: '',
	author_name: '',
	soical_media_name: '',
	genre: '',
	rating: '',
	fiction: '',
	released_date: '',
	peek: '',
	pages: '',
};

export const errorEditFields = {
	post_type: '',
	price: '',
	title: '',
	description: '',
	author_name: '',
	soical_media_name: '',
	genre: '',
	rating: '',
	fiction: '',
	released_date: '',
	peek: '',
};

export const types = ['image/*', '.epub, .mobi', 'audio/*', '.epub, .mobi'];
export const options = [
	{ label: 'Children', value: 'Children' },
	{ label: 'Tweens (9 to 12)', value: 'Tweens (9 to 12)' },
	{ label: 'Teens (13 to 17)', value: 'Teens (13 to 17)' },
	{ label: 'Adult (18 and Up)', value: 'Adult (18 and Up)' },
	{ label: 'Clean', value: 'Clean' },
	{ label: 'Profanity', value: 'Profanity' },
	{ label: 'Graphic Situations', value: 'Graphic Situations' },
	{ label: 'Mature (Adult Content)', value: 'Mature (Adult Content)' },
];

export const optionData = [
	{ label: 'Montly', value: 1, key: 0 },
	{ label: 'Yearly', value: 2, key: 1 },
	{ label: 'Life Time', value: 3, key: 2 },
];
