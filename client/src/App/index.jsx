import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Meals from 'Views/Meals';
import Users from 'Views/Users';
import Account from 'Views/Account';
import TopBar from 'Components/TopBar';

function App() {
	return (
		<BrowserRouter>
			<div>
				<TopBar />
				<Route path="/users" component={Users} />
				<Route path="/:id/meals" component={Meals} />
				<Route path="/:id/account" component={Account} />
			</div>
		</BrowserRouter>
	);
}

export default App;
