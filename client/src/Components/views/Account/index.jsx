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
import getRelevantMemberValues from 'Utils/getRelevantMemberValues';
import classnames from 'classnames';

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

	state = { isEditMode: false };

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

		// const relevantMemberValues = getRelevantMemberValues(this.props.member);
		// this.setFieldValues(relevantMemberValues, this.toggleEditMode);
		this.setFieldValues(this.props.member, this.toggleEditMode);
	};

	handleSaveClick = event => {
		event.preventDefault();
		const { memberId } = this.props.member;
		const updatedMemberState = this.getFieldValues();
		// updatedMemberState.memberId = memberId;
		// const relevantMemberValues = getRelevantMemberValues(updatedMemberState);

		this.props.updateMember({
			member: { ...updatedMemberState, memberId },
			isUpdatingSelf: this.isMemberTheUser,
		});

		this.toggleEditMode();
	};

	handleDeleteClick = event => {
		event.preventDefault();
		const { memberId } = this.props.member;
		this.props.deleteMember({ memberId, isDeletingSelf: this.isMemberTheUser });
	};

	get isMemberTheUser() {
		const { userId, member } = this.props;
		const { memberId } = member;
		return memberId === userId;
	}

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
			<div className={styles.Account}>
				<ViewHeader>
					{headerMessage}
					<Link
						to={`/meals/${memberId}`}
						className={classnames(styles.linkBtn, styles.cntlBtn)}
					>
						(View meals)
					</Link>
				</ViewHeader>
				<ControlledFields
					fieldConfigs={fieldConfigs}
					fieldValues={member}
					isEditMode={isEditMode}
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
					onClick={this.handleDeleteClick}
				>
					Delete
				</button>
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
