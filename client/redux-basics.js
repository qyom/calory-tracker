const redux = require('redux');

const createStore = redux.createStore;

const initialState = {
	counter: 0,
};

// reducer
function rootReducer(state = initialState, action) {
	if (action.type === 'INC_COUNTER') {
		return {
			...state,
			counter: state.counter + 1,
		};
	}
	if (action.type === 'ADD_COUNTER') {
		return {
			...state,
			counter: state.counter + action.value,
		};
	}
	return state;
}

// store
const store = createStore(rootReducer);
console.log(store.getState());

// subscription
store.subscribe(() => {
	console.log('[subscription]:', store.getState());
});

// dispatch action
store.dispatch({ type: 'INC_COUNTER' });
store.dispatch({ type: 'ADD_COUNTER', value: 10 });
console.log(store.getState());
