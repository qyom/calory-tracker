import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'Components/Modals';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';
import './styles.module.scss';
import './styles.scss';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faSave, faTrashAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faEdit, faSave, faTrashAlt, faTimesCircle);

const mealPropTypesShape = {
	calories: PropTypes.number.isRequired,
	dateIntake: PropTypes.object.isRequired,
	dateCreated: PropTypes.object.isRequired,
	mealId: PropTypes.string.isRequired,
	memberId: PropTypes.string.isRequired,
	name: PropTypes.string,
};

export const mealPropTypes = PropTypes.shape(mealPropTypesShape);

export const mealDefaultPropsShape = {
	name: '',
};

export default class Meal extends Component {
	constructor(props) {
		super(props);
		const { calories, dateIntake, name, id } = this.props;
		this.state = {
			editMode: false,
			calories,
			dateIntake,
			name,
			isModalVisible: false
		};
	}

	toggleEditMode = () => {
		let editMode = !this.state.editMode;
		this.setState({ editMode });
	};

	selectDataTime = (dateIntake) => {
		this.setState({dateIntake})
	}

	onMealDetailEdit = (key, event) => {
		this.setState({[key]: event.target.value})
	}

	saveMealDetails = () => {
		console.log('CALL SAVE API')
		this.toggleEditMode();
	}

	deleteMeal = () => {
		console.log('DELETE MEAL');
		this.setState({isModalVisible: false})
	}

	toggleDeleteModal = () =>{
		const isModalVisible = !this.state.isModalVisible
		this.setState({isModalVisible})
	}

	render() {
		const { calories, dateIntake, name, editMode, isModalVisible } = this.state;
		const editIcon = editMode ? 'save' : 'edit';
		const deleteIcon = editMode ? 'times-circle' : 'trash-alt';
		const editBtnStyle = editMode ? styles.mealSaveBtn : styles.mealEditBtn;
		const cellStyle = editMode ? styles.cellDetailEdit : styles.cellDetail;
		const editAction = editMode ?  this.saveMealDetails : this.toggleEditMode;
		const cancelDeleteAction = editMode ? this.toggleEditMode : this.toggleDeleteModal
		return (
			<Fragment>
				<ul className={styles.row}>
					<li className={classnames(cellStyle, styles.date)}>
						{editMode ? 
							<DateTimePicker className='detailInput' 
							value={dateIntake} onChange={this.selectDataTime}
							disableClock={true}
							calendarIcon={null}
							clearIcon={null}
							/>
							: moment(dateIntake).format('h:MM a')}
					</li>
					<li className={classnames(cellStyle,  styles.name)}>
						{ editMode ? 
							<input type='text'className={styles.detailInput} value={name}
								onChange={this.onMealDetailEdit.bind(this, 'name')}
							/> 
							: name}
					</li>
					<li className={classnames(cellStyle, styles.calory)}>
						{editMode ? 
							<input type='number' className={styles.detailInput} value={calories}
								onChange={this.onMealDetailEdit.bind(this, 'calories')}
							/> 
							: calories}
					</li>
					<li className={classnames(styles.editBtnGroup)}>
						<FontAwesomeIcon icon={editIcon} className="detail-icon"  
							onClick={editAction}/>
						<FontAwesomeIcon icon={deleteIcon} className="detail-icon" 
							onClick={cancelDeleteAction}/>
					</li>
				</ul>
				<Modal isVisible={isModalVisible}
					title={"Delete " +  name + " from list?"}
					controls={[
						{text: 'Yes', primary: true, onClick:this.deleteMeal},
						{text: 'No', onClick: this.toggleDeleteModal}
					]}
			 	/>
			</Fragment>
		);
	}
}

Meal.propTypes = mealPropTypesShape;
Meal.defaultProps = mealDefaultPropsShape;
