import React from 'react';
import styles from './inputV2.css';

const InputV2 = ({ className = '', setRef = null, ...props }) =>
  <input {...props} ref={setRef} className={`${styles.input} ${className}`} />;

export default InputV2;
