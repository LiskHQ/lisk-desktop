// TODO add unit test
// istanbul ignore file
import PropTypes from 'prop-types';
import React from 'react';
import Feedback from '../feedback/feedback';
import Icon from '../icon';
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

const MaskedInput = ({
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
}) => {
  status = updateStatus({
    status, isLoading, error, ...props,
  });
  return (
    <span className={`${styles.wrapper} ${styles[size]}`}>
      { statusIconNameMap[status]
        && <Icon name={statusIconNameMap[status]} className={styles.status} />
      }
      <input
        {...props}
        ref={setRef}
        className={[
          styles.input,
          styles.mask,
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
  );
};

MaskedInput.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['ok', 'error', 'pending', undefined]),
  feedback: PropTypes.string,
  dark: PropTypes.bool,
};

MaskedInput.defaultProps = {
  className: '',
  setRef: null,
  error: false,
  isLoading: false,
  size: 'l',
  status: undefined,
  feedback: '',
  dark: false,
};

export default MaskedInput;
