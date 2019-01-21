import React from 'react';
import styles from './dropdownV2.css';

const DropdownV2 = ({ children, showDropdown, className }) => (
  <div className={`${styles.dropdown} ${showDropdown && styles.show} ${className}`}>
    <span className={`${styles.dropdownArrow}`}>
      <svg stroke="inherit" fill="currentColor" viewBox="0 0 36 9">
        <path d="M2 9c9-2 11-7.5 16-7.5S27 7 34 9"/>
      </svg>
    </span>
    <div className={`${styles.optionsHolder} options`}>
      { children && children.map(child => (
        React.cloneElement(child, { className: `${styles.option}` })
      )) }
    </div>
  </div>
);

export default DropdownV2;
