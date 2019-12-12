import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authUser } from 'Actions';
import ViewHeader from 'Components/ViewHeader';
import Spinner from 'Components/Spinner';
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
		this.props.authUser({ email, password });
	};

	handleEmailChange = event => {
		this.setState({ email: event.target.value });
	};

	handlePasswordChange = event => {
		this.setState({ password: event.target.value });
	};

	allowSubmit = () => {
		const { email, password } = this.state;
		return email && email.length > 0 &&
		 password && password.length > 0;
	}

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />;
		}
		const { email, password } = this.state;
		const { isLoading, authError } = this.props;
		const btnStyle = this.allowSubmit() ? 
			(isLoading ? styles.activeBtn : styles.primaryBtn)
			: styles.disabledBtn;

		return (
			<div className={styles.FormPage}>
				<ViewHeader>
					Log In
					{ authError ? 
						<div className={styles.pageCntls}>
							<span className={styles.pageError}>Invalid Credentials</span>
						</div>
						: null
					}
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
					<button className={classnames(btnStyle, styles.cntlBtn)} 
						type="submit">
						{isLoading ? <Spinner small={true} /> : 'Sign In'}
					</button>
				</form>
			</div>
		);
	}
}

function mapStateToPros({ user }) {
	return { isAuthenticated: !!user.data, isLoading: user.isLoading, authError: user.error};
}
export default connect(mapStateToPros, { authUser })(Login);
