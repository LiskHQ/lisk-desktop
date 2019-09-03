import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';
import Spinner from '../../spinner/spinner';
import styles from './input.css';

const statusIconNameMap = {
  ok: 'okIcon',
  error: 'alertIcon',
};

const Input = ({
  className,
  setRef,
  size,
  error,
  isLoading,
  icon,
  status,
  ...props
}) => (
  <span className={styles.wrapper}>
    { icon ? <Icon name={icon} className={styles.icon} /> : null }
    { isLoading || status === 'pending'
      ? <Spinner className={`${styles.loading} ${styles.status}`} />
      : null }
    { status && statusIconNameMap[status]
      ? <Icon name={statusIconNameMap[status]} className={styles.status} />
      : null
    }
    <input
      {...props}
      ref={setRef}
      className={`${styles.input} ${error || status === 'error' ? styles.error : ''} ${className} ${styles[size]} ${icon ? styles.withIcon : ''}`}
    />
  </span>
);

Input.propTypes = {
  status: PropTypes.oneOf(['ok', 'error', 'pending', undefined]),
};

Input.defaultProps = {
  className: '',
  setRef: null,
  error: false,
  isLoading: false,
  status: undefined,
};

export default Input;
