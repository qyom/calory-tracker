import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { fetchMembers, createMember } from 'Actions';
import ViewHeader from 'Components/ViewHeader';
import Modal from 'Components/Modals';
import ControlledFields from 'Components/ControlledFields';
import fieldConfigs from 'Components/views/Account/fieldConfigs';
import { memberPropTypes } from 'Components/views/Account';
import getIfAllowed, {
	OPERATION_TYPES,
	RESOURCE_TYPES,
	ROLE_TYPES,
} from 'Utils/getIfAllowed';
import styles from './styles.module.scss';

const roleOptions = {
	[ROLE_TYPES.ADMIN]: [
		ROLE_TYPES.ADMIN,
		ROLE_TYPES.MANAGER,
		ROLE_TYPES.REGULAR,
	],
	[ROLE_TYPES.MANAGER]: [ROLE_TYPES.MANAGER, ROLE_TYPES.REGULAR],
	[ROLE_TYPES.REGULAR]: [ROLE_TYPES.REGULAR],
};

class Members extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
			memberSaved: false
		};
	}

	static propTypes = {
		members: PropTypes.arrayOf(memberPropTypes),
		user: memberPropTypes,
	};

	componentDidMount(prevProps) {
		this.props.fetchMembers();
	}
	componentDidUpdate(prevProps){
		// Handle the modal
		const { processing, error } = this.props.control.save;
		const memberSaved = this.state.isModalVisible &&
			prevProps.control.save.processing &&
			!processing &&
			_.isEmpty(error.data);
			console.log("member is saved", memberSaved);
		if (memberSaved) {
			this.toggleAddModal();
			this.setState({memberSaved});
		}
	}

	handleMemberClick = memberId => {
		const { user } = this.props;
		const isTargetMemberTheUser = memberId === user.memberId;
		const isUserAdmin = user.roleType === ROLE_TYPES.ADMIN;
		let path = `/members/${memberId}`;
		if (isTargetMemberTheUser || isUserAdmin) {
			path = `/meals/${memberId}`;
		}
		this.props.history.push(path);
	};

	renderMembers() {
		return this.props.members.map(member => {
			return (
				<tr
					onClick={event => {
						this.handleMemberClick(member.memberId);
					}}
					key={member.memberId}
					className={styles.tr}
				>
					<td className={styles.td}>
						{member.firstName} {member.lastName}
					</td>
					<td className={styles.td}>{member.email}</td>
					<td className={styles.td}>{member.roleType}</td>
				</tr>
			);
		});
	}

	setupFieldsDataExternalControlers = (getFieldValues, setFieldValues) => {
		this.getFieldValues = getFieldValues;
		this.setFieldValues = setFieldValues;
	};

	handleAddMemberClick = (e) => {
		e.preventDefault();
		let updatedMember = this.getFieldValues();
		this.props.createMember(updatedMember);
	};

	toggleAddModal = () => {
		const isModalVisible = !this.state.isModalVisible;
		this.setState({ isModalVisible });
	};

	get isThisPageAllowed() {
		const { user } = this.props;
		return getIfAllowed({
			role: user.roleType,
			resource: RESOURCE_TYPES.MEMBER,
			operation: OPERATION_TYPES.READ,
		});
	}
	renderMessages()
	{
		return (
			<div>
			{this.state.memberSaved ? <div className={styles.successMsg}> Member was saved!</div> : null}
			</div>
		);
	}

	render() {
		if (!this.isThisPageAllowed) {
			return <Redirect to="/" />;
		}
		const { isModalVisible } = this.state;
		
		return (
			<div className={styles.Members}>
				<ViewHeader>
					Users
					<div className={styles.pageCntls}>
						<button
							onClick={this.toggleAddModal}
							className={classnames(styles.cntlBtn, styles.primaryBtn)}
						>
							Add User
						</button>
					</div>
					{this.renderMessages()}
				</ViewHeader>
				<table className={styles.table}>
					<thead className={styles.thead}>
						<tr>
							<th className={styles.th}>Name</th>
							<th className={styles.th}>Email</th>
							<th className={styles.th}>Role</th>
						</tr>
					</thead>
					<tbody>{this.renderMembers()}</tbody>
				</table>
				<Modal
					isVisible={isModalVisible}
					title={'Create New User'}
					body={
						<ControlledFields
							fieldConfigs={fieldConfigs}
							setupFieldsDataExternalControlers={
								this.setupFieldsDataExternalControlers
							}
							fieldOptions={{ roleType: roleOptions[this.props.user.roleType] }}
							controls={[
								{ text: 'Add', primary: true, type: 'submit' },
								{ text: 'Cancel', onClick: this.toggleAddModal },
							]}
							state={this.props.control.save}
							onSubmit={this.handleAddMemberClick}
						/>
					}
					state={this.props.control.save}				
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { members, user } = state;
	return { members:members.data, control:members.control, user: user.data };
}
export default connect(mapStateToProps, { fetchMembers, createMember })(
	Members
);
