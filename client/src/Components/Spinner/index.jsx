import React from 'react';
import styles from './styles.module.scss';
import classname from 'classnames'

export default function Spinner(props) {
	return <div className={classname(styles.Spinner, props.small ? styles.small : null )}></div>;
}
