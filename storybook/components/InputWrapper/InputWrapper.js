import React from 'react';

class InputWrapper extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: props.children.props.value || '',
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange({ target }) {
    const { value } = target;
    console.log(value);
    this.setState({ value });
  }

  render() {
    return React.cloneElement(this.props.children, {
      onChange: this.onChange,
      value: this.state.value,
    });
  }
}

export default InputWrapper;
