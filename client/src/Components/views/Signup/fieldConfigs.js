// todo - remove default values when done developing
export default [
	{
		name: 'firstName',
		type: 'text',
		label: 'first name',
		//defaultValue: 'adam',
		required: true
	},
	{
		name: 'lastName',
		type: 'text',
		label: 'last name',
		//defaultValue: 'smith',
		required: true
	},
	{
		name: 'maxCaloriesPerDay',
		type: 'number',
		label: 'max calories',
		//defaultValue: 1000,
		required: true,
		min: 0
	},
	{
		name: 'email',
		type: 'email',
		label: 'email',
		//defaultValue: 'test@gmail.com',
		required: true,
	},
	// {
	// 	name: 'roleType',
	// 	type: 'select',
	// 	label: 'role type',
	// },
	{
		name: 'password',
		type: 'password',
		label: 'password',
		isValueHidden: true,
		//defaultValue: 'pass123',
		minLength: 6,
		autoComplete: "new-password",
		required: true
	},
	{
		name: 'confirmPassword',
		type: 'password',
		label: 'confirm password',
		isValueHidden: true,
		//defaultValue: 'pass123',
		minLength: 6,
		required: true
	},
];
