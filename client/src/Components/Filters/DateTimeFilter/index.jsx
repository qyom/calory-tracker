import React from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import classnames from 'classnames';
import styles from './styles.module.scss';
import './styles.scss'

export default function DateTimeFilter(props) {
	const { onFilterChange, dateTimeRange, onFilter, onReset }  = props;

	return (	
		<div className={styles.Filters}>
			<div className={styles.labelGroup}> 
				<label className={styles.filterLabel}>from</label>
				<label className={styles.filterLabel}>to</label>
			</div>
			<DateTimeRangePicker 
				onChange={onFilterChange}
				value={dateTimeRange}
				disableClock={true}
				calendarIcon={null}
				clearIcon={null}
			/>
			<div className={styles.filterControls}>
				<button className={classnames(styles.cntlBtn, styles.primaryBtn)}
					onClick={onFilter}>
					Filter
				</button>
				<button className={classnames(styles.cntlBtn, styles.secondaryBtn)}
					onClick={onReset}>
					Reset
				</button>
			</div>
		</div>
	)
}