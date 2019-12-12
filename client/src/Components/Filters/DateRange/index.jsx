import React from 'react';
import styles from './styles.module.scss';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import './styles.scss';

export default function(props) {
	return (
		<div className={styles.DateRange}>
			<DateRangePicker
				onChange={props.onChange}
				value={props.value}
				calendarIcon={null}
			/>
		</div>
	);
}
