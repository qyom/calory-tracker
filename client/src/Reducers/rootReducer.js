import { combineReducers } from 'redux';

import userReducer from './userReducer';
import membersReducer from './membersReducer';
import mealsReducer from './mealsReducer';

const rootReducer = combineReducers({
	user: userReducer,
	members: membersReducer,
	allMeals: mealsReducer,
});

export default rootReducer;
