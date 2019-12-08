const HOUR = 'hour';
const DAY = 'day';
const WEEK = 'week';
const MONTH = 'month';
const YEAR = 'year';
export const MEAL_GROUP_PERIODS = Object.freeze({
	HOUR,
	DAY,
	WEEK,
	MONTH,
	YEAR,
});

const MOMENT_DATE_FORMAT = Object.freeze({
	[HOUR]: 'YYYY MM DD HH',
	[DAY]: 'YYYY MM DD',
	[WEEK]: 'YYYY MM WW',
	[MONTH]: 'YYYY MM',
	[YEAR]: 'YYYY',
});

export default function groupMealsByPeriod(
	meals,
	period = MEAL_GROUP_PERIODS.DAY,
) {
	const mealGroupsObj = meals.reduce((mealGroupsObj, meal) => {
		const periodFormat = MOMENT_DATE_FORMAT[period];
		const mealGroupKey = meal.date.format(periodFormat);
		if (mealGroupsObj[mealGroupKey]) {
			mealGroupsObj[mealGroupKey].push(meal);
		} else {
			mealGroupsObj[mealGroupKey] = [meal];
		}
		return mealGroupsObj;
	}, {});

	return Object.values(mealGroupsObj);
}
