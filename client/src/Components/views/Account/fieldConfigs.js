export default [
	{
		name: 'firstName',
		type: 'text',
		label: 'First name',
		required: true
	},
	{
		name: 'lastName',
		type: 'text',
		label: 'Last name',
		required: true
	},
	{
		name: 'maxCaloriesPerDay',
		type: 'number',
		label: 'Max calories',
		required: true,
		min: 0
	},
	{
		name: 'email',
		type: 'email',
		label: 'Email',
		required: true
	},
	{
		name: 'roleType',
		type: 'radioGroup',
		label: 'Role type',
		required: true
	},
	{
		name: 'password',
		type: 'password',
		label: 'Password',
		isValueHidden: true,
		required: false,
		minLength: 6,
		autoComplete: "new-password"
	},
	{
		name: 'confirmPassword',
		type: 'password',
		label: 'Confirm password',
		isValueHidden: true,
		required: false,
		minLength: 6
	},
];
