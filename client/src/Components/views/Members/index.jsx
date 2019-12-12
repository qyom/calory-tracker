import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { fetchMembers, createMember } from 'Actions';
import ViewHeader from 'Components/ViewHeader';
import Modal from 'Components/Modals';
import ControlledFields from 'Components/ControlledFields';
import fieldConfigs from 'Components/views/Account/fieldConfigs';
import getRelevantMemberValues from 'Utils/getRelevantMemberValues';
import styles from './styles.module.scss';

class Members extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false,
		};
	}

	componentDidMount() {
		this.props.fetchMembers();
	}

	handleMemberClick = memberId => {
		this.props.history.push(`/meals/${memberId}`);
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

	handleAddMemberClick = () => {
		let updatedMember = this.getFieldValues();
		// updatedMember = getRelevantMemberValues(updatedMember);
		this.props.createMember(updatedMember);
		this.toggleAddModal();
	};

	toggleAddModal = () => {
		const isModalVisible = !this.state.isModalVisible;
		this.setState({ isModalVisible });
	};

	render() {
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
						/>
					}
					controls={[
						{ text: 'Add', primary: true, onClick: this.handleAddMemberClick },
						{ text: 'Cancel', onClick: this.toggleAddModal },
					]}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { members } = state;
	return { members };
}
export default connect(mapStateToProps, { fetchMembers, createMember })(
	Members,
);
