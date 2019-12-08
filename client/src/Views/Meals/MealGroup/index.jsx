import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import styles from './styles.module.scss';

function getMealsSummary(meals) {
	if (!meals.length) {
		return {};
	}

	const calories = meals.reduce((calories, meal) => {
		return calories + meal.calories;
	}, 0);

	const date = moment(meals[0].date).format('MM DD YYYY');

	return { calories, date, numberOfMeals: meals.length };
}

export default function MealGroup(props) {
	const { meals } = props;
	const { calories, date, numberOfMeals } = getMealsSummary(meals);
	return (
		<div className={styles.row}>
			<div className={classnames(styles.cell, styles.date)}>{date}</div>
			<div className={classnames(styles.cell, styles.quantity)}>
				{numberOfMeals}
			</div>
			<div className={classnames(styles.cell, styles.calories)}>{calories}</div>
		</div>
	);
}

MealGroup.propTypes = {
	meals: PropTypes.arrayOf(
		PropTypes.shape({
			calories: PropTypes.number.isRequired,
			date: PropTypes.object.isRequired,
		}),
	).isRequired,
};
