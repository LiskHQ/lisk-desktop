import React from 'react';
import PassphraseInput from '../passphraseInput';
import { extractPublicKey } from '../../utils/api/account';

class AuthInputs extends React.Component {
  componentDidMount() {
    if (this.props.account.secondSignature) {
      this.props.onChange('secondPassphrase', '');
    }
  }

  onChange(name, value, error) {
    if (!error) {
      const publicKeyMap = {
        passphrase: 'publicKey',
        secondPassphrase: 'secondPublicKey',
      };
      const expectedPublicKey = this.props.account[publicKeyMap[name]];

      if (expectedPublicKey && expectedPublicKey !== extractPublicKey(value)) {
        error = this.props.t('Entered passphrase does not belong to the active account');
      }
    }
    this.props.onChange(name, value, error);
  }

  render() {
    return <span>
      {(!this.props.account.passphrase &&
        <PassphraseInput label={this.props.t('Passphrase')}
          className='passphrase'
          error={this.props.passphrase.error}
          value={this.props.passphrase.value}
          onChange={this.onChange.bind(this, 'passphrase')} />)}
      {(this.props.account.secondSignature &&
        <PassphraseInput label={this.props.t('Second Passphrase')}
          className='second-passphrase'
          error={this.props.secondPassphrase.error}
          value={this.props.secondPassphrase.value}
          onChange={this.onChange.bind(this, 'secondPassphrase')} />)}
    </span>;
  }
}

export default AuthInputs;

