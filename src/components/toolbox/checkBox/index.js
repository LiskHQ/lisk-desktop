import React from 'react';
import styles from './checkBox.css';
import svgIcons from '../../../utils/svgIcons';

const CheckBox = ({
  added, removed, onChange, accent, checked, className, name,
}) => (
  <label className={`${styles.checkbox} ${className} ${checked ? 'checked' : 'unchecked'}`}>
    <input type='checkbox'
      checked={!!checked}
      name={name}
      onChange={onChange} />
    <span className={`${(accent || added) ? styles.accent : ''} ${removed ? styles.removed : ''}`}>
      <img src={svgIcons.checkmark} />
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
