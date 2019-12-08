import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import getMealGroupSummary from 'Utils/getMealGroupSummary';
import MealGroupDetails from './MealGroupDetails';
import MealGroupSummary from './MealGroupSummary';
import styles from './styles.module.scss';
import { mealPropsTypes } from 'Views/Meals/MealGroup/MealGroupDetails/Meal';

export default function MealGroup(props) {
	const [isDetailsVisible, setIsDetailsVisible] = useState(false);
	const handleGroupClick = useCallback(
		function toggleDetailVisibility() {
			setIsDetailsVisible(!isDetailsVisible);
		},
		[isDetailsVisible, setIsDetailsVisible],
	);
	const { meals } = props;
	const { calories, formattedDate, numberOfMeals } = getMealGroupSummary(meals);
	return (
		<div className={styles.MealGroup} onClick={handleGroupClick}>
			<MealGroupSummary
				calories={calories}
				formattedDate={formattedDate}
				numberOfMeals={numberOfMeals}
			/>
			{isDetailsVisible && <MealGroupDetails meals={meals} />}
		</div>
	);
}

MealGroup.propTypes = {
	meals: PropTypes.arrayOf(PropTypes.shape(mealPropsTypes)).isRequired,
};
