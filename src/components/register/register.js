import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import MultiStep from '../multiStep';
import PassphraseGenerator from '../passphrase/passphraseGenerator';
import PassphraseVerifier from '../passphrase/passphraseVerifier';
import PassphraseShow from '../passphrase/passphraseShow';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import { validateUrl, getLoginData } from '../../utils/login';


class Register extends React.Component {
  componentDidUpdate() {
    if (this.props.account.passphrase !== undefined) {
      this.props.history.push('/main/transactions');
    }
  }

  onRegister(passphrase) {
    const { networkIndex, address } = getLoginData();

    let index = networkIndex;
    if (!index || (index === networks.customNode.code && validateUrl(address).addressValidity !== '')) {
      index = networks.mainnet.code;
    }

    const network = Object.assign({}, getNetwork(index));
    if (index === networks.customNode.code) { network.address = address; }

    // set active peer
    this.props.activePeerSet({
      passphrase,
      network,
    });
  }

  backToLogin() {
    this.props.history.push('/');
  }

  render() {
    const { t } = this.props;
    const useCaseNote = t('your passphrase will be required for logging in to your account.');
    const securityNote = t('This passphrase is not recoverable and if you lose it, you will lose access to your account forever.');

    return (<div className='box hasPadding'>
      <MultiStep finalCallback={this.onRegister.bind(this)}>
        <PassphraseGenerator title='Create' t={t} icon='vpn_key' />
        <PassphraseShow title='Safekeeping' t={t} icon='done' />
        <PassphraseVerifier title='Confirm' t={t} confirmButton='Login' icon='launch' />
      </MultiStep>
    </div>);
  }
}

export default withRouter(translate()(Register));

