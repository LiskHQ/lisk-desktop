import React from 'react';
import styles from './inputV2.css';

const TextareaV2 = ({ className = '', ...props }) =>
  <textarea {...props} className={`${styles.input} ${className}`} />;

export default TextareaV2;
