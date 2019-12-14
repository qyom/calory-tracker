
import React from 'react';
import styles from './styles.module.scss';
import {isArray, isString} from 'lodash';

export default (props) => {
    if (!props.errors) {
        return null;
    }
    console.log("ERROR BOX PROPS", props);
    const errors = props.errors.data || props.errors;
    return (
        <div className={styles.errorBox}> 
            {Object.values(errors)
                .map(subErrors => {
                    if (isArray(subErrors)) {
                        return subErrors.join(' ');
                    }
                    if(isString(subErrors)) {
                        return subErrors;
                    }
                    return '';
                })
                .map((err, index) => (
                    <div key={index}>{err}</div>
                ))}
        </div>
    );
}