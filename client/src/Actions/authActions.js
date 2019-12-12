import axiosApi, { axiosApiPure } from 'Axios/axiosApi.js';
import {
	AUTH_USER,
	UNAUTH_USER,
	CREATE_USER,
} from 'Constants/actionTypes';
import { normalizeMember, denormalizeMember } from 'Utils/normalizers';
import { addMemberToState } from 'Actions';

export function authUser({ email, password }) {
	// console.log("authUser");
	return async function _dispatcher_(dispatch) {
		try {
			dispatch({ type: AUTH_USER.START });
			const res = await axiosApi({
				method: 'post',
				url: '/auth',
				data: { email, password },
			});

			localStorage.setItem('jwt', res.data.token);
			const normalizedMember = normalizeMember(res.data.member);

			setUser(dispatch, normalizedMember);
		} catch (err) {
			console.log(err);
			dispatch({ type: AUTH_USER.ERROR, payload: err });
		}
	};
}

export function fetchUser() {
	// console.log("authUser");
	return async function _dispatcher_(dispatch) {
		try {
			dispatch({ type: AUTH_USER.START });
			const res = await axiosApi.get('/auth');

			const normalizedMember = normalizeMember(res.data);

			setUser(dispatch, normalizedMember);
		} catch (err) {
			console.log(err);
			dispatch({ type: AUTH_USER.ERROR, payload: err });
		}
	};
}

export function createUser(member = {}) {
	// console.log('creatUser');
	return async function _dispatcher_(dispatch) {
		try {
			dispatch({ type: CREATE_USER.START });
			const denormalizedMember = denormalizeMember(member);
			const res = await axiosApi({
				method: 'post',
				url: `/member`,
				data: denormalizedMember,
			});

			localStorage.setItem('jwt', res.data.token);
			const normalizedMember = normalizeMember(res.data.member);

			setUser(dispatch, normalizedMember);
		} catch (err) {
			// console.log(err);
			dispatch({ type: CREATE_USER.ERROR, payload: err });
		}
	};
}

export function setUserInState(dispatch, payload) {
	dispatch({
		type: AUTH_USER.FINISH,
		payload,
	});
}
function setUser(dispatch, member) {
	addMemberToState(dispatch, member);
	setUserInState(dispatch, member);
}

// function signoutUser(dispatch) {
//     dispatch({ type: UNAUTH_USER });
//     localStorage.removeItem('token');
// }
export function unAuthUserLocally(dispatch) {
	localStorage.removeItem('jwt');
	dispatch({
		type: UNAUTH_USER.FINISH,
	});
}
export function unAuthUser() {
	return async function _dispatcher_(dispatch) {
		dispatch({ type: UNAUTH_USER.START });
		// axios interceptor is too late if there is a preflight
		const jwt = localStorage.getItem('jwt');
		try {
			axiosApiPure({
				method: 'delete',
				url: '/auth',
				headers: { Authorization: `Bearer ${jwt}` },
			});
			unAuthUserLocally(dispatch);
			// // signoutUser(dispatch);
		} catch (err) {
			console.log('error deleting token', err);
			dispatch({ type: UNAUTH_USER.ERROR, payload: err });
		}
	};
}
