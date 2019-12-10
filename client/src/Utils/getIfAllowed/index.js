import { get } from 'lodash';

const CREATE = 'create';
const READ = 'read';
const EDIT = 'edit';
const DELETE = 'delete';
export const OPERATION_TYPES = Object.freeze({
	CREATE,
	READ,
	EDIT,
	DELETE,
});

const REGULAR = 'REGULAR';
const MANAGER = 'MANAGER';
const ADMIN = 'ADMIN';
export const ROLE_TYPES = Object.freeze({
	REGULAR,
	MANAGER,
	ADMIN,
});

const MEMBER = 'MEMBER';
const MEAL = 'MEAL';
export const RESOURCE_TYPES = Object.freeze({
	MEMBER,
	MEAL,
});

const config = {
	[REGULAR]: {
		[MEAL]: {
			[CREATE]: true,
			[READ]: true,
			[EDIT]: true,
			[DELETE]: true,
		},
	},
	[MANAGER]: {
		[MEMBER]: {
			[CREATE]: true,
			[READ]: true,
			[EDIT]: true,
			[DELETE]: true,
		},
	},
	[ADMIN]: {
		[MEAL]: {
			[CREATE]: true,
			[READ]: true,
			[EDIT]: true,
			[DELETE]: true,
		},
		[MEMBER]: {
			[CREATE]: true,
			[READ]: true,
			[EDIT]: true,
			[DELETE]: true,
		},
	},
};

export default function getIfAllowed({ role, resource, operation }) {
	return get(config, `${role}.${resource}.${operation}`, false);
}
// getIfAllowed({ role, resouce: item.type, action });
