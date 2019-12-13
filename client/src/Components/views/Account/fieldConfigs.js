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
		type: 'radioGroup',
		label: 'Role type'
	},
	{
		name: 'password',
		type: 'password',
		label: 'Password',
		isValueHidden: true,
		autoComplete: "new-password"
	},
	{
		name: 'confirmPassword',
		type: 'password',
		label: 'Confirm password',
		isValueHidden: true,
	},
];
