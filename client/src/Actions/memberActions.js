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
				payload: normalizedMembers,
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
		}
	};
}

export function fetchMember({ memberId }) {
	console.log('fetching one member: ', memberId);
	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get(`/member/${memberId}`);
			const normalizedMember = normalizeMember(res.data);
			addMemberToState(dispatch, normalizedMember);
		} catch (err) {
			console.log('problem while fetching data: ', err);
		}
	};
}

export function updateMember({ member, isUpdatingSelf } = {}) {
	console.log('updating member: ');

	return async function _dispatcher_(dispatch) {
		try {
			const { memberId } = member;
			const denormalizedMember = denormalizeMember(member);
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
		}
	};
}

export function deleteMember({ memberId, isDeletingSelf }) {
	return async function _dispatcher_(dispatch) {
		try {
			await axiosApi({
				method: 'delete',
				url: `/member/${memberId}`,
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
	return async function _dispatcher_(dispatch) {
		try {
			const denormalizedMember = denormalizeMember(member);
			const res = await axiosApi({
				method: 'post',
				url: `/member`,
				data: denormalizedMember,
			});

			const normalizedMember = normalizeMember(res.data);
			addMemberToState(dispatch, normalizedMember);
		} catch (err) {
			console.log('problem while fetching data: ', err);
		}
	};
}
