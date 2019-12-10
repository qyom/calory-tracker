import { SET_MEALS } from 'Constants/actionTypes';
import axiosApi from 'Axios/axiosApi.js';
import { normalizeMeal } from 'Utils/normalizers';

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
