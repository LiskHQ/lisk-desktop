import React from 'react';
import Icon from '../icon';
import Spinner from '../../spinner/spinner';
import styles from './inputV2.css';

const InputV2 = ({
  className,
  setRef,
  size,
  error,
  isLoading,
  icon,
  ...props
}) => (
  <React.Fragment>
    { icon ? <Icon name={icon} className={styles.icon} /> : null }
    { isLoading ? <Spinner className={styles.loading} /> : null }
    <input
      {...props}
      ref={setRef}
      className={`${styles.input} ${error ? styles.error : ''} ${className} ${styles[size]} ${icon ? styles.withIcon : ''}`}
    />
  </React.Fragment>
);

InputV2.defaultProps = {
  className: '',
  setRef: null,
  error: false,
  isLoading: false,
};

export default InputV2;
