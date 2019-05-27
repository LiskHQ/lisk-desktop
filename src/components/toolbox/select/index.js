import React from 'react';
import PropTypes from 'prop-types';
import { InputV2 } from '../inputsV2';
import DropdownV2 from '../dropdownV2/dropdownV2';
import styles from './select.css';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectOpen: false,
      selected: props.selected,
    };

    this.setSelected = this.setSelected.bind(this);
  }

  setSelected({ target: { dataset: { index: selected } } }) {
    const { options, onChange } = this.props;
    this.setState({ selected });
    return this.state.selected !== selected ?
      onChange(options[selected]) : null;
  }

  render() {
    const { options, size } = this.props;
    const { selected } = this.state;
    return (
      <div className={styles.wrapper}>
        <InputV2
          readOnly={true}
          value={options[selected].label}
          onFocus={() => this.setState({ selectOpen: true })}
          size={size}
        />
        <DropdownV2
          className={styles.dropdown}
          showArrow={false}
          showDropdown={this.state.selectOpen}
        >
          {options.map((option, index) => (
            <span
              className={selected === index ? 'selected' : ''}
              data-index={index}
              onClick={this.setSelected}
              key={`option-${index}`}
            >
              {option.label}
            </span>
          ))}
        </DropdownV2>
      </div>
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
