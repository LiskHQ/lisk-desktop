import React from 'react';
import PropTypes from 'prop-types';
import styles from './feedback.css';

const Feedback = ({ className, message, size, status }) => {
  const classNames = [
    styles.feedback,
    styles[size],
    styles[status],
    message.length ? styles.display : '',
    className,
    'feedback',
  ]
    .filter((name) => name)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <span className={classNames}>{message}</span>
    </div>
  );
};

Feedback.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['error', '', 'success', 'ok', 'pending']),
};

Feedback.defaultProps = {
  className: '',
  message: '',
  size: 'l',
  status: '',
};

const areEqual = (prev, next) =>
  prev.status === next.status && prev.message === next.message && prev.className === next.className;

export default React.memo(Feedback, areEqual);
