import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../inputs';
import Dropdown from '../../dropdown/dropdown';
import styles from './select.css';
import OutsideClickHandler from '../outsideClickHandler';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.setSelected = this.setSelected.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  toggleIsOpen() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  setSelected({ target }) {
    const { onChange } = this.props;
    const value = target.getAttribute('value');

    onChange(value);
    this.setState({ isOpen: false });
  }

  render() {
    const {
      options, size, className, placeholder, selected,
    } = this.props;
    const { isOpen } = this.state;
    // eslint-disable-next-line eqeqeq
    const { value, label } = options.find(item => item.value == selected);

    return (
      <OutsideClickHandler
        disabled={!isOpen}
        onOutsideClick={this.toggleIsOpen}
        className={`${styles.wrapper} ${className}`}
      >
        <label className={`${styles.inputHolder} ${isOpen ? styles.isOpen : ''}`}>
          <Input
            readOnly
            className={
              value !== placeholder.value ? styles.selectedInput : null
            }
            placeholder={placeholder}
            value={label}
            onClick={this.toggleIsOpen}
            size={size}
          />
        </label>
        <Dropdown
          className={styles.dropdown}
          showArrow={false}
          showDropdown={isOpen}
          active={value || placeholder.value}
        >
          {options.map((option, index) => (
            <span
              className={`${styles.option} ${styles[size]} option`}
              data-index={index}
              value={option.value}
              onClick={this.setSelected}
              key={`option-${index}`}
            >
              {option.label}
            </span>
          ))}
        </Dropdown>
      </OutsideClickHandler>
    );
  }
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })).isRequired,
  size: PropTypes.oneOf([
    'l', 'm', 's', 'xs',
  ]),
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
