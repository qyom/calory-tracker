import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import memberLike from 'PropTypes/memberLike';

import { isFunction } from 'lodash';

export default class MemberFields extends Component {
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
				placeholder: PropTypes.string,
				isValueHidden: PropTypes.bool,
			}),
		).isRequired,
		isEditMode: PropTypes.bool,
		setupGetFieldsData: PropTypes.func.isRequired,
	};

	static defaultProps = {
		isEditMode: true,
		fieldValues: {},
	};

	constructor(props) {
		super(props);
		this.state = { ...this.props.fieldValues };

		this.getFieldsData = this.getFieldsData.bind(this);
		this.setFieldsData = this.setFieldsData.bind(this);
	}
	componentDidMount() {
		this.props.setupGetFieldsData(this.getFieldsData, this.setFieldsData);
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
			const { placeholder, type = 'text', name, isValueHidden } = config;
			const fieldValue = this.state[name];

			return (
				<fieldset className={styles.fieldSet} key={name}>
					<label className={styles.label}>{placeholder}:</label>
					{isEditMode ? (
						<input
							type={type}
							name={name}
							placeholder={placeholder}
							value={fieldValue}
							onChange={event => {
								this.handleFieldChange(config, event);
							}}
						/>
					) : isValueHidden ? (
						<span className={styles.box} />
					) : (
						<span className={styles.value}>{fieldValue}</span>
					)}
				</fieldset>
			);
		});

		return fieldSets;
	}

	render() {
		return (
			<form className={styles.MemberFields}>{this.renderFieldSets()}</form>
		);
	}
}
