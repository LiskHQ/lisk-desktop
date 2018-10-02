import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { fromRawLsk } from '../../utils/lsk';

import MultiStep from '../multiStep/index';
// import loginTypes from '../../constants/loginTypes';
import { getLedgerAccountInfo } from '../../utils/api/ledger';
import { activePeerSet } from '../../actions/peers';
import AccountCard from './accountCard.js'
import AddAccountCard from './addAccountCard.js'

import styles from './ledgerLogin.css';

 class LoginLedger extends React.Component {
  constructor() {
    super();
    this.state = {
      hwAccounts: [],
      isLoading: false,
      showNextAvailable: false,
      displayAccountAmount: 0,
    };
  }
   componentWillMount() {
    this.setState({ isLoading: true });
  }
   /* eslint-disable no-await-in-loop */
  async componentDidMount() {
    let index = 0;
    let displayed = this.state.displayAccountAmount;
    let accountInfo;
    console.log('ledgerLOGIN', this.props.activePeer);
    do {
      try {
        switch (this.props.loginType) {
          case 0:
            accountInfo = await getLedgerAccountInfo(this.props.activePeer, index);
            break;
          // case loginTypes.trezor:
          //   this.props.errorToastDisplayed({ text: this.props.t('Not Yet Implemented. Sorry.') });
          //   break;
          // default:
          //   this.props.errorToastDisplayed({ text: this.props.t('Login Type not recognized.') });
        }
      } catch (error) {

        const text = error && error.message ? `${error.message}.` : this.props.t('Error while retrievieng addresses information.');
        // this.props.errorToastDisplayed({ label: text });
        // this.props.closeDialog();
        return;
      }
       this.state.hwAccounts.push(accountInfo);
      this.setState({ hwAccounts: this.state.hwAccounts });
      index++;
    }
    while (displayed || accountInfo.isInitialized);

    //  loadingFinished('hwDiscovery');
     this.setState({
      isLoading: false,
      showNextAvailable: (index === 1),
    });
  }
   showNextAvailableWallet() {
    if (this.state.showNextAvailable) {
      this.props.infoToastDisplayed({ label: this.props.t('Please use the last not-initialized account before creating a new one!') });
    } else {
      this.setState({ showNextAvailable: true });
    }
  }
   isActive(hwAccount) {
    return hwAccount.publicKey === this.props.account.publicKey;
  }
   switchAccount(hwAccount, index) {
    const newAccount = {
      publicKey: hwAccount.publicKey,
      activePeer: this.props.activePeer,
      loginType: this.props.account.loginType,
      hwInfo: {
        deviceId: this.props.account.hwInfo.deviceId,
        derivationIndex: index,
      },
      network: this.props.networkOptions.code,
      address: this.props.networkOptions.address,
    };
    this.props.accountSwitched(newAccount);
  }
  selectAccount(ledgerAccount) {
    // set active peer
    this.props.activePeerSet({
      publicKey: ledgerAccount.publicKey,
      network: this.props.network,
      hwInfo: { // Use pubKey[0] first 10 char as device id
        deviceId: ledgerAccount.publicKey.substring(0, 10),
        derivationIndex: 0,
      },
    });
  }

  addAccount() {
    this.setState({
      displayAccountAmount: this.state.displayAccountAmount++,
    })
  }

   render() {
    const maxCountOfVotes = 12;
    
    return <div className={styles.accountList}>{this.state.hwAccounts.map((account, index) => (
      <AccountCard account={account} onClickHandler={this.selectAccount.bind(this)} />))}
      <AddAccountCard addAccount={() => { this.addAccount(); }} />
    </div>;
  }
}

const mapStateToProps = state => ({
  activePeer: state.peers && state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  activePeerSet: data => dispatch(activePeerSet(data)),
});

 export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(LoginLedger));