import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Meals from 'Views/Meals';
import Users from 'Views/Users';
import Settings from 'Views/Settings';
import TopBar from 'Components/TopBar';

function App() {
	return (
		<BrowserRouter>
			<div>
				<TopBar />
				<Route path="/Meals" component={Meals} />
				<Route path="/Users" component={Users} />
				<Route path="/Settings" component={Settings} />
			</div>
		</BrowserRouter>
	);
}

export default App;
