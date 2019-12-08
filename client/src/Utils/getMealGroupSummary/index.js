import moment from 'moment';

export default function getMealGroupSummary(meals) {
	if (!meals.length) {
		return {};
	}

	const calories = meals.reduce((calories, meal) => {
		return calories + meal.calories;
	}, 0);

	const formattedDate = moment(meals[0].dateIntake).format('MM DD YYYY');

	return { calories, formattedDate, numberOfMeals: meals.length };
}
