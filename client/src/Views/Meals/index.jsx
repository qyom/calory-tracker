import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import MealGroup from './MealGroup';
import MealGroupHeaders from './MealGroupHeaders';
import groupMealsByPeriod from 'Utils/groupMealsByPeriod';
import Spinner from 'Components/Spinner';
import { fetchMeals, fetchMember } from 'Actions/actionCreators';
import propTypes from 'prop-types';

// const member = {
// 	id: 'mr10',
// 	name: 'Johnson Bronson',
// 	role: 'user',
// 	email: 'email@email.com',
// };

class Meals extends Component {
	static propTypes = {
		meals: propTypes.array,
		// memberId: propTypes.string.isRequired,
	};
	componentDidMount() {
		const { fetchMeals, fetchMember, member, match } = this.props;
		const { memberId } = match.params;
		// const { memberId } = member;
		if (!member) {
			fetchMember({ memberId });
		}
		fetchMeals({ memberId });
	}
	renderMealGroupList() {
		const { meals } = this.props;
		const mealGroups = groupMealsByPeriod(meals);
		return (
			<ul className={styles.mealGroupList}>
				<MealGroupHeaders />
				{mealGroups.map((mealGroup, index) => (
					<MealGroup
						meals={mealGroup}
						key={index}
						rowClassName={styles.row}
						cellClassName={styles.cell}
					/>
				))}
			</ul>
		);
	}
	render() {
		const { meals, member, userId } = this.props;
		if (!meals || !member) {
			return <Spinner />;
		}
		return (
			<div className={styles.Meals}>
				{member && member.memberId !== userId && (
					<h1 className={styles.tableName}>{`${member.firstName}'s meals`}</h1>
				)}
				{this.renderMealGroupList()}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const { allMeals, members, user } = state;

	const { memberId: routeMemberId } = ownProps.match.params;
	const member = members.find(member => member.memberId === routeMemberId);

	return { meals: allMeals[routeMemberId], member, userId: user.memberId };
}

export default connect(mapStateToProps, { fetchMeals, fetchMember })(Meals);
