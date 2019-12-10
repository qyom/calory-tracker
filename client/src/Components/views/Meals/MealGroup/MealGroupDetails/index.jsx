import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import Meal, { mealPropTypes } from './Meal';

export default function MealGroupDetails(props) {
	const { meals } = props;
	return (
		<div className={styles.MealGroupDetails}>
			{meals.map(meal => (
				<Meal {...meal} key={meal.mealId} />
			))}
		</div>
	);
}

MealGroupDetails.propTypes = {
	meals: PropTypes.arrayOf(mealPropTypes).isRequired,
};
