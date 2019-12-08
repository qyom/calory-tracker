import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';

export default function MealGroup(props) {
	const { formattedDate, numberOfMeals, calories } = props;

	return (
		<div className={styles.row}>
			<div className={classnames(styles.cell, styles.date)}>
				{formattedDate}
			</div>
			<div className={classnames(styles.cell, styles.quantity)}>
				{numberOfMeals}
			</div>
			<div className={classnames(styles.cell, styles.calories)}>{calories}</div>
		</div>
	);
}

MealGroup.propTypes = {
	calories: PropTypes.number.isRequired,
	formattedDate: PropTypes.string.isRequired,
	numberOfMeals: PropTypes.number.isRequired,
};
