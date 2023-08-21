/* eslint-disable complexity */
import PropTypes from 'prop-types';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import Feedback from 'src/theme/feedback/feedback';
import Icon from 'src/theme/Icon';
import Spinner from '../Spinner';
import styles from './input.css';

const statusIconNameMap = {
  ok: 'okIcon',
  error: 'iconWarning',
};

const updateStatus = ({ status, isLoading, value, error, readOnly }) => {
  if (isLoading) {
    status = 'pending';
  }
  if ((!value || readOnly) && status !== 'error') {
    status = undefined;
  }
  if (error) {
    status = 'error';
  }
  return status;
};

const getInputClass = ({ className, dark, icon, isMasked, status }) =>
  [
    styles.input,
    status === 'error' && styles.error,
    isMasked && styles.mask,
    className,
    icon && styles.withIcon,
    dark && styles.dark,
  ]
    .filter(Boolean)
    .join(' ');

function PasswordTypeToggler({ onClick, isPasswordVisible, hasNotification }) {
  return (
    <button
      tabIndex={-1}
      type="button"
      onClick={onClick}
      className={`${styles.toggleBtn} ${hasNotification ? styles.rightOffset : ''}`}
    >
      <Icon name={isPasswordVisible ? 'eyeActive' : 'eyeInactive'} className={styles.toggleIcon} />
    </button>
  );
}

const Input = forwardRef(
  (
    {
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
      type,
      isMasked,
      feedbackType,
      iconClassName,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    status = updateStatus({
      status,
      isLoading,
      error,
      ...props,
    });
    const Component = type === 'textarea' ? type : 'input';
    const [isPassword, setIsPassword] = useState(secureTextEntry);

    const toggleFieldType = useCallback(() => {
      setIsPassword(!isPassword);
    }, [isPassword]);

    const hasNotification = useMemo(
      () => statusIconNameMap[status] || status === 'pending',
      [statusIconNameMap[status], status]
    );

    return (
      <>
        {label && <label className={[styles.label, styles[size]].join(' ')}>{label}</label>}
        <span className={`${styles.wrapper} ${styles[size]}`}>
          {icon &&
            (typeof icon === 'string' ? (
              <Icon name={icon} className={`${styles.icon} ${iconClassName}`} />
            ) : (
              <span className={`${styles.icon} ${iconClassName}`}>{icon}</span>
            ))}
          {status === 'pending' && (
            <Spinner
              className={`${styles.loading} ${styles.status} node-connection-loading-spinner`}
              data-testid="input-spinner"
            />
          )}
          {statusIconNameMap[status] && (
            <Icon
              name={statusIconNameMap[status]}
              className={`${styles.status} ${secureTextEntry && styles.mgr30}`}
            />
          )}
          <Component
            {...props}
            data-testid={props.name}
            type={isPassword ? 'password' : type}
            ref={setRef || ref}
            className={getInputClass({
              className,
              dark,
              icon,
              isMasked,
              status,
            })}
          />
          {!!secureTextEntry && (
            <PasswordTypeToggler
              isPasswordVisible={!isPassword}
              onClick={toggleFieldType}
              hasNotification={hasNotification}
            />
          )}
          <Feedback message={feedback} size={size} status={status} />
        </span>
      </>
    );
  }
);

Input.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['ok', 'error', 'pending', undefined]),
  type: PropTypes.oneOf(['text', 'textarea', 'password']),
  feedback: PropTypes.string,
  dark: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
  isMasked: PropTypes.bool,
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
  type: 'text',
  onChange: /* istanbul ignore next */ () => {},
  isMasked: false,
};

export default Input;
