import { get } from 'lodash';

function convertToDate(value) {
	return new Date(value);
}

function identity(value) {
	return value;
}

function transform(values, configs = {}) {
	const transformedValues = Object.keys(values).reduce(
		(transformedValues, key) => {
			const value = values[key];
			const config = configs[key];
			if (
				value !== undefined &&
				config &&
				config.key &&
				(!config.isTruthy || value)
			) {
				const transformer = config.transformer || identity;
				transformedValues[config.key] = transformer(value);
			}
			return transformedValues;
		},
		{},
	);

	return transformedValues;
}

export function normalizeMeal(meal) {
	// return {
	// 	memberId: String(meal.member_id),
	// 	mealId: String(meal.meal_id),
	// 	name: String(meal.name),
	// 	calories: Number(meal.calories),
	// 	dateIntake: new Date(meal.date_intake),
	// 	dateCreated: new Date(meal.date_created),
	// };
	const configs = {
		member_id: { transformer: String, key: 'memberId' },
		meal_id: { transformer: String, key: 'mealId' },
		name: { transformer: String, key: 'name' },
		calories: { transformer: Number, key: 'calories' },
		date_intake: { transformer: convertToDate, key: 'dateIntake' },
		date_created: { transformer: convertToDate, key: 'dateCreated' },
	};
	return transform(meal, configs);
}
export function denormalizeMeal(meal) {
	// return {
	// 	member_id: String(meal.memberId),
	// 	meal_id: String(meal.mealId),
	// 	name: String(meal.name),
	// 	calories: Number(meal.calories),
	// 	date_intake: String(meal.dateIntake),
	// 	date_created: String(meal.dateCreated),
	// };
	const configs = {
		memberId: { transformer: String, key: 'member_id' },
		mealId: { transformer: String, key: 'meal_id' },
		name: { transformer: String, key: 'name' },
		calories: { transformer: Number, key: 'calories' },
		dateIntake: { transformer: String, key: 'date_intake' },
		dateCreated: { transformer: String, key: 'date_created' },
	};
	return transform(meal, configs);
}

export function normalizeMember(member) {
	// return {
	// 	memberId: String(member.member_id),
	// 	roleType: String(member.role_type),
	// 	email: String(member.email),
	// 	firstName: String(member.first_name),
	// 	lastName: String(member.last_name),
	// 	maxCaloriesPerDay: Number(member.max_calories_per_day),
	// 	createdAt: new Date(member.created_at),
	// 	updatedAt: new Date(member.updated_at),
	// };
	const configs = {
		member_id: { transformer: String, key: 'memberId' },
		role_type: { transformer: String, key: 'roleType' },
		email: { transformer: String, key: 'email' },
		first_name: { transformer: String, key: 'firstName' },
		last_name: { transformer: String, key: 'lastName' },
		max_calories_per_day: { transformer: Number, key: 'maxCaloriesPerDay' },
		created_at: { transformer: convertToDate, key: 'createdAt' },
		updated_at: { transformer: convertToDate, key: 'updatedAt' },
	};
	return transform(member, configs);
}

export function denormalizeMember(member) {
	const configs = {
		memberId: { transformer: String, key: 'member_id' },
		roleType: { transformer: String, key: 'role_type' },
		email: { transformer: String, key: 'email' },
		firstName: { transformer: String, key: 'first_name' },
		lastName: { transformer: String, key: 'last_name' },
		maxCaloriesPerDay: { transformer: Number, key: 'max_calories_per_day' },
		createdAt: { transformer: convertToDate, key: 'created_at' },
		updatedAt: { transformer: convertToDate, key: 'updated_at' },
		password: { transformer: String, key: 'password', isTruthy: true },
		confirmPassword: {
			transformer: String,
			key: 'password_confirmation',
			isTruthy: true,
		},
	};
	return transform(member, configs);
}
