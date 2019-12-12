import React, { Component } from 'react';
import _ from "lodash";
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import MealGroup from './MealGroup';
import MealGroupHeaders from './MealGroupHeaders';
import Modal from 'Components/Modals';
import ViewHeader from 'Components/ViewHeader';
import DateTimeRangeFilter from 'Components/Filters/DateTimeFilter';
import groupMealsByPeriod from 'Utils/groupMealsByPeriod';
import Spinner from 'Components/Spinner';
import { fetchMeals, addMeal, fetchMember } from 'Actions';
import PropTypes from 'prop-types';
import { memberPropTypes } from 'Components/views/Account';
import { mealPropTypes } from 'Components/views/Meals/MealGroup/MealGroupDetails/Meal';
import ControlledFields from 'Components/ControlledFields';
import fieldConfigs from 'Components/views/Meals/fieldConfigs';
import moment from 'moment';
import classnames from 'classnames';

class Meals extends Component {
	state = {
		dateRange: null,
		timeRange: null,
		intakeDateFrom: null,
		intakeDateTo: null,
		intakeHoursFrom: null,
		intakeHoursTo: null,
		isModalVisible: false
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
	componentDidUpdate(prevProps) {
		const {processing, error} = this.props.control.add;
		if (this.state.isModalVisible && prevProps.control.add.processing && !processing && _.isEmpty(error) ) {
			this.toggleAddModal();
		}
	}

	renderMealGroupList() {
		const { meals, member } = this.props;
		const mealGroups = groupMealsByPeriod(meals);
		console.log('member---', member, 'meals -- ', meals)
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

	handleNewMealSubmit = () => {
		const fieldValues = this.getFieldValues();
		console.log("submitting a new meal", fieldValues);
		this.props.addMeal(this.props.member, fieldValues);
	}
	setupFieldsDataExternalControlers = (getFieldValues, setFieldValues) => {
		this.getFieldValues = getFieldValues;
		this.setFieldValues = setFieldValues;
	};

	render() {
		const { meals, member, userId, control } = this.props;
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
						/>
					}
					controls={[
						{ text: 'Add', primary: true, onClick: this.handleNewMealSubmit },
						{ text: 'Cancel', onClick: this.toggleAddModal },
					]}
					state={control.add}
				/>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	const { meals, members, user } = state;

	const { memberId: routeMemberId } = ownProps.match.params;
	const member = members.find(member => member.memberId === routeMemberId);
	return { meals: meals.data[routeMemberId], control: meals.control, member, userId: user.data.memberId };
}

export default connect(mapStateToProps, { fetchMeals, fetchMember, addMeal })(Meals);
