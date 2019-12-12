import { SET_MEALS, ADD_MEAL, UPDATE_MEAL, DELETE_MEAL } from 'Constants/actionTypes';
import axiosApi from 'Axios/axiosApi.js';
import { normalizeMeal, denormalizeMeal } from 'Utils/normalizers';
import buildQueryString from 'Utils/buildQueryString';

export function fetchMeals(member = {}, filters = {}) {
	console.log('fetching meals: ');
	const { memberId } = member;
	const queryStringMap = {
		intakeDateFrom: 'intake_date_from',
		intakeDateTo: 'intake_date_to',
		intakeHoursFrom: 'intake_hours_from',
		intakeHoursTo: 'intake_hours_to',
	};
	const queryString = buildQueryString(filters, queryStringMap);
	return async function _dispatcher_(dispatch) {
		try {
			const res = await axiosApi.get(`/member/${memberId}/meals${queryString}`);

			const normalizedMeals = res.data.map(normalizeMeal);
			dispatch({
				type: SET_MEALS,
				payload: { meals: normalizedMeals, memberId },
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
		}
	};
}

export function addMeal(member, meal) {
	return async function _dispatcher_(dispatch) {
		try {
			meal.memberId = member.memberId;
			const denormalizedMeal = denormalizeMeal(meal);
			console.log("denormalied meal: ", denormalizedMeal);

			dispatch({
				type: ADD_MEAL.START,
				payload: { meal },
			});
			const res = await axiosApi({
				method: 'post',
				url: `/meal`,
				data: denormalizedMeal,
			});
			const normalizedMeal = normalizeMeal(res.data.meal);
			dispatch({
				type: ADD_MEAL.FINISH,
				payload: { meal: normalizedMeal },
			});
			console.log("Just added Meal: ", normalizedMeal);

		} catch (err) {
			console.log('problem while adding a meal: ', err);
			dispatch({
				type: ADD_MEAL.ERROR,
				payload: { meal, error: err.response},
			});
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
			console.log('problem while updating a meal: ', err);
		}
	};
}

export function deleteMeal(meal = {}) {
	const { mealId, memberId } = meal;

	return async function _dispatcher_(dispatch) {
		try {
			await axiosApi({
				method: 'delete',
				url: `/meal/${mealId}`,
			});

			dispatch({
				type: DELETE_MEAL,
				payload: { mealId, memberId },
			});
		} catch (err) {
			console.log('problem while fetching data: ', err);
		}
	};
}
