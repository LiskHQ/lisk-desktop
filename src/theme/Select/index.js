import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from 'src/theme/Input';
import Dropdown from '../Dropdown/dropdown';
import styles from './select.css';
import OutsideClickHandler from './OutsideClickHandler';

const Select = ({
  classNameDropdown,
  onChange,
  options,
  size,
  className,
  placeholder,
  selected,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const setSelected = ({ target }) => {
    const value = target.getAttribute('value');

    onChange(value);
    setIsOpen(false);
  };

  const { value, label } = options.find((item) => item.value === selected);

  return (
    <OutsideClickHandler
      disabled={!isOpen}
      onOutsideClick={toggleIsOpen}
      className={`${styles.wrapper} ${className}`}
    >
      <label className={`${styles.inputHolder} ${isOpen ? styles.isOpen : ''}`}>
        <Input
          readOnly
          className={value !== placeholder.value ? styles.selectedInput : null}
          placeholder={placeholder}
          value={label}
          onClick={toggleIsOpen}
          size={size}
        />
      </label>
      <Dropdown
        className={classNames(styles.dropdown, classNameDropdown)}
        showArrow={false}
        showDropdown={isOpen}
        active={value || placeholder.value}
      >
        {options.map((option, index) => (
          <span
            className={`${styles.option} ${styles[size]} option`}
            data-index={index}
            value={option.value}
            onClick={setSelected}
            key={`option-${index}`}
          >
            {option.label}
          </span>
        ))}
      </Dropdown>
    </OutsideClickHandler>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Select.defaultProps = {
  options: [],
  selected: 0,
  size: 'l',
  className: '',
};

export default Select;
