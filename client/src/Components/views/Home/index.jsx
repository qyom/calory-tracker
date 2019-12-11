import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { memberPropTypes } from 'Components/views/Account';
import Spinner from 'Components/Spinner';

import styles from './styles.module.scss';

function Home(props) {
	const { user } = props;
	const isAuthenticated = !!user.data;

	if (user.isLoading) {
		return <Spinner />;
	}
	if (!isAuthenticated) {
		return <Redirect to="/login" />;
	}
	return <Redirect to={`/meals/${user.data.memberId}`} />;
}

Home.propTypes = PropTypes.shape({
	user: {
		data: memberPropTypes,
		isLoading: PropTypes.bool.isRequired,
	},
});
function mapStateToPros({ user }) {
	return { user };
}
export default connect(mapStateToPros)(Home);
