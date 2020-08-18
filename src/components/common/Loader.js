import React from 'react';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
const style = {
	left: '50%',
	height: '300px',
	width: '300px',
	position: 'fixed',
	zIndex: 999,
};
const Loader = () => (
	<div style={style}>
		<ReactLoading type='spin' color='#ffff00' />
	</div>
);
Loader.propTypes = {
	src: PropTypes.string.isRequired,
};

Loader.defaultProps = {
	circle: null,
	classes: '',
	alt: 'image',
	height: '50',
	width: '50',
};

export default Loader;
