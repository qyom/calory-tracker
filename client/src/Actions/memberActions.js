import {
	SET_MEMBER,
	SET_MEMBERS,
	ADD_MEMBER,
	DELETE_MEMBER,
} from 'Constants/actionTypes';
import axiosApi from 'Axios/axiosApi.js';
import { normalizeMember, denormalizeMember } from 'Utils/normalizers';
import { unAuthUserLocally, setUserInState } from 'Actions';

export function fetchMembers() {
	console.log('fetching members: ');

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get('/members');

			const normalizedMembers = res.data.map(normalizeMember);
			dispatch({
				type: SET_MEMBERS,
				payload: { members: normalizedMembers },
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}

export function fetchMember({ memberId }) {
	console.log('fetching members: ');

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get(`/member/${memberId}`);
			const normalizedMember = normalizeMember(res.data);
			addMemberToState(dispatch, { member: normalizedMember });
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}

export function updateMember({ member, isUpdatingSelf } = {}) {
	console.log('updating member: ');
	// const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const { memberId } = member;
			const denormalizedMember = denormalizeMember(member);
			// const res = await axiosApi.put(`/member/${memberId}`, {
			// 	data: denormalizedMember,
			// });
			const res = await axiosApi({
				method: 'put',
				url: `/member/${memberId}`,
				data: denormalizedMember,
			});
			const normalizedMember = normalizeMember(res.data.member);

			dispatch({
				type: SET_MEMBER,
				payload: normalizedMember,
			});
			if (isUpdatingSelf) {
				setUserInState(dispatch, normalizedMember);
			}
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}

export function deleteMember({ memberId, isDeletingSelf }) {
	console.log('updating member: ');
	// const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi({
				method: 'delete',
				url: `/member/${memberId}`,
				// headers: { 'x-auth': token },
			});

			if (isDeletingSelf) {
				unAuthUserLocally(dispatch);
			} else {
				dispatch({
					type: DELETE_MEMBER,
					payload: { memberId },
				});
			}
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}
export function addMemberToState(dispatch, payload) {
	dispatch({
		type: ADD_MEMBER,
		payload,
	});
}
export function createMember(member = {}) {
	console.log('creating member: ');
	// const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const denormalizedMember = denormalizeMember(member);
			const res = await axiosApi({
				method: 'post',
				url: `/member`,
				// headers: { 'x-auth': token },
				data: denormalizedMember,
			});

			const normalizedMember = normalizeMember(res.data);
			addMemberToState(dispatch, { member: normalizedMember });
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}
