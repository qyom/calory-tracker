import React from 'react';
import { connect } from 'react-redux';
import CustomNavLink from 'Components/CustomNavLink';
import { userId } from 'Constants/miscConstants';

import styles from './styles.module.scss';

function TopBar(props) {
	const { userId } = props;
	return (
		<div className={styles.TopBar}>
			<div className={styles.controls}>
				<CustomNavLink to="/Members" className={styles.controlsItem}>
					View All Users
				</CustomNavLink>
			</div>
			<div className={styles.controls}>
				<CustomNavLink to={`/${userId}/meals`} className={styles.controlsItem}>
					My Meals
				</CustomNavLink>
				<CustomNavLink
					to={`/${userId}/account`}
					className={styles.controlsItem}
				>
					My Account
				</CustomNavLink>
				<CustomNavLink to="/" className={styles.controlsItem}>
					Logout
				</CustomNavLink>
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	const { user } = state;
	return { userId: user.memberId };
}
export default connect(mapStateToProps)(TopBar);
