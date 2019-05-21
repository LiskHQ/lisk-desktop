import React from 'react';
import styles from './checkBox.css';
import { FontIcon } from '../../fontIcon';


const CheckBox = ({
  added, removed, id, onChange, accent, checked, className,
}) => (
  <label className={`${styles.checkbox} ${className} ${checked ? 'checked' : 'unchecked'}`} htmlFor={id}>
    <input type='checkbox'
      id={id}
      checked={checked}
      onChange={onChange} />
    <FontIcon value='checkmark-check' className={`${styles.checked} ${(accent || added) && styles.accent}`} />
    <FontIcon value='checkmark-uncheck' className={`${styles.unchecked} ${accent && styles.accent} ${removed && styles.removed}`} />
  </label>
);

export default CheckBox;
