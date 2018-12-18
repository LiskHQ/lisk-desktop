import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import { displayAccounts } from '../../utils/ledger';
import { liskAPIClientSet } from '../../actions/peers';
import { settingsUpdated } from '../../actions/settings';
import { errorToastDisplayed } from '../../actions/toaster';

import AccountCard from './accountCard';
import AddAccountCard from './addAccountCard';
import { FontIcon } from '../fontIcon';
import routes from '../../constants/routes';

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

  componentDidMount() {
    this.setState({ isLoading: true });
    setTimeout(async () => {
      const output = await displayAccounts({
        liskAPIClient: this.props.liskAPIClient,
        loginType: this.props.loginType,
        hwAccounts: this.state.hwAccounts,
        t: this.props.t,
      });
      this.props.settingsUpdated({ ledgerAccountAmount: output.hwAccounts.lenght });
      this.setState({ ...output });
    }, 2000);
  }

  selectAccount(ledgerAccount, index) {
    // set active peer
    this.props.liskAPIClientSet({
      publicKey: ledgerAccount.publicKey,
      network: this.props.network,
      hwInfo: { // Use pubKey[0] first 10 char as device id
        deviceId: ledgerAccount.publicKey.substring(0, 10),
        derivationIndex: index,
      },
    });
    this.props.history.replace(routes.dashboard.path);
  }

  async addAccount() {
    if (this.state.hwAccounts[this.state.hwAccounts.length - 1].isInitialized) {
      const output = await displayAccounts({
        liskAPIClient: this.props.liskAPIClient,
        loginType: this.props.loginType,
        hwAccounts: this.state.hwAccounts,
        t: this.props.t,
        unInitializedAdded: true,
      });
      const hwAccounts = this.state.hwAccounts.concat([output.hwAccounts[0]]);
      this.setState({ hwAccounts });
    } else {
      const label = this.props.t('Please use the last not-initialized account before creating a new one!');
      this.props.errorToastDisplayed({ label });
    }
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
      {[1, 2, 3, 4].map(number =>
        <div key={`cube-${number}`} className={`${styles.cube} ${styles[`cube-${number}`]}`}>
          <img src={cubeImage} />
        </div>)}
    </div>);

    return <div>
      {this.state.isLoading ? <h1 className={styles.title}>{this.state.isLoading && this.props.t('Loading accounts')}</h1> : null}
      <div className={this.state.isLoading ? styles.loading : null}>
      {!this.state.isLoading ?
          <div>
            <div className={`${styles.back} back`} onClick={() => { this.props.cancelLedgerLogin(); }}>
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
                    index={index}
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
  loginType: state.account.loginType || 1,
});

const mapDispatchToProps = {
  liskAPIClientSet,
  settingsUpdated,
  errorToastDisplayed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(LedgerLogin)));
