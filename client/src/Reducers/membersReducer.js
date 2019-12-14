import update from 'immutability-helper';
import {
	SET_MEMBERS,
	ADD_MEMBER,
	DELETE_MEMBER,
	SET_MEMBER,
} from 'Constants/actionTypes';

const initialState = {data:[], control:{save:{processing:false, error:{}}}};

export default function membersReducer(state = initialState, action) {
	switch (action.type) {
		case SET_MEMBERS: {
			const members = action.payload;
			return {...state, data:members};
		}
		case ADD_MEMBER.START: {
			return update(state, {control: {save: {processing: {$set: true}}}});
		}
		case ADD_MEMBER.FINISH: {
			const member = action.payload;
			return update(state, {
				data: {$push: [member]},
				control: {save: {processing: {$set: false}, error:{$set: {}}}}
			});
		}
		case ADD_MEMBER.ERROR: {
			//console.log("error payload", action.payload);
			return update(state, {control: {save: {processing: {$set: false}, error: {$set: action.payload.error}}}});
		}
		case SET_MEMBER: {
			const member = action.payload;
			const updatedMembers = state.data.map(currMember => {
				return currMember.memberId === member.memberId ? member : currMember;
			});
			return update(state, {
				data: {$set: updatedMembers}
			});
		}
		case DELETE_MEMBER: {
			const { memberId } = action.payload;
			const updatedMembers = state.data.filter(currMember => {
				return currMember.memberId !== memberId;
			});
			return update(state, {
				data: {$set: updatedMembers}
			});
		}

		default:
			return state;
	}
}
