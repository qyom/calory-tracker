import React from 'react';
import styles from './styles.module.scss';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import ButtonGroup from 'Components/ButtonGroup';

import _ from "lodash";

export default function Modal(props) {

	const createModal = () => {
		const errors = _.get(props, 'state.error.data', null);

		return (
			<div className={styles.modalWrapper}>
				<div className={styles.modalBody}>
			 		<h3 className={styles.modalTitle}> {props.title} </h3> 
			 		<div className={styles.modalContent}> {props.body} </div>
					 {errors ? 
						<div className={styles.errorBox}>
							{Object.values(errors).map(err=>err.join(null)).map((err,index)=>(
							<div key={index}>{err}</div>
							))}
						</div>
					: null}
					{ props.controls ?
						<div className={styles.modalControls}>
							<ButtonGroup controls={props.controls}
								 processing={props.state &&props.state.processing}
						 	/>
						</div>
						: null
					}
			 	
			 	</div>
			</div>
		)
	}


	if(props.isVisible) {
		return ReactDOM.createPortal(createModal(),document.getElementById('root'))
	} else {
		return null;
	}
}