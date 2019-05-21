import React from 'react';
import styles from './checkBox.css';
import svgIcons from '../../../utils/svgIcons';

const CheckBox = ({
  added, removed, id, onChange, accent, checked, className,
}) => (
  <label className={`${styles.checkbox} ${className} ${checked ? 'checked' : 'unchecked'}`} htmlFor={id}>
    <input type='checkbox'
      id={id}
      checked={!!checked}
      onChange={onChange} />
    <span className={`${styles.checked} ${(accent || added) && styles.accent}`}>
      <img src={svgIcons.checkmark} />
    </span>
    <span className={`${styles.unchecked} ${accent && styles.accent} ${removed && styles.removed}`} />
  </label>
);

export default CheckBox;
