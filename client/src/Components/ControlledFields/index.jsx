import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.module.scss';
import memberLike from 'PropTypes/memberLike';

import { isFunction } from 'lodash';
import { attribute } from 'postcss-selector-parser';

export default class ControlFields extends Component {
	static propTypes = {
		fieldValues: PropTypes.object,
		// 	userId: PropTypes.string.isRequired,
		// 	match: PropTypes.shape({
		// 		params: PropTypes.shape({
		// 			memberId: PropTypes.string.isRequired,
		// 		}).isRequired,
		// 	}).isRequired,
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

	constructor(props) {
		super(props);
		const { fieldValues, fieldConfigs } = props;
		const fieldsState = fieldConfigs.reduce((state, config) => {
			const { name } = config;
			state[name] = fieldValues[name] || config.defaultValue || '';
			return state;
		}, {});

		this.state = { ...fieldsState };

		this.getFieldsData = this.getFieldsData.bind(this);
		this.setFieldsData = this.setFieldsData.bind(this);
	}
	componentDidMount() {
		this.props.setupFieldsDataExternalControlers(
			this.getFieldsData,
			this.setFieldsData,
		);
	}

	getFieldsData() {
		return this.state;
	}
	setFieldsData(fieldsData, callback) {
		if (isFunction(callback)) {
			this.setState(fieldsData, callback);
		}
		this.setState(fieldsData);
	}
	handleFieldChange = (config, event) => {
		this.setState({
			[config.name]: event.target.value,
		});
	};

	renderFieldSets() {
		const { fieldConfigs, isEditMode } = this.props;

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
				input = <span className={styles.box} />;
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
		return (
			<form className={styles.ControlledFields}>{this.renderFieldSets()}</form>
		);
	}
}
