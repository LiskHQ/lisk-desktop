import React from 'react';
import Input from 'react-toolbox/lib/input';
import { isValidPassphrase } from '../../utils/passphrase';

class AuthInputs extends React.Component {
  componentDidMount() {
    if (this.props.hasSecondPassphrase) {
      this.props.onChange('secondPassphrase', '');
    }
  }

  handleValueChange(name, value) {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!isValidPassphrase(value)) {
      error = 'Invalid passphrase';
    }
    this.props.onChange(name, value, error);
  }

  render() {
    return <span>
      {(!this.props.hasPassphrase ?
        <Input label='Passphrase' required={true}
          className='passphrase'
          error={this.props.passphrase.error}
          value={this.props.passphrase.value}
          onChange={this.handleValueChange.bind(this, 'passphrase')} /> :
        null)}
      {(this.props.hasSecondPassphrase ?
        <Input label='Second Passphrase' required={true}
          className='second-passphrase'
          error={this.props.secondPassphrase.error}
          value={this.props.secondPassphrase.value}
          onChange={this.handleValueChange.bind(this, 'secondPassphrase')} /> :
        null)}
    </span>;
  }
}

export default AuthInputs;

