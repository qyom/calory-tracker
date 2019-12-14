import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authUser, createUser } from 'Actions';
import ControlledFields from 'Components/ControlledFields';
import fieldConfigs from './fieldConfigs';
import ViewHeader from 'Components/ViewHeader';
import Spinner from 'Components/Spinner';
import classnames from 'classnames';
import { ROLE_TYPES } from 'Utils/getIfAllowed';
import styles from './styles.module.scss';
import ErrorBox from 'Components/ErrorBox';

class Signup extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool.isRequired,
		createUser: PropTypes.func.isRequired,
	};

	setupFieldsDataExternalControlers = (getFieldValues, setFieldValues) => {
		this.getFieldValues = getFieldValues;
		// this.setFieldValues = setFieldValues;
	};

	handleSubmit = event => {
		event.preventDefault();
		const memberState = this.getFieldValues();
		memberState.roleType = ROLE_TYPES.REGULAR;
		this.props.createUser(memberState);
	};

	render() {
		const { isLoading, authError } = this.props;
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />;
		}
		return (
			<div className={styles.FormPage}>
				<ViewHeader>
					Sign Up
					<ErrorBox errors={authError} />
				</ViewHeader>
				<ControlledFields
					fieldConfigs={fieldConfigs}
					setupFieldsDataExternalControlers={
						this.setupFieldsDataExternalControlers
					}
					controls={[
						{ text: 'Submit', primary: true, type: 'submit'},
					]}
					state={{processing: isLoading}}
					onSubmit={this.handleSubmit}
				/>
				{/* <div className={styles.pageControls}>
					<button
						className={classnames(
							isLoading ? styles.activeBtn : styles.primaryBtn,
							styles.cntlBtn
						)}
						onClick={this.handleSubmit}
					>
						{isLoading ? <Spinner small={true} /> : 'Submit'}
					</button>
				</div> */}
			</div>
		);
	}
}

function mapStateToPros({ user }) {
	return { isAuthenticated: !!user.data, isLoading: user.isLoading, authError: user.error };
}
export default connect(mapStateToPros, { authUser, createUser })(Signup);
