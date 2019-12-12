import _ from 'lodash';
import update from 'immutability-helper';

import { SET_MEALS, ADD_MEAL, UPDATE_MEAL, DELETE_MEAL } from 'Constants/actionTypes';

const initialState = {data:[], control:{add:{processing:false, error:{}}}};

export default function mealsReducer(state = initialState, action) {
	switch (action.type) {
		  
		case SET_MEALS: {
			// todo -update url
			const { meals, memberId } = action.payload;
			return update(state, {data: {[memberId]: {$set: meals}}});
		}
		case ADD_MEAL.START: {
			return update(state, {control: {add: {processing: {$set: true}}}});
		}
		case ADD_MEAL.FINISH: {
			const { meal } = action.payload;
			// const memberMeals = state[meal.memberId] || [];
			return update(state, {
				data: {[meal.memberId]: {$push: [meal]}},
				control: {add: {processing: {$set: false}, error:{$set: {}}}}
			});
		}
		case ADD_MEAL.ERROR: {
			console.log("error payload", action.payload);
			return update(state, {control: {add: {processing: {$set: false}, error: {$set: action.payload.error.data}}}});
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
