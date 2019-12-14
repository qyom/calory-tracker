
import React from 'react';
import styles from './styles.module.scss';
import {isArray} from 'lodash';

export default (props) => {
    if (!props.errors) {
        return null;
    }
    const errors = props.errors.data || props.errors;
    return (
        <div className={styles.errorBox}>
            {Object.values(errors)
                .map(subErrors => {
                    if (isArray(subErrors)) {
                        return subErrors.join(' ');
                    }
                    return subErrors;
                })
                .map((err, index) => (
                    <div key={index}>{err}</div>
                ))}
        </div>
    );
}