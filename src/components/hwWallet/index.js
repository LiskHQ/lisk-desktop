import React from 'react';
import { connect } from 'react-redux';
import to from 'await-to-js';
import { withRouter } from 'react-router';

import Box from '../box';
import UnlockWallet from './unlockWallet';
import LedgerLogin from './ledgerLogin';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import { getAccountFromLedgerIndex } from '../../utils/ledger';
import { loadingStarted, loadingFinished } from '../../actions/loading';
import { liskAPIClientSet } from '../../actions/peers';
import Piwik from '../../utils/piwik';
import { loginType } from '../../constants/hwConstants';
import routes from '../../constants/routes';

import styles from './unlockWallet.css';

class HwWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLedgerLogin: true,
    };
  }

  async componentDidMount() {
    this.ledgerLogin();
  }

  handleOnClick() {
    Piwik.trackingEvent('HwWallet', 'button', 'Continue');
    this.ledgerLogin();
  }

  cancelLedgerLogin() {
    Piwik.trackingEvent('HwWallet', 'button', 'Cancel Ledger');
    this.props.history.push(`${routes.login.path}`);
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

    if (error) {
      // const text = error && error.message ?
      // `${error.message}.` : i18next.t('Error during login with Ledger.');
      // this.props.errorToastDisplayed({ label: error.message });
    } else {
      const network = this.getNetwork();

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
        // hwInfo: { // Use pubKey[0] first 10 char as device id
        //   deviceId: ledgerAccount.publicKey.substring(0, 10),
        //   derivationIndex: 0,
        // },
      });
    }
  }

  getNetwork() {
    const network = {
      ...getNetwork(this.props.network),
    };
    if (this.props.network === networks.customNode.code &&
        this.props.peers.options && this.props.peers.options.address) {
      network.address = this.props.peers.options.address;
    }
    return network;
  }

  render() {
    if (this.state.isLedgerLogin) {
      return (
        <Box>
          <LedgerLogin
            loginType={loginType.normal}
            network={this.getNetwork()}
            cancelLedgerLogin={this.cancelLedgerLogin.bind(this)} />
        </Box>);
    }

    return (
      <Box className={styles.unlockWallet}>
        <UnlockWallet
          handleOnClick={this.handleOnClick.bind(this)}
          cancelLedgerLogin={this.cancelLedgerLogin.bind(this)} />
      </Box>);
  }
}

const mapStateToProps = state => ({
  network: state.settings.network || networks.mainnet.code,
  peers: state.peers,
});

const mapDispatchToProps = {
  liskAPIClientSet,
  loadingFinished,
  loadingStarted,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(HwWallet));
