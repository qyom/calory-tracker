import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import styles from './styles.module.scss';
import Spinner from 'Components/Spinner';
import fieldConfigs from './fieldConfigs';
import ViewHeader from 'Components/ViewHeader';
import Modal from 'Components/Modals';
import { fetchMember, deleteMember, unAuthUser, updateMember } from 'Actions';
import ControlledFields from 'Components/ControlledFields';
import { ROLE_TYPES } from 'Utils/getIfAllowed';
import classnames from 'classnames';

const roleOptions = {
	[ROLE_TYPES.ADMIN]: [
		ROLE_TYPES.ADMIN,
		ROLE_TYPES.MANAGER,
		ROLE_TYPES.REGULAR,
	],
	[ROLE_TYPES.MANAGER]: [ROLE_TYPES.MANAGER, ROLE_TYPES.REGULAR],
	[ROLE_TYPES.REGULAR]: [ROLE_TYPES.REGULAR],
};

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
		user: memberPropTypes,
		match: PropTypes.shape({
			params: PropTypes.shape({
				memberId: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
	};

	state = { isEditMode: false, deleteUserModal: false };

	setupFieldsDataExternalControlers = (getFieldValues, setFieldValues) => {
		this.getFieldValues = getFieldValues;
		this.setFieldValues = setFieldValues;
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
		this.setFieldValues(this.props.member, this.toggleEditMode);
	};

	handleSaveClick = event => {
		event.preventDefault();
		const { memberId } = this.props.member;
		const updatedMemberState = this.getFieldValues();

		this.props.updateMember({
			member: { ...updatedMemberState, memberId },
			isUpdatingSelf: this.isMemberTheUser,
		});

		this.toggleEditMode();
	};

	toggleDeleteConfirmModal = () => {
		let deleteUserModal = !this.state.deleteUserModal;
		this.setState({ deleteUserModal });
	};

	handleDeleteClick = event => {
		event.preventDefault();
		const { memberId } = this.props.member;
		this.toggleDeleteConfirmModal();
		this.props.deleteMember({ memberId, isDeletingSelf: this.isMemberTheUser });
	};

	get isMemberTheUser() {
		const { user, member } = this.props;
		const { memberId } = member;
		return memberId === user.memberId;
	}

	previousMember = this.props.member;

	render() {
		const { member, user } = this.props;
		const isMemberDeleted = this.previousMember && !member;

		if (isMemberDeleted) {
			return <Redirect to="/members" />;
		} else {
			this.previousMember = member;
		}

		if (!member) {
			return <Spinner />;
		}

		const { isEditMode, deleteUserModal } = this.state;
		const { firstName, lastName, memberId } = this.props.member;

		let headerMessage = `${firstName} ${lastName}'s account`;
		if (this.isMemberTheUser) {
			headerMessage = 'My account';
		}
		const isUserAdmin = user.roleType === ROLE_TYPES.ADMIN;
		return (
			<div className={styles.Account}>
				<ViewHeader>
					{headerMessage}
					{(this.isMemberTheUser || isUserAdmin) && (
						<Link
							to={`/meals/${memberId}`}
							className={classnames(styles.linkBtn, styles.cntlBtn)}
						>
							(View meals)
						</Link>
					)}
				</ViewHeader>
				<ControlledFields
					fieldConfigs={fieldConfigs}
					fieldValues={member}
					isEditMode={isEditMode}
					fieldOptions={{ roleType: roleOptions[user.roleType] }}
					setupFieldsDataExternalControlers={
						this.setupFieldsDataExternalControlers
					}
				/>
				{!isEditMode && (
					<button
						className={classnames(styles.primaryBtn, styles.cntlBtn)}
						onClick={this.handleEditClick}
					>
						Edit
					</button>
				)}
				{isEditMode && (
					<button
						className={classnames(styles.primaryBtn, styles.cntlBtn)}
						onClick={this.handleSaveClick}
					>
						Save
					</button>
				)}
				{isEditMode && (
					<button
						className={classnames(styles.secondaryBtn, styles.cntlBtn)}
						onClick={this.handleCancelClick}
					>
						Cancel
					</button>
				)}
				<button
					className={classnames(styles.secondaryBtn, styles.cntlBtn)}
					onClick={this.toggleDeleteConfirmModal}
				>
					Delete
				</button>

				<Modal
					isVisible={deleteUserModal}
					title={`Are you sure you want to delete ${firstName} ${lastName}?`}
					controls={[
						{ text: 'Delete', primary: true, onClick: this.handleDeleteClick },
						{ text: 'Cancel', onClick: this.toggleDeleteConfirmModal },
					]}
				/>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const { user, members } = state;
	const { memberId: routeMemberId } = ownProps.match.params;
	const member = members.find(member => member.memberId === routeMemberId);
	return { member, user: user.data };
}
export default connect(mapStateToProps, {
	updateMember,
	fetchMember,
	deleteMember,
	unAuthUser,
})(Account);
