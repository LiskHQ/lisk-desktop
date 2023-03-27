import React, { forwardRef } from 'react';
import Icon from 'src/theme/Icon';
import styles from './checkBox.css';

const CheckBox = forwardRef(
  (
    { added, removed, onChange, accent, checked, className, name, readOnly, value, onBlur },
    ref
  ) => (
    <label className={`${styles.checkbox} ${className} ${checked ? 'checked' : 'unchecked'}`}>
      <input
        type="checkbox"
        data-testid={name}
        checked={checked}
        ref={ref}
        value={value}
        name={name}
        readOnly={readOnly}
        onChange={onChange}
        onBlur={onBlur}
      />
      <span className={`${accent || added ? styles.accent : ''} ${removed ? styles.removed : ''}`}>
        <Icon name="checkboxFilled" />
      </span>
    </label>
  )
);

CheckBox.defaultProps = {
  added: false,
  removed: false,
  accent: false,
  className: '',
  name: '',
};

export default CheckBox;
