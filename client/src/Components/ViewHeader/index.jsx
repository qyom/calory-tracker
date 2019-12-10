import React from 'react';
import styles from './styles.module.scss';

export default function ViewHeader(props) {
	return <h1 className={styles.ViewHeader}>{props.children}</h1>;
}
