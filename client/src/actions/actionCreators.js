import { SET_MEALS, SET_MEMBERS, ADD_MEMBER } from 'Constants/actionTypes';
import axiosApi from 'Axios/axiosApi.js';
import { normalizeMeal, normalizeMember } from 'Utils/normalizers';

// export function getMeals(userData) {
// 	return {
// 		type: GET_MEALS,
// 		payload: { someData },
// 	};
// }

export function fetchMeals(member = {}) {
	console.log('fetching meals: ');
	const { memberId } = member;
	const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get(`/meals/${memberId}`, {
				headers: { 'x-auth': token },
			});
			const normalizedMeals = res.data.map(normalizeMeal);
			dispatch({
				type: SET_MEALS,
				payload: { meals: normalizedMeals, memberId },
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}

export function fetchMembers() {
	console.log('fetching members: ');

	const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get('/members', {
				headers: { 'x-auth': token },
			});
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

	const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get(`/member/${memberId}`, {
				headers: { 'x-auth': token },
			});
			const normalizedMember = normalizeMember(res.data);
			dispatch({
				type: ADD_MEMBER,
				payload: { member: normalizedMember },
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}
