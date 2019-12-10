import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { memberPropTypes } from 'Components/views/Account';
import styles from './styles.module.scss';

function Home(props) {
	const { user } = props;
	const isAuthenticated = !!user;
	if (!isAuthenticated) {
		return <Redirect to="/login" />;
	}
	return <Redirect to={`/meals/${user.memberId}`} />;
}

Home.propTypes = {
	user: memberPropTypes,
};
function mapStateToPros({ user }) {
	return { user: user.data };
}
export default connect(mapStateToPros)(Home);
