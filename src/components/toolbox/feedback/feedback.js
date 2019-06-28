import React from 'react';
import PropTypes from 'prop-types';
import svg from '../../../utils/svgIcons';
import styles from './feedback.css';

const Feedback = ({
  showIcon, status, children, show, className, dark,
}) => {
  const icon = status === 'error' && svg.alert_icon;
  const classNames = [
    dark && styles.dark,
    className,
    styles.feedback,
    show && styles.show,
    !!status && styles[status],
  ].filter(name => name).join(' ');
  return (
    <span
      className={classNames}
    >
      {showIcon && icon && <img src={icon} />}
      {children}
    </span>
  );
};

Feedback.propTypes = {
  status: PropTypes.oneOf(['error', '', 'success']),
  children: PropTypes.string.isRequired,
  show: PropTypes.bool,
  showIcon: PropTypes.bool,
  className: PropTypes.string,
  dark: PropTypes.bool,
};

Feedback.defaultProps = {
  status: '',
  children: '',
  show: false,
  showIcon: false,
  className: '',
  dark: false,
};

export default Feedback;
