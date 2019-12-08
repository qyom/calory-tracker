import update from 'immutability-helper';

import { SET_MEALS } from 'Constants/actionTypes';
import moment from 'moment';

const initialState = {};

export default function mealsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_MEALS: {
			const { meals, memberId } = action.payload;
			// console.log("data: ", data);
			return { ...state, [memberId]: meals };
		}

		default:
			return state;
	}
}
