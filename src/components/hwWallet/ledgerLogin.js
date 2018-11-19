import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getLedgerAccountInfo } from '../../utils/api/ledger';
import { liskAPIClientSet } from '../../actions/peers';
import { settingsUpdated } from '../../actions/settings';
import { errorToastDisplayed } from '../../actions/toaster';

import AccountCard from './accountCard';
import AddAccountCard from './addAccountCard';
import { FontIcon } from '../fontIcon';

import cubeImage from '../../assets/images/dark-blue-cube.svg';
import styles from './ledgerLogin.css';

class LedgerLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hwAccounts: [],
      isLoading: false,
      isEditMode: false,
      showNextAvailable: false,
      hardwareAccountsName: props.settings.hardwareAccounts || {},
      displayAccountAmount: props.settings.ledgerAccountAmount || 0,
    };
  }

  // async componentDidUpdate(prevProps) {
  // if (this.props.settings.ledgerAccountAmount !== prevProps.settings.ledgerAccountAmount) {
  //   const accountInfo = await getLedgerAccountInfo
  // (this.props.liskAPIClient, this.state.hwAccounts.length);  // eslint-disable-line

  //   this.setState({ hwAccounts: this.state.hwAccounts.concat([accountInfo]) });
  // }
  // }

  async componentDidMount() {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.displayAccounts();
    }, 2000);
  }
  /* eslint-disable no-await-in-loop */
  async displayAccounts(unInitializedAdded = false) { // eslint-disable-line
    let index = unInitializedAdded ? this.state.hwAccounts.length : 0;
    let accountInfo;
    if (!unInitializedAdded) {
      this.setState({ isLoading: true });
    }
    do {
      try {
        switch (this.props.loginType) {   // eslint-disable-line
          case 0:
            accountInfo = await getLedgerAccountInfo(this.props.liskAPIClient, index);
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
      if ((!unInitializedAdded && (index === 0 || accountInfo.isInitialized)) ||
        (unInitializedAdded && !accountInfo.isInitialized)) {
        this.state.hwAccounts.push(accountInfo);
        this.setState({ hwAccounts: this.state.hwAccounts });
      }
      index++;
    }
    while (accountInfo.isInitialized || index === 0);
    this.props.settingsUpdated({ ledgerAccountAmount: index });
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
    this.props.liskAPIClientSet({
      publicKey: ledgerAccount.publicKey,
      network: this.props.network,
      hwInfo: { // Use pubKey[0] first 10 char as device id
        deviceId: ledgerAccount.publicKey.substring(0, 10),
        derivationIndex: 0,
      },
    });
  }

  async addAccount() {
    if (this.state.hwAccounts[this.state.hwAccounts.length - 1].isInitialized) {
      this.displayAccounts(true);
    } else {
      const label = this.props.t('Please use the last not-initialized account before creating a new one!');
      this.props.errorToastDisplayed({ label });
    }
    // this.props.settingsUpdated({
    //   ledgerAccountAmount: this.props.settings.ledgerAccountAmount + 1,
    // });
    // this.forceUpdate();
  }

  turnOnEditMode() {
    this.setState({ isEditMode: true });
  }

  saveAccountNames() {
    this.props.settingsUpdated({
      hardwareAccounts: this.state.hardwareAccountsName,
    });
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  changeAccountNameInput(value, account) {
    const newHardwareAccountsName = Object.assign(
      {},
      this.state.hardwareAccountsName,
      { [account]: value },
    );
    this.setState({ hardwareAccountsName: newHardwareAccountsName });
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
      {this.state.isLoading ? <h1 className={styles.title}>{this.state.isLoading && this.props.t('Loading accounts')}</h1> : null}
      <div className={this.state.isLoading ? styles.loading : null}>
      {!this.state.isLoading ?
          <div>
            <div className={styles.back} onClick={() => { this.props.cancelLedgerLogin(); }}>
              <FontIcon value='arrow-left'/>{this.props.t('Back')}
            </div>
            <div className={styles.title}><h2>{this.props.t('Accounts on Ledger')}</h2></div>
            {this.state.isEditMode ?
              <div className={styles.edit} onClick={() => this.saveAccountNames()}>
                {this.props.t('Done')}
              </div> :
              <div className={styles.edit} onClick={() => this.turnOnEditMode()}>
                <FontIcon value='edit'/>{this.props.t('Edit')}
              </div>}
            <div className={styles.accountList}>{this.state.hwAccounts.map((account, index) => (
                  <AccountCard
                    hardwareAccountName={this.state.hardwareAccountsName[account.address]}
                    isEditMode={this.state.isEditMode}
                    key={`accountCard-${index}`}
                    account={account}
                    changeInput={this.changeAccountNameInput.bind(this)}
                    onClickHandler={this.selectAccount.bind(this)} />
                ))}
              <AddAccountCard addAccount={this.addAccount.bind(this)} t={this.props.t} />
            </div>
          </div> : loadingAnimation}
      </div>
    </div>;
  }
}

const mapStateToProps = state => ({
  liskAPIClient: state.peers && state.peers.liskAPIClient,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  liskAPIClientSet: data => dispatch(liskAPIClientSet(data)),
  settingsUpdated: data => dispatch(settingsUpdated(data)),
  errorToastDisplayed: data => dispatch(errorToastDisplayed(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(LedgerLogin));
