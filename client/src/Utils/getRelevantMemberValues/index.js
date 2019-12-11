export default function getRelevantMemberValues(member) {
	// this will make sure irrelevant fields like date_created
	// don't end up on put request when updating the user
	const {
		firstName,
		lastName,
		maxCaloriesPerDay,
		email,
		memberId,
		password,
		confirmPassword,
	} = member;

	const relevantMemberValues = {
		firstName,
		lastName,
		maxCaloriesPerDay,
		email,
		memberId,
		password,
		confirmPassword,
	};

	for (let key in relevantMemberValues) {
		const value = relevantMemberValues[key];
		if (value === undefined) {
			delete relevantMemberValues[key];
		}
	}

	return relevantMemberValues;
}
