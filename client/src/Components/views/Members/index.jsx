import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMembers } from 'Actions';
// import styles from './styles.module.scss';

class Members extends Component {
	componentDidMount() {
		this.props.fetchMembers();
	}
	handleMemberClick = memberId => {
		this.props.history.push(`/meals/${memberId}`);
	};
	renderMembers() {
		return this.props.members.map(member => {
			return (
				<div
					onClick={event => {
						this.handleMemberClick(member.memberId);
					}}
					key={member.memberId + ''}
				>
					{member.firstName}
				</div>
			);
		});
	}
	render() {
		return (
			<div>
				<h1>Users</h1>
				{this.renderMembers()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { members } = state;
	return { members };
}
export default connect(mapStateToProps, { fetchMembers })(Members);
