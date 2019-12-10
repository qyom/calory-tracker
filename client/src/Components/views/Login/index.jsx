import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authUser } from 'Actions/authActions';

import styles from './styles.module.scss';

class Login extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool.isRequired,
	};
	state = {
		email: '',
		password: '',
	};
	handleSubmit = event => {
		event.preventDefault();
		const { email, password } = this.state;
		// console.log('submitting', email, password);
		this.props.authUser({ email, password });
	};
	handleEmailChange = event => {
		this.setState({ email: event.target.value });
	};
	handlePasswordChange = event => {
		this.setState({ password: event.target.value });
	};
	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />;
		}
		const { email, password } = this.state;
		return (
			<div>
				<h1 className={styles.header}>Log In</h1>
				<form action="" onSubmit={this.handleSubmit} className={styles.form}>
					<div className={styles.inputGroup}>
						<label htmlFor="email" className={styles.inputLabel}>
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							onChange={this.handleEmailChange}
							value={email}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label htmlFor="password" className={styles.inputLabel}>
							Password
						</label>
						<input
							type="password"
							name="password"
							id="password"
							onChange={this.handlePasswordChange}
							value={password}
						/>
					</div>
					<button type="submit">Sign In</button>
				</form>
			</div>
		);
	}
}

function mapStateToPros({ user }) {
	return { isAuthenticated: !!user.data };
}
export default connect(mapStateToPros, { authUser })(Login);
