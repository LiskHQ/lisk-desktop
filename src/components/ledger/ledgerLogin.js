import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { fromRawLsk } from '../../utils/lsk';

import MultiStep from '../multiStep/index';
// import loginTypes from '../../constants/loginTypes';
import { getLedgerAccountInfo } from '../../utils/api/ledger';

 class LoginLedger extends React.Component {
  constructor() {
    super();
    this.state = {
      hwAccounts: [],
      isLoading: false,
      showNextAvailable: false,
    };
  }
   componentWillMount() {
    this.setState({ isLoading: true });
  }
   /* eslint-disable no-await-in-loop */
  async componentDidMount() {
    let index = 0;
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
    while (accountInfo.isInitialized);
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
   render() {
     console.log('DUPA', this.state, this.props);
    // const { maxCountOfVotes } = votingConst;
    const maxCountOfVotes = 12;
    return <div>{this.state.hwAccounts.map((account, index) => (<div>
      {account.address}
    </div>))}</div>;
  }
}

const mapStateToProps = state => ({
  activePeer: state.peers && state.peers.data,
});

const mapDispatchToProps = dispatch => ({});

 export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(LoginLedger));