import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getMealGroupSummary from 'Utils/getMealGroupSummary';
import MealGroupDetails from './MealGroupDetails';
import MealGroupSummary from './MealGroupSummary';
import styles from './styles.module.scss';
import { mealPropTypes } from 'Components/views/Meals/MealGroup/MealGroupDetails/Meal';

export default class MealGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDetailsVisible: false,
		};
		this.handleGroupClick = this.handleGroupClick.bind(this);
	}

	handleGroupClick() {
		const isDetailsVisible = !this.state.isDetailsVisible;
		this.setState({ isDetailsVisible });
	}

	render() {
		const { meals, maxCaloriesPerDay } = this.props;
		const { calories, formattedDate, numberOfMeals } = getMealGroupSummary(
			meals,
		);
		const { isDetailsVisible } = this.state;
		return (
			<li className={styles.MealGroup}>
				<MealGroupSummary
					calories={calories}
					formattedDate={formattedDate}
					numberOfMeals={numberOfMeals}
					handleGroupClick={this.handleGroupClick}
					maxCaloriesPerDay={maxCaloriesPerDay}
				/>
				{isDetailsVisible && <MealGroupDetails meals={meals} />}
			</li>
		);
	}
}

MealGroup.propTypes = {
	meals: PropTypes.arrayOf(mealPropTypes).isRequired,
};
