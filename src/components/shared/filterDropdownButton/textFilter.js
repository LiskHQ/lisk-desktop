import React from 'react';
import { Input } from '../../toolbox/inputs';

class TextFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange({ target }) {
    const { name, updateCustomFilters, valueFormatter } = this.props;

    if (name === 'height') {
      let value = /^\./.test(target.value) ? `0${target.value}` : target.value;
      value = value.replace(/[^\d.]/g, '');

      this.setState({ value });
    } else {
      this.setState({ value: target.value });
    }

    updateCustomFilters({
      [name]: {
        value: valueFormatter(target.value),
        error: '',
        loading: false,
      },
    });
  }

  render() {
    const {
      label, name, placeholder,
    } = this.props;
    const inputProps = {
      label, name, placeholder,
    };
    return (
      <Input
        {...inputProps}
        onChange={this.onChange}
        value={this.state.value}
        className={name}
        size="xs"
      />
    );
  }
}

TextFilter.defaultProps = {
  valueFormatter: value => value,
};

export default TextFilter;
