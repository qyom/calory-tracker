import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import styles from './styles.module.scss';
import Spinner from 'Components/Spinner';
import fieldConfigs from './fieldConfigs';
import ViewHeader from 'Components/ViewHeader';
import { fetchMember, deleteMember, unAuthUser, updateMember } from 'Actions';
import ControlledFields from 'Components/ControlledFields';

export const memberPropTypes = PropTypes.shape({
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	maxCaloriesPerDay: PropTypes.number.isRequired,
	email: PropTypes.string.isRequired,
	memberId: PropTypes.string.isRequired,
});

class Account extends Component {
	static propTypes = {
		member: memberPropTypes,
		userId: PropTypes.string.isRequired,
		match: PropTypes.shape({
			params: PropTypes.shape({
				memberId: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	};

	constructor(props) {
		super(props);

		// const { firstName, lastName, maxCaloriesPerDay, email, memberId } =
		// 	props.member || {};

		this.state = {
			isEditMode: false,
			// firstName,
			// lastName,
			// email,
			// maxCaloriesPerDay,
			// memberId,
		};
	}

	setupGetFieldsData = (getFieldsData, setFieldsData) => {
		this.getFieldsData = getFieldsData;
		this.setFieldsData = setFieldsData;
	};

	componentDidMount() {
		const { fetchMember, member, match } = this.props;
		if (!member) {
			const { memberId } = match.params;
			fetchMember({ memberId });
		}
	}
	componentDidUpdate(prevProps) {
		// const { member } = this.props;
		// const isMemberUpdated = member && member !== prevProps.member;
		// if (isMemberUpdated) {
		// 	const {
		// 		firstName,
		// 		lastName,
		// 		maxCaloriesPerDay,
		// 		email,
		// 		memberId,
		// 	} = member;
		// 	this.setState({
		// 		firstName,
		// 		lastName,
		// 		email,
		// 		maxCaloriesPerDay,
		// 		memberId,
		// 	});
		// }
	}
	getRelevantMemberValues(member) {
		const {
			firstName,
			lastName,
			maxCaloriesPerDay,
			email,
			memberId,
			password,
			confirmPassword,
		} = member;

		return {
			firstName,
			lastName,
			maxCaloriesPerDay,
			email,
			memberId,
			password,
			confirmPassword,
		};
	}
	toggleEditMode = () => {
		this.setState(state => {
			return { isEditMode: !state.isEditMode };
		});
	};

	handleEditClick = event => {
		event.preventDefault();
		this.toggleEditMode();
	};

	handleCancelClick = event => {
		event.preventDefault();

		const relevantMemberValues = this.getRelevantMemberValues(
			this.props.member,
		);
		this.setFieldsData(relevantMemberValues, this.toggleEditMode);
	};

	handleSaveClick = event => {
		event.preventDefault();
		const updatedMemberState = this.getFieldsData();
		const relevantMemberValues = this.getRelevantMemberValues(
			updatedMemberState,
		);

		this.props.updateMember(relevantMemberValues);

		this.toggleEditMode();
	};

	handleDeleteClick = event => {
		event.preventDefault();
		const { userId, member } = this.props;
		const { memberId } = member;
		const isDeletingSelf = memberId === userId;
		this.props.deleteMember({ memberId, isDeletingSelf });
	};

	previousMember = this.props.member;

	render() {
		const { userId, member } = this.props;
		const isMemberDeleted = this.previousMember && !member;

		if (isMemberDeleted) {
			return <Redirect to="/members" />;
		} else {
			this.previousMember = member;
		}

		if (!member) {
			return <Spinner />;
		}

		const { isEditMode } = this.state;
		const { firstName, lastName, memberId } = this.props.member;

		let headerMessage = `${firstName} ${lastName}'s account`;
		if (memberId === userId) {
			headerMessage = 'My account';
		}

		return (
			<div>
				<ViewHeader>
					{headerMessage}
					<Link to={`/meals/${memberId}`}>(View meals)</Link>
				</ViewHeader>
				<ControlledFields
					fieldConfigs={fieldConfigs}
					fieldValues={{ ...member, password: '', confirmPassword: '' }}
					isEditMode={isEditMode}
					setupGetFieldsData={this.setupGetFieldsData}
				/>
				{!isEditMode && <button onClick={this.handleEditClick}>Edit</button>}
				{isEditMode && <button onClick={this.handleSaveClick}>Save</button>}
				{isEditMode && <button onClick={this.handleCancelClick}>Cancel</button>}
				<button onClick={this.handleDeleteClick}>Delete</button>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const { user, members } = state;
	const { memberId: routeMemberId } = ownProps.match.params;
	const member = members.find(member => member.memberId === routeMemberId);
	return { member, userId: user.data.memberId };
}
export default connect(mapStateToProps, {
	updateMember,
	fetchMember,
	deleteMember,
	unAuthUser,
})(Account);
