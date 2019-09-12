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

const updateStatus = ({
  status, isLoading, value, error, readOnly,
}) => {
  if (isLoading) {
    status = 'pending';
  }
  if (!value || readOnly) {
    status = undefined;
  }
  if (error) {
    status = 'error';
  }
  return status;
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
  label,
  ...props
}) => {
  status = updateStatus({
    status, isLoading, error, ...props,
  });
  return (
    <React.Fragment>
      { label && <label className={styles.label}>{label}</label> }
      <span className={`${styles.wrapper} ${styles[size]}`}>
        { icon && (
          typeof icon === 'string'
            ? <Icon name={icon} className={styles.icon} />
            : <span className={styles.icon}>{icon}</span>
        )}
        { status === 'pending'
          && <Spinner className={`${styles.loading} ${styles.status}`} />
        }
        { statusIconNameMap[status]
          && <Icon name={statusIconNameMap[status]} className={styles.status} />
        }
        <input
          {...props}
          ref={setRef}
          className={[
            styles.input,
            status === 'error' && styles.error,
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
    </React.Fragment>
  );
};

Input.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['ok', 'error', 'pending', undefined]),
  feedback: PropTypes.string,
  dark: PropTypes.bool,
  label: PropTypes.string,
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
  label: '',
};

export default Input;
