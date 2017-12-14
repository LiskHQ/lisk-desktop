import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import MultiStep from '../multiStep';
import Create from '../passphrase/create';
import Safekeeping from '../passphrase/safekeeping';
import Confirm from '../passphrase/confirm';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import { validateUrl, getLoginData } from '../../utils/login';
import styles from './register.css';


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
    return (<div className={`box hasPadding ${styles.register}`}>
      <MultiStep finalCallback={this.onRegister.bind(this)}>
        <Create title='Create' t={t} icon='vpn_key' />
        <Safekeeping title='Safekeeping' t={t} icon='done' />
        <Confirm title='Confirm' t={t} confirmButton='Login' icon='launch' />
      </MultiStep>
    </div>);
  }
}

export default withRouter(translate()(Register));

