import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import PassphraseInput from '../passphraseInput';
import { extractPublicKey } from '../../utils/account';

class AuthInputs extends React.Component {
  componentDidMount() {
    if (this.props.account.secondPublicKey) {
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
        <PassphraseInput label={this.props.t('Enter your 1st passphrase to confirm')}
          className='passphrase'
          error={this.props.passphrase.error}
          value={this.props.passphrase.value}
          onChange={this.onChange.bind(this, 'passphrase')}
          columns={this.props.columns}
          theme={this.props.theme}
        />)}
      {(this.props.account.secondPublicKey &&
        <PassphraseInput label={this.props.t('Enter your second passphrase to confirm')}
          className='second-passphrase'
          error={this.props.secondPassphrase.error}
          value={this.props.secondPassphrase.value}
          onChange={this.onChange.bind(this, 'secondPassphrase')}
          columns={this.props.columns}
          theme={this.props.theme}
        />)}
    </span>;
  }
}

export default AuthInputs;

