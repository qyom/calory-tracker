import { SET_MEALS, UPDATE_MEAL, DELETE_MEAL } from 'Constants/actionTypes';
import axiosApi from 'Axios/axiosApi.js';
import { normalizeMeal, denormalizeMeal } from 'Utils/normalizers';

export function fetchMeals(member = {}) {
	console.log('fetching meals: ');
	const { memberId } = member;

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get(`/member/${memberId}/meals`);

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

	return async function _dispatcher_(dispatch) {
		try {
			const denormalizedMeal = denormalizeMeal(meal);
			const res = await axiosApi({
				method: 'put',
				url: `/meal/${mealId}`,
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

	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi({
				method: 'delete',
				url: `/meal/${mealId}`,
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
