import React from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';

export default function MealGroup(props) {
	return (
		<div className={styles.row}>
			<div className={classnames(styles.cell, styles.date)}>Date</div>
			<div className={classnames(styles.cell, styles.quantity)}>Meals</div>
			<div className={classnames(styles.cell, styles.calories)}>Calories</div>
		</div>
	);
}
