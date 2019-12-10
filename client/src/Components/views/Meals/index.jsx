import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import MealGroup from './MealGroup';
import MealGroupHeaders from './MealGroupHeaders';
import ViewHeader from 'Components/ViewHeader';
import DateTimeRangeFilter from 'Components/Filters/DateTimeFilter'
import groupMealsByPeriod from 'Utils/groupMealsByPeriod';
import Spinner from 'Components/Spinner';
import { fetchMeals, fetchMember } from 'Actions';
import PropTypes from 'prop-types';
import { memberPropTypes } from 'Components/views/Account';
import { mealPropTypes } from 'Components/views/Meals/MealGroup/MealGroupDetails/Meal';
import moment from 'moment';

class Meals extends Component {
		constructor(props){
			super(props);
			this.state = {
				dateTimeRange: [null, null],
				intake_date_from: null,
    			intake_date_to: null,
    			intake_hours_from: null,
    			intake_hours_to: null
			}
		}

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

	onFilterChange = (dateTimeRange) => {
		console.log('dateTimeRange', dateTimeRange)
		const from = dateTimeRange[0],
			to = dateTimeRange[1],
		 	intake_date_from = moment(from).format("YYYY-MM-DD"),
			intake_date_to = moment(from).format("YYYY-MM-DD"),
			intake_hours_from = from.getHours(),
			intake_hours_to =  to.getHours();
		this.setState({
			dateTimeRange, 
			intake_date_from,
		 	intake_date_to, 
		 	intake_hours_from, 
		 	intake_hours_to }, ()=>{
		 	console.log('STATE---', this.state)
		 })
	} 

	resetFilter = () => {
		this.setState({
			intake_date_from: null,
		 	intake_date_to: null,
		 	intake_hours_from: null, 
		 	intake_hours_to: null,
		 	dateTimeRange: [null, null] 
		 })
	}

	filterMeals = () => {
		const { intake_date_from,
		 	intake_date_to, 
		 	intake_hours_from, 
		 	intake_hours_to }  = this.state;
		console.log('CALL FILTER API') 	
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
				<DateTimeRangeFilter 
					onFilterChange={this.onFilterChange} 
					dateTimeRange={this.state.dateTimeRange}
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

	return { meals: allMeals[routeMemberId], member, userId: user.memberId };
}

export default connect(mapStateToProps, { fetchMeals, fetchMember })(Meals);
