import moment from 'moment';
import groupMealsByPeriod, { MEAL_GROUP_PERIODS } from './index';

const meal01 = {
	date: moment('2019-11-30 13:30'),
};
const meal02 = {
	date: moment('2019-11-30 18:20'),
};
const meal03 = {
	date: moment('2019-11-29 11:20'),
};
const meal04 = {
	date: moment('2019-11-29 11:25'),
};
const meal05 = {
	date: moment('2019-11-19 12:25'),
};
const meal06 = {
	date: moment('2019-10-01 01:10'),
};
const meal07 = {
	date: moment('2018-01-01 01:10'),
};
const allMeals = [meal01, meal02, meal03, meal04, meal05, meal06, meal07];

describe('groupMealsByPeriod', () => {
	it('groups meals by hour', () => {
		expect(groupMealsByPeriod(allMeals, MEAL_GROUP_PERIODS.HOUR)).toEqual([
			[meal01],
			[meal02],
			[meal03, meal04],
			[meal05],
			[meal06],
			[meal07],
		]);
	});
	it('groups meals by day', () => {
		expect(groupMealsByPeriod(allMeals)).toEqual([
			[meal01, meal02],
			[meal03, meal04],
			[meal05],
			[meal06],
			[meal07],
		]);
	});
	it('groups meals by week', () => {
		expect(groupMealsByPeriod(allMeals, MEAL_GROUP_PERIODS.WEEK)).toEqual([
			[meal01, meal02, meal03, meal04],
			[meal05],
			[meal06],
			[meal07],
		]);
	});
	it('groups meals by Month', () => {
		expect(groupMealsByPeriod(allMeals, MEAL_GROUP_PERIODS.MONTH)).toEqual([
			[meal01, meal02, meal03, meal04, meal05],
			[meal06],
			[meal07],
		]);
	});
	it('groups meals by Year', () => {
		expect(groupMealsByPeriod(allMeals, MEAL_GROUP_PERIODS.YEAR)).toEqual([
			[meal07],
			[meal01, meal02, meal03, meal04, meal05, meal06],
		]);
	});
});
