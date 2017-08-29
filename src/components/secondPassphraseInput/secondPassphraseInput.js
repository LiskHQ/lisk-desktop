import React from 'react';
import Input from 'react-toolbox/lib/input';
import { isValidPassphrase } from '../../utils/passphrase';

class SecondPassphraseInput extends React.Component {
  componentDidMount() {
    if (this.props.hasSecondPassphrase) {
      this.props.onChange('');
    }
  }

  handleValueChange(value) {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!isValidPassphrase(value)) {
      error = 'Invalid passphrase';
    }
    this.props.onChange(value, error);
  }

  render() {
    return (this.props.hasSecondPassphrase ?
      <Input label='Second Passphrase' required={true}
        className='second-passphrase'
        error={this.props.error}
        value={this.props.value}
        onChange={this.handleValueChange.bind(this)} /> :
      null);
  }
}

export default SecondPassphraseInput;

