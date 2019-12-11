export function normalizeMeal(meal) {
	return {
		memberId: String(meal.member_id),
		mealId: String(meal.meal_id),
		name: String(meal.name),
		calories: Number(meal.calories),
		dateIntake: new Date(meal.date_intake),
		dateCreated: new Date(meal.date_created),
	};
}
export function denormalizeMeal(meal) {
	return {
		member_id: String(meal.memberId),
		meal_id: String(meal.mealId),
		name: String(meal.name),
		calories: Number(meal.calories),
		date_intake: String(meal.dateIntake),
		date_created: String(meal.dateCreated),
	};
}

export function normalizeMember(member) {
	return {
		memberId: String(member.member_id),
		roleType: String(member.role_type),
		email: String(member.email),
		firstName: String(member.first_name),
		lastName: String(member.last_name),
		maxCaloriesPerDay: Number(member.max_calories_per_day),
		createdAt: new Date(member.created_at),
		updatedAt: new Date(member.updated_at),
	};
}

export function denormalizeMember(member) {
	return {
		member_id: String(member.memberId),
		role_type: String(member.roleType),
		email: String(member.email),
		first_name: String(member.firstName),
		last_name: String(member.lastName),
		max_calories_per_day: Number(member.maxCaloriesPerDay),
		created_at: new Date(member.createdAt),
		updated_at: new Date(member.updatedAt),
		password: String(member.password),
		password_confirmation: String(member.confirmPassword),
	};
}
