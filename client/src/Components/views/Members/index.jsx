import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMembers } from 'Actions';
import ViewHeader from 'Components/ViewHeader';
import Modal from 'Components/Modals'
import { Form } from 'Components/Forms';
import styles from './styles.module.scss';
import classnames from 'classnames';

class Members extends Component {
	constructor(props){
		super(props);
		this.state = {
			isModalVisible: false,
			email: null,
			first_name: null,
			last_name: null,
			password: null,
			confirm_password: null,
			role_type: null,
			max_calories_per_day: null
		}
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
					key={member.memberId + ''}
					className={styles.tr}
				>
					<td className={styles.td}>{member.firstName} {member.lastName}</td>
					<td className={styles.td}>{member.email}</td>
					<td className={styles.td}>{member.roleType}</td>
				</tr>
			);
		});
	}

	onMemberFieldChange = (field, e) => {
		this.setState({[field]: e.target.value})
	}

	generateAddMemberForm() {
		const { email, first_name, last_name, password,
				confirm_password, role_type, max_calories_per_day
			} = this.state;
	
		const fields = [
			{name: 'email', label: 'Email', type: 'email', onChange: this.onMemberFieldChange, required: true},
			{name: 'first_name', label: 'First name',type: 'text', onChange: this.onMemberFieldChange, required: true},
			{name: 'last_name', label: 'Last name', type: 'text', onChange: this.onMemberFieldChange, required: true},
			{name: 'password', label: 'Password', type: 'password', onChange: this.onMemberFieldChange, required: true},
			{name: 'confirm_password', label: 'Confirm password', type: 'password', onChange: this.onMemberFieldChange, required: true},
			{name: 'role_type', label: 'Role type', type: 'select', onChange: this.onMemberFieldChange, required: true},
			{name: 'max_calories_per_day', label: 'Maximum calories', type: 'number', onChange: this.onMemberFieldChange, required: true}
		]
		return (
			<Form fields={fields}/>
		)
	}

	addMember() {

	}

	toggleAddModal = () =>{
		const isModalVisible = !this.state.isModalVisible
		this.setState({isModalVisible})
	}

	render() {
		const { isModalVisible } = this.state;
 		return (
			<div className={styles.Members}>
				<ViewHeader>
					Users
					<div className={styles.pageCntls}>
						<button onClick={this.toggleAddModal}
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
				<tbody>		
					{this.renderMembers()}
				</tbody>
				</table>
				<Modal isVisible={isModalVisible}
					title={"Create New User"}
					body={this.generateAddMemberForm()}
					controls={[
						{text: 'Add', primary: true, onClick: this.addMember},
						{text: 'Cancel', onClick: this.toggleAddModal}
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
export default connect(mapStateToProps, { fetchMembers })(Members);
