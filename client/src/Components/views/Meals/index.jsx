import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { Link, Redirect } from 'react-router-dom';
import MealGroup from './MealGroup';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MealGroupHeaders from './MealGroupHeaders';
import Modal from 'Components/Modals';
import ViewHeader from 'Components/ViewHeader';
import DateTimeRangeFilter from 'Components/Filters/DateTimeFilter';
import groupMealsByPeriod from 'Utils/groupMealsByPeriod';
import Spinner from 'Components/Spinner';
import { fetchMeals, addMeal, fetchMember } from 'Actions';
import { memberPropTypes } from 'Components/views/Account';
import { mealPropTypes } from 'Components/views/Meals/MealGroup/MealGroupDetails/Meal';
import ControlledFields from 'Components/ControlledFields';
import fieldConfigs from 'Components/views/Meals/fieldConfigs';
import moment from 'moment';
import getIfAllowed, {
	OPERATION_TYPES,
	RESOURCE_TYPES,
} from 'Utils/getIfAllowed';

class Meals extends Component {
	state = {
		dateRange: null,
		timeRange: null,
		intakeDateFrom: null,
		intakeDateTo: null,
		intakeHoursFrom: null,
		intakeHoursTo: null,
		isModalVisible: false,
		newMealWasAdded: false
	};

