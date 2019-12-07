import React from 'react';
import CustomNavLink from 'Components/CustomNavLink';

import styles from './styles.module.scss';

export default function SignIn(props) {
	return (
		<div className={styles.TopBar}>
			<div className={styles.leftButtons}>
				<CustomNavLink>View All Users</CustomNavLink>
			</div>
			<div className={styles.rightButtons}>
				<CustomNavLink>My Meals</CustomNavLink>
				<CustomNavLink>My Accounts</CustomNavLink>
				<CustomNavLink>Logout</CustomNavLink>
			</div>
		</div>
	);
}
