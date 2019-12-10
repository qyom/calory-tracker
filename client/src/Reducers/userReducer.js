import { AUTH_USER, UNAUTH_USER } from 'Constants/actionTypes';
import { normalizeMember } from 'Utils/normalizers';

export const initialState = {
	isLoading: false,
	error: null,
	data: normalizeMember({
		first_name: 'Augusta',
		last_name: 'Ziemann',
		max_calories_per_day: 1557,
		member_id: 2,
		role_type: 'ADMIN',
		email: 'augusta.ziemann@cal.com',
	}),
};
// export const initialState = {
//     isLoading: false,
//     error: null,
//     data: null,
// };

export default function mealsReducer(state = initialState, action) {
	switch (action.type) {
		// auth
		case AUTH_USER.START: {
			return { isLoading: true, error: null, data: null };
		}
		case AUTH_USER.FINISH: {
			const { member } = action.payload;
			return { isLoading: false, error: null, data: member };
		}
		case AUTH_USER.ERROR: {
			const error = action.payload;
			return { isLoading: false, error, data: null };
		}
		// unauth
		case UNAUTH_USER.START: {
			return { isLoading: true, error: null, data: null };
		}
		case UNAUTH_USER.FINISH: {
			return { isLoading: false, error: null, data: null };
		}
		case UNAUTH_USER.ERROR: {
			const error = action.payload;
			return { isLoading: false, error, data: null };
		}

		default:
			return state;
	}
}
