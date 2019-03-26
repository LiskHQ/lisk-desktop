import React from 'react';
import PropTypes from 'prop-types';
import styles from './dropdownV2.css';

const DropdownV2 = ({
  children, showDropdown, className, showArrow,
}) => {
  const isSelectionList = children && Array.isArray(children);
  return (
    <div className={`${styles.dropdown} ${showDropdown ? styles.show : ''} ${className}`}>
      {showArrow && <span className={`${styles.dropdownArrow} dropdown-arrow`}>
        <svg stroke="inherit" fill="currentColor" viewBox="0 0 36 9">
          <path d="M2 9c9-2 11-7.5 16-7.5S27 7 34 9"/>
        </svg>
      </span>}
      <div className={`${styles.dropdownContent} dropdown-content ${isSelectionList ? 'options' : ''}`}>
        { isSelectionList ? children.map((child, key) => (
          React.cloneElement(child, { className: `${child.props.className || ''} ${styles.option}`, key })
        )) : children }
      </div>
    </div>
  );
};

DropdownV2.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  showDropdown: PropTypes.bool,
  className: PropTypes.string,
  showArrow: PropTypes.bool,
};

DropdownV2.defaultProps = {
  showDropdown: false,
  className: '',
  showArrow: true,
};

export default DropdownV2;
