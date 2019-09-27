import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../toolbox/icon';
import styles from './discreetModeToggle.css';

const DiscreetModeToggle = ({
  className,
  disabledText,
  enabledText,
  iconPosition,
  isDiscreetMode,
  settingsUpdated,
}) => (
  <div className={`${styles.wrapper} ${className}`}>
    <label
      className={iconPosition === 'left' ? '' : styles.rightAlignment}
      onClick={() => { settingsUpdated({ discreetMode: !isDiscreetMode }); }}
    >
      <Icon name={isDiscreetMode ? 'discreetModeOff' : 'discreetModeOn'} />
      <span>{isDiscreetMode ? enabledText : disabledText}</span>
    </label>
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
  isDiscreetMode: PropTypes.bool,
  settingsUpdated: PropTypes.func,
};

export default DiscreetModeToggle;
