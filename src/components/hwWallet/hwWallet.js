/* eslint-disable */

import React from 'react';
import to from 'await-to-js';

import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLoginHOC';
import TrezorLogin from './trezorLoginHOC';
import getNetwork from '../../utils/getNetwork';
import { getAccountFromLedgerIndex } from '../../utils/ledger';
import Piwik from '../../utils/piwik';
import { getDeviceList } from '../../utils/hwWallet';
import HeaderV2 from '../headerV2/headerV2';

import { loginType } from '../../constants/hwConstants';
import routes from '../../constants/routes';

import styles from './unlockWallet.css';

class HwWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLedgerLogin: true,
      isTrezorLogin: true,
      devices: [],
    };
  }

  async componentDidMount() {
    this.setState({ 
      devices: await getDeviceList(),
    });
    this.ledgerLogin();
  }

  handleOnClick() {
    Piwik.trackingEvent('HwWallet', 'button', 'Continue');
    this.ledgerLogin();
  }

  cancelLedgerLogin() {
    Piwik.trackingEvent('HwWallet', 'button', 'Cancel Ledger');
    this.props.history.push(`${routes.loginV2.path}`);
  }

  async ledgerLogin() { // eslint-disable-line max-statements
    this.props.loadingStarted('ledgerLogin');

    const finishTimeout = setTimeout(() => {
      this.setState({ isLedgerLogin: false });
      this.props.loadingFinished('ledgerLogin');
    }, 6000);
    let error;
    let ledgerAccount;
    // eslint-disable-next-line prefer-const
    [error, ledgerAccount] = await to(getAccountFromLedgerIndex()); // by default index 0
    if (!error) {
      const network = Object.assign({}, getNetwork(this.props.network));
      /* istanbul ignore else */
      if (ledgerAccount.publicKey) {
        clearTimeout(finishTimeout);
        this.props.loadingFinished('ledgerLogin');
        this.setState({ isLedgerLogin: true, isLedgerFirstLogin: true });
      }

      // set active peer
      this.props.liskAPIClientSet({
        publicKey: ledgerAccount.publicKey,
        loginType: loginType.ledger,
        network,
      });
    }
  }

  render() {
    if (this.state.isLedgerLogin && (this.state.devices[0] && this.state.devices[0].model === 'Ledger')) {
      return (
        <React.Fragment>
          <HeaderV2 showSettings={true} />
          <div className={styles.wrapper}>
            <LedgerLogin
              account={this.props.account}
              loginType={loginType.ledger}
              network={getNetwork(this.props.network)}
              cancelLedgerLogin={this.cancelLedgerLogin.bind(this)} />
          </div>
        </React.Fragment>);
    }

    if (this.state.isTrezorLogin && (this.state.devices[0] && this.state.devices[0].model !== 'Ledger')) {
      return (
        <React.Fragment>
          <HeaderV2 showSettings={true} />
          <div className={styles.wrapper}>
            <TrezorLogin
              account={this.props.account}
              loginType={loginType.trezor}
              network={getNetwork(this.props.network)}
              cancelLedgerLogin={this.cancelLedgerLogin.bind(this)} />
          </div>
        </React.Fragment>);
    }

    return (
      <React.Fragment>
        <HeaderV2 showSettings={true} />
        <div className={`${styles.unlockWallet} ${styles.wrapper}`}>
          <UnlockWallet
            handleOnClick={this.handleOnClick.bind(this)}
            cancelLedgerLogin={this.cancelLedgerLogin.bind(this)} />
        </div>
      </React.Fragment>
    );
  }
}

export default HwWallet;
