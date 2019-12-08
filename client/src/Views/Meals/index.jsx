import React from 'react';
// import styles from './styles.module.scss';
import moment from 'moment';
import MealGroup from './MealGroup';
import MealGroupHeaders from './MealGroupHeaders';
import groupMealsByPeriod from 'Utils/groupMealsByPeriod';
import { styles } from 'ansi-colors';

const meals = [
	{
		id: 'ml10',
		memberId: 'mr10',
		date: moment('2019-11-30 13:30'),
		name: 'burger',
		calories: 1100,
	},
	{
		id: 'ml15',
		memberId: 'mr10',
		date: moment('2019-11-30 18:20'),
		name: 'shake',
		calories: 1000,
	},
	{
		id: 'ml15',
		memberId: 'mr10',
		date: moment('2019-11-29 11:20'),
		name: 'pizza',
		calories: 1500,
	},
];

const member = {
	id: 'mr10',
	name: 'Johnson Bronson',
	role: 'user',
	email: 'email@email.com',
};

export default function Meals(props) {
	const mealGroups = groupMealsByPeriod(meals);
	return (
		<div>
			<h1>{`${member.name}'s meals`}</h1>

			<div className={styles.MealGroupList}>
				<MealGroupHeaders />
				{mealGroups.map((mealGroup, index) => (
					<MealGroup
						meals={mealGroup}
						key={index}
						rowClassName={styles.row}
						cellClassName={styles.cell}
					/>
				))}
			</div>
		</div>
	);
}
