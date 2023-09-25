import React from 'react';
import classNames from 'classnames';
import Icon from 'src/theme/Icon';
import styles from './WarningNotification.css';

function WarningNotification({ onDismiss, message, onClick, className, isVisible }) {
  if (!isVisible) return null;

  return (
    <div
      className={classNames(styles.entireBalanceWarning, 'warning-wrapper', className)}
      onClick={onClick}
    >
      <Icon name="warningYellow" />
      <span>{message}</span>
      {onDismiss && <div className={`${styles.closeBtn} close-warning`} onClick={onDismiss} />}
    </div>
  );
}

export default WarningNotification;
