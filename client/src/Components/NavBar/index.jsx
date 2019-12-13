import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import CustomNavLink from 'Components/CustomNavLink';
import getIfAllowed, {
	OPERATION_TYPES,
	RESOURCE_TYPES,
	ROLE_TYPES,
} from 'Utils/getIfAllowed';
import styles from './styles.module.scss';
import { unAuthUser } from 'Actions';

class TopBar extends Component {
	static = {
		unAuthUser: PropTypes.func.isRequired,
	};
	handleLogoutClick = () => {
		this.props.unAuthUser();
	};
	render() {
		const { user } = this.props;
		const isAuthenticated = !!user;
		if (!isAuthenticated) {
			return (
				<div className={classnames(styles.TopBar)}>
					<div className={styles.controls}></div>
					<div className={styles.controls}>
						<CustomNavLink to="/login" className={styles.controlsItem}>
							Log In
						</CustomNavLink>
						<CustomNavLink to="/signup" className={styles.controlsItem}>
							Sign Up
						</CustomNavLink>
					</div>
				</div>
			);
		}

		const { memberId } = user;
		const isMembersViewAllowed = getIfAllowed({
			role: user.roleType,
			resource: RESOURCE_TYPES.MEMBER,
			operation: OPERATION_TYPES.READ,
		});
		return (
			<div className={styles.TopBar}>
				<div className={styles.controls}>
					{isMembersViewAllowed && (
						<CustomNavLink to="/Members" className={styles.controlsItem}>
							View All Users
						</CustomNavLink>
					)}
				</div>
				<div className={styles.controls}>
					<div className={classnames(styles.controlsItem, styles.greeting)}>
						{user.firstName}
						{user.roleType!==ROLE_TYPES.REGULAR ? ` (${user.roleType.toLowerCase()})` : null}!
					</div>
					<CustomNavLink
						to={`/meals/${memberId}`}
						className={styles.controlsItem}
					>
						My Meals
					</CustomNavLink>
					<CustomNavLink
						to={`/members/${memberId}`}
						className={styles.controlsItem}
					>
						My Account
					</CustomNavLink>
					<button
						className={classnames(
							styles.controlsItem,
							styles.controlsItemButton,
						)}
						onClick={this.handleLogoutClick}
					>
						Log Out
					</button>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { user } = state;
	return { user: user.data };
}
export default connect(mapStateToProps, { unAuthUser })(TopBar);
