import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Meals from 'Components/views/Meals';
import Members from 'Components/views/Members';
import Account from 'Components/views/Account';
import NavBar from 'Components/NavBar';
import store from 'Reducers/store.js';

function App() {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<div>
					<NavBar />
					<Route path="/members" component={Members} exact />
					<Route
						path="/meals/:memberId"
						render={props => {
							const { memberId } = props.match.params;
							return <Meals {...props} key={memberId} />;
						}}
					/>
					<Route
						path="/members/:memberId"
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
