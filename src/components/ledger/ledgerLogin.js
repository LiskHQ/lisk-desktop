import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getLedgerAccountInfo } from '../../utils/api/ledger';
import { activePeerSet } from '../../actions/peers';
import { settingsUpdated } from '../../actions/settings';
import { errorToastDisplayed } from '../../actions/toaster';

import AccountCard from './accountCard';
import AddAccountCard from './addAccountCard';

import cubeImage from '../../assets/images/dark-blue-cube.svg';
import styles from './ledgerLogin.css';

class LoginLedger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hwAccounts: [],
      isLoading: false,
      showNextAvailable: false,
      displayAccountAmount: props.settings.ledgerAccountAmount || 0,
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.settings.ledgerAccountAmount !== prevProps.settings.ledgerAccountAmount) {
      const accountInfo = await getLedgerAccountInfo(this.props.activePeer, this.state.hwAccounts.length);  // eslint-disable-line

      this.setState({ hwAccounts: this.state.hwAccounts.concat([accountInfo]) });
    }
  }

  async componentDidMount() {
    this.displayAccounts();
  }
  /* eslint-disable no-await-in-loop */
  async displayAccounts() {
    let index = 0;
    let displayed = this.state.displayAccountAmount;
    let accountInfo;
    this.setState({ isLoading: true });
    do {
      try {
        switch (this.props.loginType) {   // eslint-disable-line
          case 0:
            accountInfo = await getLedgerAccountInfo(this.props.activePeer, index);
            break;
          // case loginTypes.trezor:
          //   this.props.errorToastDisplayed({
          //   text: this.props.t('Not Yet Implemented. Sorry.'),
          // });
          //   break;
          // default:
          //   this.props.errorToastDisplayed({
          //   text: this.props.t('Login Type not recognized.')
          // });
        }
      } catch (error) {
        const text = error && error.message ? `${error.message}.` : this.props.t('Error while retrievieng addresses information.');
        this.props.errorToastDisplayed({ label: text });

        return;
      }
      this.state.hwAccounts.push(accountInfo);
      this.setState({ hwAccounts: this.state.hwAccounts });
      index++;
      if (displayed !== 0) {
        displayed--;
      }
    }
    while (displayed || accountInfo.isInitialized);
    this.props.settingsUpdated({ ledgerAccountAmount: index });
    // loadingFinished('hwDiscovery');
    this.setState({
      isLoading: false,
      showNextAvailable: (index === 1),
    });
  }

  // showNextAvailableWallet() {
  //   if (this.state.showNextAvailable) {
  //     this.props.infoToastDisplayed({
  // label: this.props.t('Please use the last not-initialized account before creating a new one!'),
  // });
  // //   } else {
  //     this.setState({ showNextAvailable: true });
  //   }
  // }

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
    this.props.settingsUpdated({
      ledgerAccountAmount: this.props.settings.ledgerAccountAmount + 1,
    });
    this.forceUpdate();
  }

  render() {
    const loadingAnimation = (<div className={styles.cubeRow}>
        <div className={`${styles.cube} ${styles['cube-1']}`}>
          <img src={cubeImage} />
        </div>
        <div className={`${styles.cube} ${styles['cube-2']}`}>
          <img src={cubeImage} />
        </div>
        <div className={`${styles.cube} ${styles['cube-3']}`}>
          <img src={cubeImage} />
        </div>
        <div className={`${styles.cube} ${styles['cube-4']}`}>
          <img src={cubeImage} />
        </div>
      </div>);

    return <div>
      <h1 className={styles.title}>{this.state.isLoading && this.props.t('Loading accounts')}</h1>
      <div className={this.state.isLoading ? styles.loading : null}>
      {!this.state.isLoading ?
          <div className={styles.accountList}>{this.state.hwAccounts.map((account, index) => (
                <AccountCard key={`accountCard-${index}`} account={account} onClickHandler={this.selectAccount.bind(this)} />
              ))}
            <AddAccountCard addAccount={this.addAccount.bind(this)} />
        </div> : loadingAnimation}
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  activePeer: state.peers && state.peers.data,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  activePeerSet: data => dispatch(activePeerSet(data)),
  settingsUpdated: data => dispatch(settingsUpdated(data)),
  errorToastDisplayed: data => dispatch(errorToastDisplayed(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(LoginLedger));
