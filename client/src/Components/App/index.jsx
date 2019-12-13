import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Meals from 'Components/views/Meals';
import Members from 'Components/views/Members';
import LogIn from 'Components/views/LogIn';
import SignUp from 'Components/views/Signup';
import Account from 'Components/views/Account';
import Home from 'Components/views/Home';
import NavBar from 'Components/NavBar';
import store from 'Reducers/store.js';
import PrivateRoute from 'Components/PrivateRoute';
import { fetchUser } from 'Actions';

const token = localStorage.getItem('jwt');
if (token) {
	store.dispatch(fetchUser(token));
}

function App() {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<div>
					<NavBar />
					<Switch>
						<Route path="/login" component={LogIn} />
						<Route path="/signup" component={SignUp} />
						<PrivateRoute
							path="/members"
							fallbackPath="/"
							component={Members}
							exact
						/>
						<PrivateRoute
							path="/meals/:memberId"
							fallbackPath="/"
							render={props => {
								const { memberId } = props.match.params;
								return <Meals {...props} key={memberId} />;
							}}
						/>
						<PrivateRoute
							path="/members/:memberId"
							fallbackPath="/"
							render={props => {
								const { memberId } = props.match.params;
								return <Account {...props} key={memberId} />;
							}}
						/>
						<Route path="/" component={Home} />
					</Switch>
				</div>
			</Provider>
		</BrowserRouter>
	);
}

export default App;
