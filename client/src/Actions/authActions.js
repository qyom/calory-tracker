import axiosApi from 'Axios/axiosApi.js';
import { AUTH_USER, UNAUTH_USER } from 'Constants/actionTypes';
import { normalizeMember, denormalizeMember } from 'Utils/normalizers';

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
			// console.log(res.data["x-auth"]);
			const member = normalizeMember(res.data.member);
			dispatch({
				type: AUTH_USER.FINISH,
				payload: { member },
			});
			localStorage.setItem('token', res.data['x-auth']);
			// redirect();
		} catch (err) {
			console.log(err);
			dispatch({ type: AUTH_USER.ERROR, payload: err });
		}
	};
}

// function signoutUser(dispatch) {
//     dispatch({ type: UNAUTH_USER });
//     localStorage.removeItem('token');
// }

export function unAuthUser() {
	return async function _dispatcher_(dispatch) {
		dispatch({ type: UNAUTH_USER.START });
		try {
			await axiosApi({
				method: 'delete',
				url: '/auth',
				// headers: { 'x-auth': localStorage.getItem('token') },
			});
			dispatch({ type: UNAUTH_USER.FINISH });
			// localStorage.removeItem('token');
			// // signoutUser(dispatch);
		} catch (err) {
			console.log('error deleting token', err);
			dispatch({ type: UNAUTH_USER.ERROR, payload: err });
		}
	};
}
