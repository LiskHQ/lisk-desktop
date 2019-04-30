/* eslint-disable */

import React from 'react';
import { displayAccounts } from '../../utils/ledger';
import AccountCard from './accountCard';
import AddAccountCard from './addAccountCard';
import { FontIcon } from '../fontIcon';
import routes from '../../constants/routes';
import Piwik from '../../utils/piwik';
import { getDeviceList, getLoginTypeFromDevice,
  getHWPublicKeyFromIndex, getHWAddressFromIndex } from '../../utils/hwWallet';
import { extractAddress } from '../../utils/api/lsk/account';


import cubeImage from '../../assets/images/dark-blue-cube.svg';
import styles from './ledgerLogin.css';
const { ipc } = window;

class TrezorLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hwAccounts: [],
      isLoading: false,
      isEditMode: false,
      showNextAvailable: false,
      hardwareAccountsName: props.settings.hardwareAccounts || {},
      displayAccountAmount: props.settings.ledgerAccountAmount || 0,
      trezorPinRequested: false,
      trezorPin: '',
      trezorPasshpraseRequested: false,
      trezorPassphrase: '',
      loginType: null,
      publicKey: null,
      address: null,
      deviceId: null,
    };

    if (ipc) {
      ipc.on('trezorPinCallback', () => {
        this.setState({
          trezorPinRequested: true,
        });
      });
      ipc.on('trezorPassphraseCallback', () => {
        this.setState({
          trezorPasshpraseRequested: true,
          trezorPinRequested: false,
        });
      });
    }
  }

  async componentWillMount() {
    const devices = await getDeviceList();
    const loginType = getLoginTypeFromDevice(devices[0]);
    const deviceId = devices[0].deviceId;
    // loadingFinished('submitPassphrase');
    try {
      // Retrieve Address without verification
      const publicKey = await getHWPublicKeyFromIndex(deviceId, loginType, /* index */ 0, /* showOnDevice */ false);

      this.setState({
        trezorPinRequested: false,
        trezorPasshpraseRequested: false,
        loginType,
        publicKey,
        address: extractAddress(publicKey),
        deviceId,
        deviceModel: devices[0].model,
      });

      // Retrieve Address with verification
      const address = await getHWAddressFromIndex(deviceId, loginType, /* index */ 0, /* showOnDevice */ true);
    } catch (error) {
      this.hwError(error);
      return;
    }

    this.ok();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyboardHandler, false);
  }


  ok() {
    // set active peer
    this.props.activePeerSet({
      publicKey: this.state.publicKey,
      loginType: this.state.loginType,
      network: this.props.network,
      hwInfo: {
        device: this.props.device,
        deviceId: this.state.deviceId,
        derivationIndex: 0,
      },
    });
    this.props.close();
  }


  async componentDidMount() {
    this.setState({ isLoading: true });
    const devices = await getDeviceList();

    setTimeout(async () => {
      const output = await displayAccounts({
        liskAPIClient: this.props.liskAPIClient,
        loginType: this.props.loginType,
        hwAccounts: this.state.hwAccounts,
        device: devices[0],
        t: this.props.t,
      });

      this.props.settingsUpdated({ ledgerAccountAmount: output.hwAccounts.lenght });
      this.setState({ ...output });
    }, 2000);
  }

  componentDidUpdate() {
    if (this.props.account && this.props.account.address) {
      this.props.history.push(`${routes.dashboard.path}`);
    }
  }

  selectAccount(ledgerAccount, index) {
    Piwik.trackingEvent('TrezorLogin', 'button', 'Select account');
    this.props.liskAPIClientSet({
      publicKey: ledgerAccount.publicKey,
      network: this.props.network,
      hwInfo: {
        deviceId: this.state.deviceId,
        derivationIndex: index,
        deviceModel: this.state.deviceModel,
      },
    });
  }

  async addAccount() {
    Piwik.trackingEvent('TrezorLogin', 'button', 'Add account');
    const devices = await getDeviceList();

    if (this.state.hwAccounts[this.state.hwAccounts.length - 1].isInitialized) {
      const output = await displayAccounts({
        liskAPIClient: this.props.liskAPIClient,
        loginType: this.props.loginType,
        hwAccounts: this.state.hwAccounts,
        t: this.props.t,
        unInitializedAdded: true,
        device: devices[0],
      });
      const hwAccounts = this.state.hwAccounts.concat([output.hwAccounts[0]]);
      this.setState({ hwAccounts });
    } else {
      const label = this.props.t('Please use the last not-initialized account before creating a new one!');
      this.props.errorToastDisplayed({ label });
    }
  }

  turnOnEditMode() {
    Piwik.trackingEvent('LedgerLogin', 'button', 'Turn on edit mode');
    this.setState({ isEditMode: true });
  }

  saveAccountNames() {
    Piwik.trackingEvent('LedgerLogin', 'button', 'Save account names');
    this.props.settingsUpdated({
      hardwareAccounts: this.state.hardwareAccountsName,
    });
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  changeAccountNameInput(value = '', account) {
    const newHardwareAccountsName = Object.assign(
      {},
      this.state.hardwareAccountsName,
      { [account]: value.length < 20 ? value : value.substr(0, 20) },
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
          <div className='loadedAccounts'>
            <div className={`${styles.back} back`} onClick={() => { this.props.cancelLedgerLogin(); }}>
              <FontIcon value='arrow-left'/>{this.props.t('Back')}
            </div>
            <div className={styles.title}><h2>{this.props.t('Accounts on Trezor')}</h2></div>
            {this.state.isEditMode ?
              <div className={`${styles.edit} saveAccountNames`} onClick={() => this.saveAccountNames()}>
                {this.props.t('Done')}
              </div> :
              <div className={`${styles.edit} editMode`} onClick={() => this.turnOnEditMode()}>
                <FontIcon value='edit'/>{this.props.t('Edit')}
              </div>}
            <div className={styles.accountList}>{this.state.hwAccounts.map((account, index) => (
                  <AccountCard
                    hardwareAccountName={this.state.hardwareAccountsName[account.address]}
                    isEditMode={this.state.isEditMode}
                    key={`accountCard-${index}`}
                    index={index}
                    account={account}
                    saveAccountNames={this.saveAccountNames.bind(this)}
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

export default TrezorLogin;
