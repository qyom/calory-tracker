import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from 'Reducers/rootReducer';

/* eslint-disable no-underscore-dangle */
const identity = f => f;

const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(thunk),
		(window.__REDUX_DEVTOOLS_EXTENSION__ &&
			window.__REDUX_DEVTOOLS_EXTENSION__()) ||
			identity,
	),
);
/* eslint-enable */

export default store;
