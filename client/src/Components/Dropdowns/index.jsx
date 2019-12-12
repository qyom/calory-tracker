import React from 'react';
import styles from './styles.module.scss';

export default function DropdownSelect(props) {

	return (
		<div className={styles.input, styles.select}> 
			<div className={styles.value}>{props.value}</div>
			{ props.showOptions ? 
				<div className={styles.options}>
					{props.options && props.options.map((option)=>{
						return (
							 <div onClick={()=>props.handleChange(option.value)}>
								{option.name}
							</div>
						)
					})}
				</div>
				: null
			}
		</div>
	)
}