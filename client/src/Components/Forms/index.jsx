import React from 'react';
import styles from './styles.module.scss';
import classnames from 'classnames';

export  function Form (props) {
	return (
		<form className={styles.form}>
			{ 	props.fields.map((field)=>{
				const  {label, ...attributes} = field;
					return (
						<label className={styles.label}> 
							<span className={styles.labelName}>{field.label}</span>
							<input {...attributes}
								onChange={(e)=> field.onChange(field.name, e)} 
								key={field.name} 
								className={classnames(styles[field.type], styles.input)}/>
						</label>
					)
						
				}) 
			}
		</form>
	)
}