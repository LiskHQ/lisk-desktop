import React from 'react';
import styles from './checkBox.css';
import Icon from '../icon';

const CheckBox = ({
  added, removed, onChange, accent, checked, className, name, readOnly,
}) => (
  <label className={`${styles.checkbox} ${className} ${checked ? 'checked' : 'unchecked'}`}>
    <input
      type="checkbox"
      checked={!!checked}
      name={name}
      readOnly={readOnly}
      onChange={onChange}
    />
    <span className={`${(accent || added) ? styles.accent : ''} ${removed ? styles.removed : ''}`}>
      <Icon name="checkboxFilled" />
    </span>
  </label>
);

CheckBox.defaultProps = {
  added: false,
  removed: false,
  accent: false,
  checked: false,
  className: '',
  name: '',
};

export default CheckBox;
