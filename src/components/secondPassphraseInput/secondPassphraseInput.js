import React from 'react';
import Input from 'react-toolbox/lib/input';
import { isValidPassphrase } from '../../utils/passphrase';

class SecondPassphraseInput extends React.Component {
  componentDidMount() {
    if (this.props.hasSecondPassphrase) {
      this.props.onError(undefined, '');
    }
  }

  handleChange(value) {
    this.props.onChange(value);
    const error = this.validate(value);
    if (error) {
      this.props.onError(error, value);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  validate(value) {
    if (!value) {
      return 'Required';
    } else if (!isValidPassphrase(value)) {
      return 'Invalid passphrase';
    }
    return undefined;
  }

  render() {
    return (this.props.hasSecondPassphrase ?
      <Input label='Second Passphrase' required={true}
        className='second-passphrase'
        error={this.props.error}
        value={this.props.value}
        onChange={this.handleChange.bind(this)} /> :
      null);
  }
}

export default SecondPassphraseInput;

