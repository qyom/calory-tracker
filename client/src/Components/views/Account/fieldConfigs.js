export default [
	{
		name: 'firstName',
		type: 'text',
		label: 'First name',
	},
	{
		name: 'lastName',
		type: 'text',
		label: 'Last name',
	},
	{
		name: 'maxCaloriesPerDay',
		type: 'number',
		label: 'Max calories',
	},
	{
		name: 'email',
		type: 'email',
		label: 'Email',
	},
	{
		name: 'roleType',
		type: 'select',
		label: 'Role type',
	},
	{
		name: 'password',
		type: 'password',
		label: 'Password',
		isValueHidden: true,
	},
	{
		name: 'confirmPassword',
		type: 'password',
		label: 'Confirm password',
		isValueHidden: true,
	},
];
