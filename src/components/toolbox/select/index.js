import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '../inputs';
import Dropdown from '../dropdown/dropdown';
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

  setSelected({ target: { dataset: { index } } }) {
    const { options, onChange } = this.props;
    const selected = Number(index);
    onChange(options[selected]);
    this.setState({ isOpen: false });
  }

  render() {
    const {
      options, size, className, placeholder,
    } = this.props;
    const { isOpen } = this.state;
    const selected = placeholder && this.props.selected
      ? Number(this.props.selected) + 1
      : this.props.selected;

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
              typeof selected === 'number' && options[selected].label !== placeholder && styles.selectedInput
            }
            placeholder={placeholder}
            value={typeof selected === 'number' ? options[selected].label : ''}
            onClick={this.toggleIsOpen}
            size={size}
          />
        </label>
        <Dropdown
          className={styles.dropdown}
          showArrow={false}
          showDropdown={isOpen}
          active={!selected && placeholder ? 0 : selected}
        >
          {options.map((option, index) => (
            <span
              className={`${styles.option} ${styles[size]} option`}
              data-index={index}
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
    label: PropTypes.string.isRequired,
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
