import update from 'immutability-helper';

import { SET_USER } from 'Constants/actionTypes';
import moment from 'moment';
import { normalizeMember } from 'Utils/normalizers';
// const initialState = {
// 	first_name: 'Demarcus',
// 	last_name: 'Fay',
// 	max_calories_per_day: 1470,
// 	member_id: 1,
// 	email: 'demarcus.fay@cal.com',
// };
export const initialState = normalizeMember({
	first_name: 'Maiya',
	last_name: 'Bernier',
	max_calories_per_day: 1806,
	member_id: 1,
	email: 'maiya.bernier@cal.com',
});

export default function mealsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER: {
			const { meals, memberId } = action.payload;
			// console.log("data: ", data);
			return { ...state, [memberId]: meals };
		}

		default:
			return state;
	}
}
