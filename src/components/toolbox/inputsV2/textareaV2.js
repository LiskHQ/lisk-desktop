import React from 'react';
import styles from './inputV2.css';

const TextareaV2 = ({ setRef = null, className = '', ...props }) =>
  <textarea ref={setRef} {...props} className={`${styles.input} ${className}`} />;

export default TextareaV2;
