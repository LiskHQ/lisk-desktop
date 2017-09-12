import React from 'react';
import PassphraseInput from './passphraseInput';

class AuthInputs extends React.Component {
  componentDidMount() {
    if (this.props.hasSecondPassphrase) {
      this.props.onChange('secondPassphrase', '');
    }
  }

  onChange(name, value, error) {
    this.props.onChange(name, value, error);
  }

  render() {
    return <span>
      {(!this.props.hasPassphrase ?
        <PassphraseInput label='Passphrase'
          className='passphrase'
          error={this.props.passphrase.error}
          value={this.props.passphrase.value}
          onChange={this.onChange.bind(this, 'passphrase')} /> :
        null)}
      {(this.props.hasSecondPassphrase ?
        <PassphraseInput label='Second Passphrase'
          className='second-passphrase'
          error={this.props.secondPassphrase.error}
          value={this.props.secondPassphrase.value}
          onChange={this.onChange.bind(this, 'secondPassphrase')} /> :
        null)}
    </span>;
  }
}

export default AuthInputs;

