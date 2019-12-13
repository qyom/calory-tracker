import React from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import Spinner from '../Spinner';

export default function ButtonGroup(props) {
	const {processing} = props;

	return (
		<React.Fragment>

		{  props.controls ? 
			processing  ? <Spinner small={true} />
			: props.controls.map((control, i) => {
				const { primary, ... attributes } = control;
				const btn = primary ?  styles.primaryBtn : styles.secondaryBtn
				return (
					<button key={i} className={classnames(styles.cntlBtn, btn)}  {...attributes}>  
						{ control.text }
					</button> 
				)
			})
			: null
		}

		</React.Fragment>
	)
}