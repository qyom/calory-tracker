import { SET_MEALS, UPDATE_MEAL, DELETE_MEAL } from 'Constants/actionTypes';
import axiosApi from 'Axios/axiosApi.js';
import { normalizeMeal, denormalizeMeal } from 'Utils/normalizers';

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

export function updateMeal(meal = {}) {
	const { mealId, memberId } = meal;
	const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const denormalizedMeal = denormalizeMeal(meal);
			const res = await axiosApi({
				method: 'put',
				url: `/meal/${mealId}`,
				headers: { 'x-auth': token },
				data: denormalizedMeal,
			});
			const normalizedMeal = normalizeMeal(res.data);

			dispatch({
				type: UPDATE_MEAL,
				payload: { meal: normalizedMeal, memberId },
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}

export function deleteMeal(meal = {}) {
	const { mealId, memberId } = meal;
	const token = localStorage.getItem('token');

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi({
				method: 'delete',
				url: `/meal/${mealId}`,
				headers: { 'x-auth': token },
			});

			dispatch({
				type: DELETE_MEAL,
				payload: { mealId, memberId },
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
			// if (err.response.status === 401) {
			// 	signoutUser(dispatch);
			// }
		}
	};
}
