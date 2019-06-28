import React from 'react';
import styles from './inputV2.css';

const InputV2 = ({
  className,
  setRef,
  size,
  error,
  ...props
}) =>
  <input
    {...props}
    ref={setRef}
    className={`${styles.input} ${error ? styles.error : ''} ${className} ${styles[size]}`}
  />;

InputV2.defaultProps = {
  className: '',
  setRef: null,
  error: false,
};

export default InputV2;
