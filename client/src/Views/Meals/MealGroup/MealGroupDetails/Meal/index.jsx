import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

library.add(faEdit, faSave);

export const mealPropsTypes = {
	calories: PropTypes.number.isRequired,
	dateIntake: PropTypes.object.isRequired,
	dateCreated: PropTypes.object.isRequired,
	mealId: PropTypes.string.isRequired,
	memberId: PropTypes.string.isRequired,
	name: PropTypes.string,
};

export const mealDefaultProps = {
	name: '',
};

export default class Meal extends Component {
	constructor(props) {
		super(props);
		const { calories, dateIntake, name } = this.props;
		this.state = {
			editMode: false,
			calories,
			dateIntake,
			name,
		};
	}

	toggleEditMode = () => {
		let editMode = !this.state.editMode;
		this.setState({ editMode });
	};

	render() {
		const { calories, dateIntake, name, editMode } = this.state;

		return (
			<Fragment>
				<ul className={styles.row}>
					<li className={classnames(styles.cell)}>
						{editMode ? <input /> : moment(dateIntake).format('h:MM a')}
					</li>
					<li className={classnames(styles.cell)}>
						{editMode ? <input /> : name}
					</li>
					<li className={classnames(styles.cell)}>
						{editMode ? <input /> : calories}
					</li>
				</ul>
			</Fragment>
		);
	}
}

Meal.propTypes = mealPropsTypes;
Meal.defaultProps = mealDefaultProps;
