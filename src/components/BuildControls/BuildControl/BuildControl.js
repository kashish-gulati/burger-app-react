import React from 'react';
import styles from './BuildControl.module.css';
import PropTypes from 'prop-types';

const BuildControl = (props) =>(
    <div className={styles.BuildControl}>
        <div className={styles.Label}>{props.label}</div>
        <button 
            className = {styles.Less} 
            onClick = {props.removed}
            disabled = {props.disabled}
        >-</button>
        <button 
            className = {styles.More} 
            onClick = {props.added}
        >+</button>
    </div>
);

BuildControl.propTypes = {
    label: PropTypes.string.isRequired
}

export default BuildControl;