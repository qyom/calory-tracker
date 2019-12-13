export default [
	{
		name: 'name',
		type: 'text',
		label: 'Name',
		required: true
	},
	{
		name: 'calories',
		type: 'number',
		label: 'Calories',
		required: true,
		min: 0
	},
	{
		name: 'dateIntake',
		type: 'dateTime',
		label: 'Date/Time',
		defaultValue: new Date()
	}
];
