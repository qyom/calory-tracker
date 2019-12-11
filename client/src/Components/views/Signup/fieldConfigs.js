// todo - remove default values when done developing
export default [
	{
		name: 'firstName',
		type: 'text',
		label: 'first name',
		defaultValue: 'adam',
	},
	{
		name: 'lastName',
		type: 'text',
		label: 'last name',
		defaultValue: 'smith',
	},
	{
		name: 'maxCaloriesPerDay',
		type: 'number',
		label: 'max calories',
		defaultValue: 1000,
	},
	{
		name: 'email',
		type: 'email',
		label: 'email',
		defaultValue: 'test@gmail.com',
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
		defaultValue: 'pass123',
	},
	{
		name: 'confirmPassword',
		type: 'password',
		label: 'confirm password',
		isValueHidden: true,
		defaultValue: 'pass123',
	},
];
