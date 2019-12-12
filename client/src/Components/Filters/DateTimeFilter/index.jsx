import React from 'react';
import DateRange from 'Components/Filters/DateRange';
import TimeRange from 'Components/Filters/TimeRange';
import classnames from 'classnames';
import styles from './styles.module.scss';

export default function DateTimeFilter(props) {
	const {
		onDateRangeChange,
		onTimeRangeChange,
		dateRange,
		timeRange,
		onFilter,
		onReset,
	} = props;

	return (
		<div className={styles.Filters}>
			<div className={styles.labelGroup}>
				<label className={styles.filterLabel}>Date</label>
				<label className={styles.filterLabel}>Time</label>
			</div>
			<div className={styles.labelSecondaryGroup}>
				<label className={styles.filterLabel}>
					<span className={styles.filterLabelDate}>from</span>
					<span className={styles.filterLabelTime}>to</span>
				</label>
				<label className={styles.filterLabel}>
					<span className={styles.filterLabelDate}>from</span>
					<span className={styles.filterLabelTime}>to</span>
				</label>
			</div>
			<div className={styles.DateTimeFilterGroup}>
				<DateRange
					onChange={onDateRangeChange}
					value={dateRange}
					disableClock={true}
					calendarIcon={null}
					clearIcon={null}
				/>
				<TimeRange
					onChange={onTimeRangeChange}
					value={timeRange}
					disableClock={true}
					calendarIcon={null}
					clearIcon={null}
				/>
			</div>
			<div className={styles.filterControls}>
				<button
					className={classnames(styles.cntlBtn, styles.primaryBtn)}
					onClick={onFilter}
				>
					Filter
				</button>
				<button
					className={classnames(styles.cntlBtn, styles.secondaryBtn)}
					onClick={onReset}
				>
					Reset
				</button>
			</div>
		</div>
	);
}
