import React, { useContext } from 'react';
import DropdownContext from '../../context/dropdownContext';
import styles from './MenuSelect.css';

function MenuItem({ value, children, className }) {
  const { onChange } = useContext(DropdownContext);
  return (
    <div
      className={`${styles.menuItemWrapper} ${className} dropdown-option`}
      onClick={() => onChange(value)}
    >
      {children}
    </div>
  );
}

export default MenuItem;
