import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';
import moment from 'moment';

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

export default function Meal(props) {
	const { calories, date, name } = props;

	return (
		<div className={styles.row}>
			<div className={classnames(styles.cell, styles.date)}>
				{moment(date).format('YYYY-MM-DD HH:MM')}
			</div>
			<div className={classnames(styles.cell, styles.name)}>{name}</div>
			<div className={classnames(styles.cell, styles.calories)}>{calories}</div>
		</div>
	);
}

Meal.propTypes = mealPropsTypes;
Meal.defaultProps = mealDefaultProps;
