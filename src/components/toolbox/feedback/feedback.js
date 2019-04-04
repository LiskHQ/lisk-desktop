import React from 'react';
import PropTypes from 'prop-types';
import svg from '../../../utils/svgIcons';
import styles from './feedback.css';

const Feedback = ({
  showIcon, status, children, show, className,
}) => {
  const icon = status === 'error' && svg.alert_icon;
  return (
    <span className={`${className} ${styles.feedback} ${status} ${show ? styles.show : ''}`}>
      {showIcon && icon && <img src={icon} />}
      {children}
    </span>
  );
};

Feedback.propTypes = {
  status: PropTypes.oneOf(['error', '', 'success']).isRequired,
  children: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  showIcon: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
};

Feedback.defaultProps = {
  status: '',
  children: '',
  show: false,
  showIcon: false,
  className: '',
};

export default Feedback;
