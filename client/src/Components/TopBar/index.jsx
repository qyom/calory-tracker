import React from 'react';
import CustomNavLink from 'Components/CustomNavLink';
import { ME } from 'Constants/miscConstants';

import styles from './styles.module.scss';

export default function TopBar(props) {
	return (
		<div className={styles.TopBar}>
			<div className={styles.controls}>
				<CustomNavLink to="/users" className={styles.controlsItem}>
					View All Users
				</CustomNavLink>
			</div>
			<div className={styles.controls}>
				<CustomNavLink to={`/${ME}/meals`} className={styles.controlsItem}>
					My Meals
				</CustomNavLink>
				<CustomNavLink to={`/${ME}/account`} className={styles.controlsItem}>
					My Account
				</CustomNavLink>
				<CustomNavLink to="/" className={styles.controlsItem}>
					Logout
				</CustomNavLink>
			</div>
		</div>
	);
}
