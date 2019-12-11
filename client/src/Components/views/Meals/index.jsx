import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import MealGroup from './MealGroup';
import MealGroupHeaders from './MealGroupHeaders';
import ViewHeader from 'Components/ViewHeader';
import DateTimeRangeFilter from 'Components/Filters/DateTimeFilter';
import groupMealsByPeriod from 'Utils/groupMealsByPeriod';
import Spinner from 'Components/Spinner';
import { fetchMeals, fetchMember } from 'Actions';
import PropTypes from 'prop-types';
import { memberPropTypes } from 'Components/views/Account';
import { mealPropTypes } from 'Components/views/Meals/MealGroup/MealGroupDetails/Meal';
import moment from 'moment';

class Meals extends Component {
	state = {
		dateRange: null,
		timeRange: null,
		intake_date_from: null,
		intake_date_to: null,
		intake_hours_from: null,
		intake_hours_to: null,
	};

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
			<ul className={styles.MealGroupList}>
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

	onDateRangeChange = dateRange => {
		const from =  dateRange && dateRange[0],
			to = dateRange && dateRange[1]; 
		const intake_date_from = from && moment(from).format('YYYY-MM-DD'),
			intake_date_to = to && moment(to).format('YYYY-MM-DD');
		this.setState({intake_date_from, intake_date_to, dateRange});
	}

	getHour(hour){
		if(hour[0] === '0') {
			hour = hour.slice(1, 2);
		} else {
			hour = hour.slice(0, 2);
		}
		return hour;
	}

	onTimeRangeChange = timeRange => {
		const from = timeRange && timeRange[0],
			to = timeRange && timeRange[1];
		const intake_hours_from = from && this.getHour(from),
			intake_hours_to = to && this.getHour(to);
		this.setState({intake_hours_from, intake_hours_to, timeRange})
	}

	resetFilter = () => {
		this.setState({
			intake_date_from: null,
			intake_date_to: null,
			intake_hours_from: null,
			intake_hours_to: null,
			dateRange: null,
			timeRange: null
		});
	};

	filterMeals = () => {
		const {
			intake_date_from,
			intake_date_to,
			intake_hours_from,
			intake_hours_to,
		} = this.state;
		console.log('CALL FILTER API', intake_date_from +'/' +intake_date_to, intake_hours_from + '-' +intake_hours_to );
	};

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
				<DateTimeRangeFilter
					onDateRangeChange={this.onDateRangeChange}
					onTimeRangeChange={this.onTimeRangeChange}
					dateRange={this.state.dateRange}
					timeRange={this.state.timeRange}
					onFilter={this.filterMeals}
					onReset={this.resetFilter}
				/>

				{this.renderMealGroupList()}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const { allMeals, members, user } = state;

	const { memberId: routeMemberId } = ownProps.match.params;
	const member = members.find(member => member.memberId === routeMemberId);

	return { meals: allMeals[routeMemberId], member, userId: user.data.memberId };
}

export default connect(mapStateToProps, { fetchMeals, fetchMember })(Meals);
