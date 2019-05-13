import React from 'react';
import styles from './inputV2.css';

const InputV2 = ({
  className = '',
  setRef = null,
  size,
  ...props
}) =>
  <input {...props} ref={setRef} className={`${styles.input} ${className} ${styles[size]}`} />;

export default InputV2;
