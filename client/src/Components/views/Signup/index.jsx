import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authUser, createMember } from 'Actions';
import ControlledFields from 'Components/ControlledFields';
import fieldConfigs from 'Components/views/Account/fieldConfigs';
import getRelevantMemberValues from 'Utils/getRelevantMemberValues';

import styles from './styles.module.scss';

class Login extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool.isRequired,
		createMember: PropTypes.func.isRequired,
	};

	setupFieldsDataExternalControlers = (getFieldsData, setFieldsData) => {
		this.getFieldsData = getFieldsData;
		this.setFieldsData = setFieldsData;
	};

	handleSubmit = event => {
		event.preventDefault();
		const updatedMemberState = this.getFieldsData();
		const relevantMemberValues = getRelevantMemberValues(updatedMemberState);
		// const updatedMember = { ...this.props.member, ...relevantMemberValues };
		this.props.createMember(relevantMemberValues);
	};

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />;
		}
		return (
			<div>
				<h1 className={styles.header}>Log In</h1>
				<ControlledFields
					fieldConfigs={fieldConfigs}
					// fieldValues={
					// 	{
					// 		// firstName: '',
					// 		// lastName: '',
					// 		// maxCaloriesPerDay: '',
					// 		// email: '',
					// 		// memberId: '',
					// 		// password: '',
					// 		// confirmPassword: '',
					// 	}
					// }
					// fieldValues={{ ...member, password: '', confirmPassword: '' }}
					// isEditMode={isEditMode}
					setupFieldsDataExternalControlers={
						this.setupFieldsDataExternalControlers
					}
				/>
				<button onClick={this.handleSubmit}>Submit</button>
			</div>
		);
	}
}

function mapStateToPros({ user }) {
	return { isAuthenticated: !!user.data };
}
export default connect(mapStateToPros, { authUser, createMember })(Login);
