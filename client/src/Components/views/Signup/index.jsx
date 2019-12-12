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
		const updatedMemberState = this.getFieldValues();
		updatedMemberState.roleType = ROLE_TYPES.REGULAR;
		this.props.createUser(updatedMemberState);
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
					{ authError ? 
						<div className={styles.pageCntls}>
							<span className={styles.pageError}>User Exists</span>
						</div>
						: null
					}
				</ViewHeader>
				<ControlledFields
					fieldConfigs={fieldConfigs}
					setupFieldsDataExternalControlers={
						this.setupFieldsDataExternalControlers
					}
				/>
				<button
					className={classnames(
						isLoading ? styles.activeBtn : styles.primaryBtn,
						styles.cntlBtn,
					)}
					onClick={this.handleSubmit}
				>
					{isLoading ? <Spinner small={true} /> : 'Submit'}
				</button>
			</div>
		);
	}
}

function mapStateToPros({ user }) {
	return { isAuthenticated: !!user.data, isLoading: user.isLoading, authError: user.error };
}
export default connect(mapStateToPros, { authUser, createUser })(Signup);
