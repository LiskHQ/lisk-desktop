import React from 'react';
import styles from './inputV2.css';

const InputV2 = ({ className = '', ...props }) =>
  <input {...props} className={`${styles.input} ${className}`} />;

export default InputV2;