	static propTypes = {
		meals: PropTypes.arrayOf(mealPropTypes),
		control: PropTypes.object,
		member: memberPropTypes,
		match: PropTypes.shape({
			params: PropTypes.shape({
				memberId: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
		user: memberPropTypes,
	};

	componentDidMount() {
		const { fetchMeals, fetchMember, member, match } = this.props;
		const { memberId } = match.params;
		if (!member) {
			fetchMember({ memberId });
		}
		fetchMeals({ memberId });
	}
	componentDidUpdate(prevProps) {
		const { processing, error } = this.props.control.add;
		const newMealWasAdded = this.state.isModalVisible &&
			prevProps.control.add.processing &&
			!processing &&
			_.isEmpty(error.data);
		if (newMealWasAdded) {
			this.toggleAddModal();
			this.setState({newMealWasAdded});
		}		
	}

	renderMealGroupList() {
		const { meals, member } = this.props;
		const mealGroups = groupMealsByPeriod(meals);
		console.log("grouped meals", mealGroups, "From meals", meals);

		return (
			<ul className={styles.MealGroupList}>
				<MealGroupHeaders />
				{mealGroups.map((mealGroup, index) => (
					<MealGroup
						meals={mealGroup}
						key={index}
						rowClassName={styles.row}
						cellClassName={styles.cell}
						maxCaloriesPerDay={member.maxCaloriesPerDay}
					/>
				))}
			</ul>
		);
	}

	renderMessages()
	{
		return (
			<div>
			{this.state.newMealWasAdded ? <div className={styles.successMsg}>New meal was added!</div> : null}
			</div>
		);
	}

	onDateRangeChange = dateRange => {
		const from = dateRange && dateRange[0],
			to = dateRange && dateRange[1];
		const intakeDateFrom = from && moment(from).format('YYYY-MM-DD'),
			intakeDateTo = to && moment(to).format('YYYY-MM-DD');
		this.setState({ intakeDateFrom, intakeDateTo, dateRange });
	};

	getHour(hour) {
		if (hour[0] === '0') {
			hour = hour.slice(1, 2);
		} else {
			hour = hour.slice(0, 2);
		}
		return hour;
	}

	onTimeRangeChange = timeRange => {
		const from = timeRange && timeRange[0],
			to = timeRange && timeRange[1];
		const intakeHoursFrom = from && this.getHour(from),
			intakeHoursTo = to && this.getHour(to);
		this.setState({ intakeHoursFrom, intakeHoursTo, timeRange });
	};

	handleResetClick = () => {
		this.setState({
			intakeDateFrom: null,
			intakeDateTo: null,
			intakeHoursFrom: null,
			intakeHoursTo: null,
			dateRange: null,
			timeRange: null,
		});
		const { memberId } = this.props.match.params;
		this.props.fetchMeals({ memberId });
	};

	handleFilterClick = () => {
		const {
			intakeDateFrom,
			intakeDateTo,
			intakeHoursFrom,
			intakeHoursTo,
		} = this.state;
		const { memberId } = this.props.match.params;
		console.log(
			'CALL FILTER API',
			intakeDateFrom + ' / ' + intakeDateTo,
			intakeHoursFrom + ' - ' + intakeHoursTo,
		);
		this.props.fetchMeals(
			{ memberId },
			{
				intakeDateFrom,
				intakeDateTo,
				intakeHoursFrom,
				intakeHoursTo,
			},
		);
	};

	toggleAddModal = () => {
		const isModalVisible = !this.state.isModalVisible;
		this.setState({ isModalVisible });
	};

	handleNewMealSubmit = (e) => {
		e.preventDefault();
		const fieldValues = this.getFieldValues();
		console.log('submitting a new meal', fieldValues);
		this.props.addMeal(this.props.member, fieldValues);

	};
	setupFieldsDataExternalControlers = (getFieldValues, setFieldValues) => {
		this.getFieldValues = getFieldValues;
		this.setFieldValues = setFieldValues;
	};

	get isThisPageAllowed() {
		const { user } = this.props;
		const isSeeingOthersMealsAllowed = getIfAllowed({
			role: user.roleType,
			resource: RESOURCE_TYPES.MEAL,
			operation: OPERATION_TYPES.READ,
		});

		return this.isMemberTheUser || isSeeingOthersMealsAllowed;
	}

	get isMemberTheUser() {
		const { user, routeMemberId } = this.props;
		return routeMemberId === user.memberId;
	}

	render() {
		const { meals, member, control } = this.props;

		if (!this.isThisPageAllowed) {
			return <Redirect to={`/`} />;
		}

		if (!meals || !member) {
			return <Spinner />;
		}

		let headerMessage = `${member.firstName} ${member.lastName}'s meals`;
		if (this.isMemberTheUser) {
			headerMessage = 'My meals';
		}
		return (
			<div className={styles.Meals}>
				<ViewHeader>
					{headerMessage}
					<Link
						to={`/members/${member.memberId}`}
						className={classnames(styles.linkBtn, styles.cntlBtn)}
					>
						(View account)
					</Link>
					<div className={styles.pageCntls}>
						<button
							onClick={this.toggleAddModal}
							className={classnames(styles.cntlBtn, styles.primaryBtn)}
						>
							Add Meal
						</button>
					</div>
					{this.renderMessages()}
				</ViewHeader>
				<DateTimeRangeFilter
					onDateRangeChange={this.onDateRangeChange}
					onTimeRangeChange={this.onTimeRangeChange}
					dateRange={this.state.dateRange}
					timeRange={this.state.timeRange}
					onFilter={this.handleFilterClick}
					onReset={this.handleResetClick}
				/>

				{this.renderMealGroupList()}
				<Modal
					isVisible={this.state.isModalVisible}
					title={'Add New Meal'}
					body={
						<ControlledFields
							fieldConfigs={fieldConfigs}
							setupFieldsDataExternalControlers={
								this.setupFieldsDataExternalControlers
							}
							controls={[
								{
									text: 'Add',
									primary: true,
									type: 'submit'
								},
								{ text: 'Cancel', onClick: this.toggleAddModal }
							]}
							onSubmit={this.handleNewMealSubmit}
							state={control.add}
						/>
					}

					state={control.add}
				/>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const { meals, members, user } = state;

	const { memberId: routeMemberId } = ownProps.match.params;
	const member = members.data.find(member => member.memberId === routeMemberId);
	return {
		meals: meals.data[routeMemberId],
		control: meals.control,
		member,
		user: user.data,
		routeMemberId,
	};
}

export default connect(mapStateToProps, { fetchMeals, fetchMember, addMeal })(
	Meals,
);
