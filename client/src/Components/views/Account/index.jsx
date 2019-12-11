import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import styles from './styles.module.scss';
import Spinner from 'Components/Spinner';
import { updateMember } from 'Actions/memberActions';
import fieldConfigs from './fieldConfigs';
import ViewHeader from 'Components/ViewHeader';
import { fetchMember, deleteMember, unAuthUser } from 'Actions';

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

		const { firstName, lastName, maxCaloriesPerDay, email, memberId } =
			props.member || {};

		this.state = {
			isEditMode: false,
			firstName,
			lastName,
			email,
			maxCaloriesPerDay,
			memberId,
		};
	}
	componentDidMount() {
		const { fetchMember, member, match } = this.props;
		if (!member) {
			const { memberId } = match.params;
			fetchMember({ memberId });
		}
	}
	componentDidUpdate(prevProps) {
		const { member } = this.props;
		const isMemberUpdated = member && member !== prevProps.member;
		if (isMemberUpdated) {
			const {
				firstName,
				lastName,
				maxCaloriesPerDay,
				email,
				memberId,
			} = member;

			this.setState({
				firstName,
				lastName,
				email,
				maxCaloriesPerDay,
				memberId,
			});
		}
	}

	toggleEditMode() {
		this.setState(state => {
			return { isEditMode: !state.isEditMode };
		});
	}

	handleEditClick = event => {
		event.preventDefault();
		this.toggleEditMode();
	};

	handleCancelClick = event => {
		event.preventDefault();
		const { firstName, lastName, maxCaloriesPerDay, email } =
			this.props.member || {};
		this.setState(
			{ firstName, lastName, maxCaloriesPerDay, email },
			this.toggleEditMode,
		);
	};

	handleSaveClick = event => {
		event.preventDefault();
		const {
			firstName,
			lastName,
			maxCaloriesPerDay,
			email,
			memberId,
		} = this.state;

		this.props.updateMember({
			memberId,
			firstName,
			lastName,
			maxCaloriesPerDay,
			email,
		});

		this.toggleEditMode();
	};

	handleDeleteClick = event => {
		event.preventDefault();
		const { memberId } = this.state;
		const { userId } = this.props;
		const isDeletingSelf = memberId === userId;
		this.props.deleteMember({ memberId, isDeletingSelf });
	};

	handleFieldChange = (config, event) => {
		this.setState({
			[config.name]: event.target.value,
		});
	};

	renderFieldSets() {
		const { isEditMode } = this.state;

		const fieldSets = fieldConfigs.map(config => {
			const { placeholder, type, name } = config;
			const fieldValue = this.state[name];

			return (
				<div className={styles.fieldSet} key={name}>
					<label className={styles.label}>{placeholder}:</label>
					{isEditMode ? (
						<input
							type={type}
							name={name}
							placeholder={placeholder}
							value={fieldValue}
							onChange={event => {
								this.handleFieldChange(config, event);
							}}
						/>
					) : (
						<span className={styles.value}>{fieldValue}</span>
					)}
				</div>
			);
		});

		return fieldSets;
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

		const { isEditMode, firstName, lastName, memberId } = this.state;

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
				{this.renderFieldSets()}
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
