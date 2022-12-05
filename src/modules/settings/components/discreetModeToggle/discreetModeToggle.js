import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'src/theme/CheckBox';
import styles from './discreetModeToggle.css';

const DiscreetModeToggle = ({ className, isDiscreetMode, settingsUpdated, t }) => (
  <label className={`${styles.wrapper} ${className}`}>
    <CheckBox
      name="discreetMode"
      className={`${styles.checkbox} discreetMode`}
      checked={isDiscreetMode}
      onChange={() => {
        settingsUpdated({ discreetMode: !isDiscreetMode });
      }}
    />
    <span>{t('Enable discreet mode when signed in (optional)')}</span>
  </label>
);

DiscreetModeToggle.defaultProps = {
  className: '',
};

DiscreetModeToggle.propTypes = {
  className: PropTypes.string,
  isDiscreetMode: PropTypes.bool,
  settingsUpdated: PropTypes.func,
};

export default DiscreetModeToggle;
