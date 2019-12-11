export default function getRelevantMemberValues(member) {
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
