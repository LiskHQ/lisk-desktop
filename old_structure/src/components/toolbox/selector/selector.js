import React from 'react';
import PropTypes from 'prop-types';
import styles from './selector.css';

class Selector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: props.selectedIndex,
    };

    this.setSelected = this.setSelected.bind(this);
  }

  setSelected({ target }) {
    const { onSelectorChange, options } = this.props;
    const selectedIndex = Number(target.value);
    this.setState({ selectedIndex });
    onSelectorChange({ index: selectedIndex, item: options[selectedIndex] });
  }

  render() {
    const { options, className, name } = this.props;
    const { selectedIndex } = this.state;

    return options.length > 1 ? (
      <div className={`${styles.selector} ${className}`}>
        {options.map(({ title }, index) => (
          <label key={title} className={`option-${title}`}>
            <input
              type="radio"
              name={name}
              onChange={this.setSelected}
              value={index}
              checked={index === selectedIndex}
            />
            <span>{title}</span>
          </label>
        ))}
      </div>
    ) : null;
  }
}

Selector.propTypes = {
  selectedIndex: PropTypes.number,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })),
  className: PropTypes.string,
  onSelectorChange: PropTypes.func.isRequired,
};

Selector.defaultProps = {
  selectedIndex: 0,
  options: [],
  className: '',
};

export default Selector;
