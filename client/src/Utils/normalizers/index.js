import moment from 'moment';

const stringToDate = value => new Date(value);
const dateToString = date => moment(date).format("YYYY-MM-DD HH:mm:ss");
const identity = value => value;

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
	//console.log("Normalizing", values, configs, "RESULT", transformedValues);
	return transformedValues;
}

export function normalizeMeal(meal) {
	const configs = {
		member_id: { transformer: String, key: 'memberId' },
		meal_id: { transformer: String, key: 'mealId' },
		name: { transformer: String, key: 'name' },
		calories: { transformer: Number, key: 'calories' },
		date_intake: { transformer: stringToDate, key: 'dateIntake' },
		created_at: { transformer: stringToDate, key: 'createdAt' },
	};
	return transform(meal, configs);
}
export function denormalizeMeal(meal) {
	const configs = {
		memberId: { transformer: String, key: 'member_id' },
		mealId: { transformer: String, key: 'meal_id' },
		name: { transformer: String, key: 'name' },
		calories: { transformer: String, key: 'calories' },
		dateIntake: { transformer: dateToString, key: 'date_intake' },
		createdAt: { transformer: String, key: 'created_at' },
	};
	return transform(meal, configs);
}

export function normalizeMember(member) {
	const configs = {
		member_id: { transformer: String, key: 'memberId' },
		role_type: { transformer: String, key: 'roleType' },
		email: { transformer: String, key: 'email' },
		first_name: { transformer: String, key: 'firstName' },
		last_name: { transformer: String, key: 'lastName' },
		max_calories_per_day: { transformer: Number, key: 'maxCaloriesPerDay' },
		created_at: { transformer: stringToDate, key: 'createdAt' },
		updated_at: { transformer: stringToDate, key: 'updatedAt' },
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
		createdAt: { transformer: stringToDate, key: 'created_at' },
		updatedAt: { transformer: stringToDate, key: 'updated_at' },
		password: { transformer: String, key: 'password', isTruthy: true },
		confirmPassword: {
			transformer: String,
			key: 'password_confirmation',
			isTruthy: true,
		},
	};
	return transform(member, configs);
}
