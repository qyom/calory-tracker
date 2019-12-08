import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Meals from 'Views/Meals';
import Members from 'Views/Members';
import Account from 'Views/Account';
import NavBar from 'Components/NavBar';
import store from 'Reducers/store.js';

function App() {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<div>
					<NavBar />
					<Route path="/members" component={Members} />
					<Route
						path="/:memberId/meals"
						render={props => {
							const { memberId } = props.match.params;
							return <Meals {...props} key={memberId} />;
						}}
					/>
					<Route
						path="/:memberId/account"
						render={props => {
							const { memberId } = props.match.params;
							return <Account {...props} key={memberId} />;
						}}
					/>
				</div>
			</Provider>
		</BrowserRouter>
	);
}

export default App;
