import React from 'react';
import Input from 'react-toolbox/lib/input';
import { isValidPassphrase } from '../../utils/passphrase';

class SecondPassphraseInput extends React.Component {
  componentDidMount() {
    if (this.props.hasSecondPassphrase) {
      this.props.onError(undefined, '');
    }
  }

  handleValueChange(value) {
    this.props.onChange(value);
    const error;
    if (!value) {
      error = 'Required';
    } else if (!isValidPassphrase(value)) {
      error = 'Invalid passphrase';
    }
    if (error) {
      this.props.onError(error, value);
    }
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

