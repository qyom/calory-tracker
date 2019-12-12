import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { memberPropTypes } from 'Components/views/Account';
import Spinner from 'Components/Spinner';

function Home(props) {
	const { user } = props;
	const isAuthenticated = !!user.data;
	const { fromLocation } = props.location.state || {};
	if (user.isLoading) {
		return <Spinner />;
	}
	if (!isAuthenticated) {
		return <Redirect to="/login" />;
	}
	return <Redirect to={fromLocation || `/meals/${user.data.memberId}`} />;
}

Home.propTypes = {
	user: PropTypes.shape({
		data: memberPropTypes,
		isLoading: PropTypes.bool.isRequired,
	}),
	location: PropTypes.shape({
		state: PropTypes.shape({
			fromLocation: PropTypes.object,
		}),
	}).isRequired,
};
function mapStateToPros({ user }) {
	return { user };
}
export default connect(mapStateToPros)(Home);
