import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import styles from './discreetModeToggle.css';

const DiscreetModeToggle = ({
  className,
  disabledText,
  enabledText,
  iconPosition,
  isEnable,
  onClick,
}) => (
  <div className={`${styles.wrapper} ${className}`}>
    {
      iconPosition === 'right'
        ? (
          <label onClick={onClick}>
            <span>{isEnable ? enabledText : disabledText}</span>
            <Icon name={isEnable ? 'discreetModeOff' : 'discreetModeOn'} />
          </label>
        )
        : (
          <label onClick={onClick}>
            <Icon name={isEnable ? 'discreetModeOff' : 'discreetModeOn'} />
            <span>{isEnable ? enabledText : disabledText}</span>
          </label>
        )
    }
  </div>
);

DiscreetModeToggle.defaultProps = {
  className: '',
  iconPosition: 'left',
};

DiscreetModeToggle.propTypes = {
  className: PropTypes.string,
  disabledText: PropTypes.string.isRequired,
  enabledText: PropTypes.string.isRequired,
  iconPosition: PropTypes.string,
  isEnable: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DiscreetModeToggle;
