import React from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';

export default function MealGroup(props) {
	return (
		<li className={classnames(styles.row, styles.listHeaderRow)}>
			<ul className={styles.row}>
				<li className={classnames(styles.cell, styles.date)}>Date</li>
				<li className={classnames(styles.cell, styles.quantity)}>Meals</li>
				<li className={classnames(styles.cell, styles.calories)}>Calories</li>
			</ul>
		</li>
	);
}
