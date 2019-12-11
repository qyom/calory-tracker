import React from 'react';
import styles from './styles.module.scss'
import './styles.scss';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker'


export default function(props) {
	console.log('timerange val ---', props.value)

	return (
		<div className={styles.TimeRange}>

		   <TimeRangePicker
          		onChange={props.onChange}
          		value={props.value}
      			disableClock={true}
      			maxDetail='hour'
        	/>
		</div>
	)
}