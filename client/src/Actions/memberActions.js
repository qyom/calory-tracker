import { SET_MEMBER, SET_MEMBERS, ADD_MEMBER } from 'Constants/actionTypes';
import axiosApi from 'Axios/axiosApi.js';
import { normalizeMember, denormalizeMember } from 'Utils/normalizers';

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

export function updateMember(member = {}) {
	console.log('updating member: ');
	const token = localStorage.getItem('token');

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
				headers: { 'x-auth': token },
				data: denormalizedMember,
			});
			const normalizedMember = normalizeMember(res.data);

			dispatch({
				type: SET_MEMBER,
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
