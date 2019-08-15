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
    return this.state.selected !== selected
      ? onChange(options[selected]) : null;
  }

  componentWillUnmount() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const { options, size, className } = this.props;
    const { selected, isOpen } = this.state;
    return (
      <OutsideClickHandler
        disabled={!isOpen}
        onOutsideClick={this.toggleIsOpen}
        className={`${styles.wrapper} ${className}`}
      >
        <label className={`${styles.inputHolder} ${isOpen ? styles.isOpen : ''}`}>
          <Input
            readOnly
            value={options[selected].label}
            onClick={this.toggleIsOpen}
            size={size}
          />
        </label>
        <Dropdown
          className={styles.dropdown}
          showArrow={false}
          showDropdown={isOpen}
          active={selected}
        >
          {options.map((option, index) => (
            <span
              className={`${styles.option} option`}
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
  selected: PropTypes.number,
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
