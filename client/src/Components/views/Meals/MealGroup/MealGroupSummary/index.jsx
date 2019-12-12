import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';

export default function MealGroup(props) {
	const { formattedDate, numberOfMeals, calories, handleGroupClick, maxCaloriesPerDay } = props;

	const warnMode = calories > maxCaloriesPerDay;

	return (
		<ul className={styles.row} onClick={handleGroupClick}>
			<li className={classnames(styles.cell, styles.date)}>
				{formattedDate}
			</li>
			<li className={classnames(styles.cell, styles.quantity)}>
				{numberOfMeals}
			</li>
			<li className={classnames(styles.cell, styles.calories, warnMode ? styles.warnMode : styles.safeMode)}>
				{calories}
			</li>
		</ul>
	);
}

MealGroup.propTypes = {
	calories: PropTypes.number.isRequired,
	formattedDate: PropTypes.string.isRequired,
	numberOfMeals: PropTypes.number.isRequired,
};
