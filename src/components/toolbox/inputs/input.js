import PropTypes from 'prop-types';
import React from 'react';
import Feedback from '../feedback/feedback';
import Icon from '../icon';
import Spinner from '../../spinner/spinner';
import styles from './input.css';

const statusIconNameMap = {
  ok: 'okIcon',
  error: 'iconWarning',
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
  dark,
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
      className={[
        styles.input,
        (error || status === 'error') && styles.error,
        className,
        icon && styles.withIcon,
        dark && styles.dark,
      ].filter(Boolean).join(' ')}
    />
    <Feedback
      size={size}
      className={styles.feedback}
      status={status}
      show={!!feedback}
      dark={dark}
    >
      {feedback}
    </Feedback>
  </span>
);

Input.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['ok', 'error', 'pending', undefined]),
  feedback: PropTypes.string,
  dark: PropTypes.bool,
};

Input.defaultProps = {
  className: '',
  setRef: null,
  error: false,
  isLoading: false,
  size: 'l',
  status: undefined,
  feedback: '',
  dark: false,
};

export default Input;
