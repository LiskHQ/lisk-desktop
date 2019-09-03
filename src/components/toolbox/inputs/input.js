import PropTypes from 'prop-types';
import React from 'react';
import Feedback from '../feedback/feedback';
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
  feedback,
  ...props
}) => (
  <span className={`${styles.wrapper} ${styles[size]}`}>
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
      className={`${styles.input} ${error || status === 'error' ? styles.error : ''} ${className} ${icon ? styles.withIcon : ''}`}
    />
    <Feedback className={styles.feedback} status={status} show={!!feedback}>
      {feedback}
    </Feedback>
  </span>
);

Input.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['ok', 'error', 'pending', undefined]),
  feedback: PropTypes.string,
};

Input.defaultProps = {
  className: '',
  setRef: null,
  error: false,
  isLoading: false,
  size: 'l',
  status: undefined,
  feedback: '',
};

export default Input;
