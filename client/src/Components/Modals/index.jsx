import React from 'react';
import styles from './styles.module.scss';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Spinner from '../Spinner';

import _ from "lodash";

export default function Modal(props) {

	const createModal = () => {

		return (
			<div className={styles.modalWrapper}>
				<div className={styles.modalBody}>
			 		<h3 className={styles.modalTitle}> {props.title} </h3> 
			 		<div className={styles.modalContent}> {props.body} </div>
					 {!_.isEmpty(props.state.error) ? 
						<div className={styles.errorBox}>{Object.values(props.state.error).map(err=>err.join("")).map(err=>(
							<div>{err}</div>
						))}</div>
						: null
					 }
			 		<div className={styles.modalControls}> 
						{ 	props.state.processing
							? <Spinner small={true} />
							: props.controls.map((control, i) => {
								const btn = control.primary ? styles.primaryBtn : styles.secondaryBtn
								return <button key={i} onClick={control.onClick} className={classnames(styles.cntlBtn, btn)}>  
									{control.text} 
								</button>
							})
						}
			 		 </div>
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