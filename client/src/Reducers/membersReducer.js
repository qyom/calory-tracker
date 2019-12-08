import update from 'immutability-helper';

import { SET_MEMBERS, ADD_MEMBER } from 'Constants/actionTypes';
import moment from 'moment';

const initialState = [];

export default function mealsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_MEMBERS: {
			const { members } = action.payload;
			// console.log("data: ", data);
			return members;
		}
		case ADD_MEMBER: {
			const { member } = action.payload;
			// console.log("data: ", data);
			return [...state, member];
		}

		default:
			return state;
	}
}
