import React from 'react';
import PropTypes from 'prop-types';
import { InputV2 } from '../inputsV2';
import DropdownV2 from '../dropdownV2/dropdownV2';
import styles from './select.css';
import OutsideClickHandler from '../outsideClickHandler';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      selected: props.selected,
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
    this.setState({ selected, isOpen: false });
    return this.state.selected !== selected ?
      onChange(options[selected]) : null;
  }

  render() {
    const { options, size } = this.props;
    const { selected, isOpen } = this.state;
    return (
      <OutsideClickHandler
        disabled={!isOpen}
        onOutsideClick={this.toggleIsOpen}
        className={styles.wrapper}>
        <InputV2
          readOnly={true}
          value={options[selected].label}
          onFocus={() => this.setState({ isOpen: true })}
          size={size}
        />
        <DropdownV2
          className={styles.dropdown}
          showArrow={false}
          showDropdown={isOpen}
          active={selected}
        >
          {options.map((option, index) => (
            <span
              data-index={index}
              onClick={this.setSelected}
              key={`option-${index}`}
            >
              {option.label}
            </span>
          ))}
        </DropdownV2>
      </OutsideClickHandler>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.number,
  size: PropTypes.oneOf([
    'l', 'm', 's', 'xs',
  ]),
  onChange: PropTypes.func.isRequired,
};

Select.defaultProps = {
  options: [],
  selected: 0,
  size: 'l',
};

export default Select;
