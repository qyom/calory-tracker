import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import MealGroup from './MealGroup';
import MealGroupHeaders from './MealGroupHeaders';
import ViewHeader from 'Components/ViewHeader';
import groupMealsByPeriod from 'Utils/groupMealsByPeriod';
import Spinner from 'Components/Spinner';
import { fetchMeals, fetchMember } from 'Actions';
import PropTypes from 'prop-types';
import { memberPropTypes } from 'Components/views/Account';
import { mealPropTypes } from 'Components/views/Meals/MealGroup/MealGroupDetails/Meal';

class Meals extends Component {
	static propTypes = {
		meals: PropTypes.arrayOf(mealPropTypes),
		member: memberPropTypes,
		match: PropTypes.shape({
			params: PropTypes.shape({
				memberId: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
		userId: PropTypes.string.isRequired,
	};
	componentDidMount() {
		const { fetchMeals, fetchMember, member, match } = this.props;
		const { memberId } = match.params;
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

		let headerMessage = `${member.firstName} ${member.lastName}'s meals`;
		if (member.memberId === userId) {
			headerMessage = 'My meals';
		}
		return (
			<div className={styles.Meals}>
				<ViewHeader>
					{headerMessage}
					<Link to={`/members/${member.memberId}`}>(View account)</Link>
				</ViewHeader>
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
