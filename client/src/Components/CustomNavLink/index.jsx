import React from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export default function CustomNavLink(props) {
	const { children, className, to } = props;
	return (
		<NavLink
			activeClassName={styles.activeNavLink}
			className={classnames(styles.CustomNavLink, className)}
			exact
			to={to}
		>
			{children}
		</NavLink>
	);
}

CustomNavLink.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any.isRequired,
	to: PropTypes.string.isRequired,
};

CustomNavLink.defaultProps = {
	className: '',
};
