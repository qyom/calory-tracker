import { AUTH_USER, UNAUTH_USER, CREATE_USER } from 'Constants/actionTypes';

export const initialState = {
	isLoading: false,
	error: null,
	data: null,
};

export default function mealsReducer(state = initialState, action) {
	switch (action.type) {
		// auth or create
		case CREATE_USER.START:
		case AUTH_USER.START: {
			return { isLoading: true, error: null, data: null };
		}
		case CREATE_USER.FINISH:
		case AUTH_USER.FINISH: {
			const member = action.payload;
			return { isLoading: false, error: null, data: member };
		}
		case CREATE_USER.ERROR:
		case AUTH_USER.ERROR: {
			const error = action.payload;
			return { isLoading: false, error, data: null };
		}
		// unauth
		case UNAUTH_USER.START: {
			// convenience boiler plate
			return state;
		}
		case UNAUTH_USER.FINISH: {
			// todo - if time permits, reset all states to their initial forms on logout
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
