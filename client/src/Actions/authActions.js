import axiosApi, {
	setAuthInterceptor,
	ejectAuthInterceptor,
	setUnAuthInterceptor,
	ejectUnAuthInterceptor,
} from 'Axios/axiosApi.js';
import { AUTH_USER, UNAUTH_USER, CREATE_USER } from 'Constants/actionTypes';
import { normalizeMember, denormalizeMember } from 'Utils/normalizers';
import { addMemberToState } from 'Actions';

export function authUser({ email, password }) {
	return async function _dispatcher_(dispatch) {
		try {
			dispatch({ type: AUTH_USER.START });
			const res = await axiosApi({
				method: 'post',
				url: '/auth',
				data: { email, password },
			});

			const { token, member: denormalizedUser } = res.data;
			authUserLocally({ dispatch, token, denormalizedUser });
		} catch (err) {
			console.log(err);
			dispatch({ type: AUTH_USER.ERROR, payload: err });
		}
	};
}

export function fetchUser(token) {
	return async function _dispatcher_(dispatch) {
		try {
			dispatch({ type: AUTH_USER.START });
			const res = await axiosApi.get('/auth', {
				headers: { Authorization: `Bearer ${token}` },
			});
			const denormalizedUser = res.data;
			console.log("Authing locally");
			authUserLocally({ dispatch, token, denormalizedUser });
			console.log("after authing locally");
		} catch (err) {
			console.log(err.response);
			dispatch({ type: AUTH_USER.ERROR, payload: err });
		}
	};
}

export function createUser(member = {}) {
	return async function _dispatcher_(dispatch) {
		try {
			dispatch({ type: CREATE_USER.START });
			const denormalizedMember = denormalizeMember(member);
			const res = await axiosApi({
				method: 'post',
				url: `/member`,
				data: denormalizedMember,
			});

			const { token, member: denormalizedUser } = res.data;
			authUserLocally({ dispatch, token, denormalizedUser });
		} catch (err) {
			// console.log(err);
			dispatch({ type: CREATE_USER.ERROR, payload: err.response });
		}
	};
}

export function setUserInState(dispatch, payload) {
	dispatch({
		type: AUTH_USER.FINISH,
		payload,
	});
}
function authUserLocally({ dispatch, denormalizedUser, token }) {
	localStorage.setItem('jwt', token);
	setAuthInterceptor();
	setUnAuthInterceptor(unAuthUserLocally, dispatch);

	const normalizedMember = normalizeMember(denormalizedUser);
console.log("ADding member to state inside authUserLocally");
	addMemberToState(dispatch, normalizedMember);
	console.log("Done ADding member to state inside authUserLocally");
	setUserInState(dispatch, normalizedMember);
	console.log("Done Setting member to state inside authUserLocally");
}

export function unAuthUserLocally(dispatch) {
	localStorage.removeItem('jwt');
	ejectAuthInterceptor();
	ejectUnAuthInterceptor();
	dispatch({
		type: UNAUTH_USER.FINISH,
	});
}

export function unAuthUser() {
	return async function _dispatcher_(dispatch) {
		dispatch({ type: UNAUTH_USER.START });
		const jwt = localStorage.getItem('jwt');

		unAuthUserLocally(dispatch);
		try {
			axiosApi({
				method: 'delete',
				url: '/auth',
				headers: { Authorization: `Bearer ${jwt}` },
			});
		} catch (err) {
			console.log('error deleting token', err);
			dispatch({ type: UNAUTH_USER.ERROR, payload: err });
		}
	};
}
