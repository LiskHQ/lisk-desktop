import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '@toolbox/checkBox';
import styles from './discreetModeToggle.css';

const DiscreetModeToggle = ({
  className,
  isDiscreetMode,
  settingsUpdated,
  t,
}) => (
  <div className={`${styles.wrapper} ${className}`}>
    <CheckBox
      name="discreetMode"
      className={`${styles.checkbox} discreetMode`}
      checked={isDiscreetMode}
      onChange={() => { settingsUpdated({ discreetMode: !isDiscreetMode }); }}
    />
    <span>{t('Enable discreet mode when signed in (optional)')}</span>
  </div>
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
