import React from 'react';
import styles from './styles.module.scss';

export default function SignIn(props) {
	const { children } = props;
	return <div className={styles.CustomNavLink}>{children}</div>;
}
