import update from 'immutability-helper';

import { SET_MEALS, UPDATE_MEAL, DELETE_MEAL } from 'Constants/actionTypes';
import moment from 'moment';

const initialState = {};

export default function mealsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_MEALS: {
			// todo -update url
			const { meals, memberId } = action.payload;
			return { ...state, [memberId]: meals };
		}
		case UPDATE_MEAL: {
			const { meal } = action.payload;
			const { memberId } = meal;
			const memberMeals = state[memberId];

			const updatedMemberMeals = memberMeals.map(currMeal => {
				return currMeal.mealId === meal.mealId ? meal : currMeal;
			});
			console.log('updatedMemberMeals: ', updatedMemberMeals);
			return { ...state, [memberId]: updatedMemberMeals };
		}
		case DELETE_MEAL: {
			const { mealId, memberId } = action.payload;
			const memberMeals = state[memberId];

			const updatedMemberMeals = memberMeals.filter(currMeal => {
				return currMeal.mealId !== mealId;
			});
			return { ...state, [memberId]: updatedMemberMeals };
		}

		default:
			return state;
	}
}
