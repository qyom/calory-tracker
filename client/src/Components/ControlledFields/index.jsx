import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';
import DateTimePicker from 'react-datetime-picker';
import ButtonGroup from 'Components/ButtonGroup';

import { isFunction } from 'lodash';

const customInputs = {
	dateTime: 'dateTime',
	select: 'select'
};

export default class ControlFields extends Component {
	static propTypes = {
		fieldValues: PropTypes.object,
		fieldConfigs: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				type: PropTypes.string,
				label: PropTypes.string,
				isValueHidden: PropTypes.bool,
			}),
		).isRequired,
		isEditMode: PropTypes.bool,
		setupFieldsDataExternalControlers: PropTypes.func.isRequired,
	};

	static defaultProps = {
		isEditMode: true,
		fieldValues: {},
	};

	prepareFieldsState(fieldValues) {
		const { fieldConfigs } = this.props;
		const fieldsState = fieldConfigs.reduce((fieldsState, config) => {
			const { name } = config;
			fieldsState[name] = fieldValues[name] || config.defaultValue || '';
			return fieldsState;
		}, {});
		return fieldsState;
	}

	constructor(props) {
		super(props);
		const { fieldValues } = props;

		const fieldsState = this.prepareFieldsState(fieldValues);
		this.state = { ...fieldsState };

		this.getFieldValues = this.getFieldValues.bind(this);
		this.setFieldValues = this.setFieldValues.bind(this);
	}
	componentDidMount() {
		this.props.setupFieldsDataExternalControlers(
			this.getFieldValues,
			this.setFieldValues,
		);
	}

	getFieldValues() {
		return { ...this.state };
	}
	setFieldValues(fieldsData, callback) {
		const fieldsState = this.prepareFieldsState(fieldsData);
		if (isFunction(callback)) {
			this.setState(fieldsState, callback);
		}
		this.setState(fieldsState);
	}
	handleFieldChange = (config, event) => {
		this.setState({
			[config.name]: customInputs[config.type] ? event : event.target.value,
		});
	};

	renderFieldSets() {
		const { fieldConfigs, isEditMode, fieldOptions } = this.props;
		const fieldSets = fieldConfigs.map(config => {
			const {
				isValueHidden,
				label,
				type = 'text',
				name,
				defaultValue,
				...attributes
			} = config;
			const fieldValue = this.state[name];
			let input = <span className={styles.value}>{fieldValue}</span>;
			if (isEditMode) {
				input = (
					<input
						{...attributes}
						name={name}
						type={type}
						value={fieldValue}
						onChange={event => {
							this.handleFieldChange(config, event);
						}}
						className={classnames(styles[type], styles.input)}
					/>
				);
			} else if (isValueHidden) {
				input = (
					<span className={styles.value}>
						{' '}
						<span className={styles.box} />{' '}
					</span>
				);
			}

			if (type === 'dateTime') {
				input = (
					<DateTimePicker
						className="detailInput"
						value={fieldValue}
						onChange={event => {
							this.handleFieldChange(config, event);
						}}
						disableClock={true}
						calendarIcon={null}
						clearIcon={null}
					/>
				);
			}

			if(type === 'radioGroup' && isEditMode) {
				input =  (
					<fieldset className={styles.input}>
					 {fieldOptions && fieldOptions[name] && fieldOptions[name].map((option) =>{
						return ( 
							<label key={option}>
								<input name={name} type='radio' value={option} checked={option === fieldValue} 
									onChange={event => {this.handleFieldChange(config, event) }} 
									required={config.required}
								/>
								<span className={styles.radioLabel}>{option}</span>
							</label>
						)
					 })}		

					</fieldset>			
				)
			}

			return (
				<label className={styles.label} key={name}>
					<span className={styles.labelName}>{label}</span>
					{input}
				</label>
			);
		});

		return fieldSets;
	}

	render() {
		const { onSubmit, controls, state } = this.props;
		return (
			<form className={styles.ControlledFields} onSubmit={onSubmit}>
				{this.renderFieldSets()}
				{controls ?
					<div className={styles.controlsGroup}>
						<ButtonGroup controls={controls}
								 processing={state && state.processing }
						 	/>
					</div>
					: null
				}
			</form>
		);
	}
}
