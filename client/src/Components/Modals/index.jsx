import React from 'react';
import styles from './styles.module.scss';
import ReactDOM from 'react-dom';
import ButtonGroup from 'Components/ButtonGroup';
import ErrorBox from 'Components/ErrorBox';

import { get } from 'lodash';

export default function Modal(props) {
	const createModal = () => {
		const errors = get(props, 'state.error', null);
		console.log("props inside Modal", props, props.state && props.state.processing);
		return (
			<div className={styles.modalWrapper}>
				<div className={styles.modalBody}>
					<h3 className={styles.modalTitle}> {props.title} </h3>
					<div className={styles.modalContent}> {props.body} </div>
					<ErrorBox errors={errors} />
					{props.controls ? (
						<div className={styles.modalControls}>
							<ButtonGroup
								controls={props.controls}
								processing={props.state && props.state.processing}
							/>
						</div>
					) : null}
				</div>
			</div>
		);
	};

	if (props.isVisible) {
		return ReactDOM.createPortal(
			createModal(),
			document.getElementById('root'),
		);
	} else {
		return null;
	}
}
