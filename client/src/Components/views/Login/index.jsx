import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authUser } from 'Actions';
import ViewHeader from 'Components/ViewHeader';
import classnames from 'classnames';

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
			<div className={styles.FormPage}>
				<ViewHeader>
					Log In
				</ViewHeader>
				<form action="" onSubmit={this.handleSubmit} className={styles.form}>
					<div className={styles.inputGroup}>
						<label htmlFor="email" className={styles.label}>
							<span className={styles.labelName}> Email </span>
							<input type="email" name="email" id="email" value={email}
								onChange={this.handleEmailChange} className={styles.input}
							/>
						</label>
					</div>
					<div className={styles.inputGroup}>
						<label htmlFor="password" className={styles.label}>
							<span className={styles.labelName}>Password</span>
							<input type="password" name="password" id="password" value={password} 
								onChange={this.handlePasswordChange} className={styles.input}
							/>
						</label>
					</div>
					<button className={classnames(styles.primaryBtn, styles.cntlBtn)} 
						type="submit">
						Sign In
					</button>
				</form>
			</div>
		);
	}
}

function mapStateToPros({ user }) {
	return { isAuthenticated: !!user.data };
}
export default connect(mapStateToPros, { authUser })(Login);
