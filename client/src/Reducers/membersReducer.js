import update from 'immutability-helper';

import {
	SET_MEMBERS,
	ADD_MEMBER,
	DELETE_MEMBER,
	SET_MEMBER,
} from 'Constants/actionTypes';
import { initialState as userInitialState } from './userReducer';

// const initialState = [userInitialState.data];
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
		case SET_MEMBER: {
			const { member } = action.payload;
			// console.log("data: ", data);
			const index = state.findIndex(
				currentMember => currentMember.memberId === member.memberId,
			);
			const newState = [...state];
			newState.splice(index, 1, member);
			return newState;
		}
		case DELETE_MEMBER: {
			const { memberId } = action.payload;
			// console.log("data: ", data);
			const index = state.findIndex(currentMember => {
				const isMatch = currentMember.memberId === memberId;
				return isMatch;
			});
			const newState = [...state];
			newState.splice(index, 1);
			return newState;
		}

		default:
			return state;
	}
}
