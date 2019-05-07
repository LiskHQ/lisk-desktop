import React from 'react';
import { TertiaryButtonV2 } from '../../toolbox/buttons/button';
import { displayAccounts } from '../../../utils/ledger';
import { loginType } from '../../../constants/hwConstants';
import AccountCard from './accountCard';
import styles from './selectAccount.css';

class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDevice: null,
      accountOnEditMode: -1,
      hwAccounts: [],
    };

    this.onEditAccount = this.onEditAccount.bind(this);
    this.onChangeAccountTitle = this.onChangeAccountTitle.bind(this);
    this.getAccountsFromDevice = this.getAccountsFromDevice.bind(this);
    this.onSaveNameAccounts = this.onSaveNameAccounts.bind(this);
    this.onAddNewAccount = this.onAddNewAccount.bind(this);
  }

  componentDidMount() {
    this.getAccountsFromDevice();
  }

  async getAccountsFromDevice() {
    const { device, liskAPIClient, t } = this.props;
    let activeDevice = '';

    setTimeout(async () => {
      activeDevice = await displayAccounts({
        liskAPIClient,
        loginType: /trezor/ig.test(device.deviceModel) ? loginType.trezor : loginType.ledger,
        hwAccounts: [],
        t,
        device,
      });

      const hwAccounts = activeDevice.hwAccounts.map(account =>
        ({ ...account, name: 'Unnamed account' }));
      this.setState({ activeDevice: { ...activeDevice }, hwAccounts });
    }, 2000);
  }

  onEditAccount(index) {
    this.onSaveNameAccounts();
    this.setState({ accountOnEditMode: index });
  }

  onChangeAccountTitle(value, index) {
    const newAccounts = this.state.hwAccounts;
    newAccounts[index].name = value;
    this.setState({ hwAccounts: newAccounts });
  }

  onSaveNameAccounts() {
    const accountNames = this.state.hwAccounts.map(account =>
      ({ address: account.address, name: account.name }));
    this.props.settingsUpdated({ hardwareAccounts: accountNames });
    this.setState({ accountOnEditMode: -1 });
  }

  async onAddNewAccount() {
    const { device, hwAccounts } = this.state;

    if (hwAccounts[hwAccounts.length - 1].isInitialized) {
      const output = await displayAccounts({
        liskAPIClient: this.props.liskAPIClient,
        loginType: /trezor/ig.test(device.deviceModel) ? loginType.trezor : loginType.ledger,
        hwAccounts: this.state.hwAccounts,
        t: this.props.t,
        unInitializedAdded: true,
      });

      const newHWAccounts = hwAccounts.concat([output.hwAccounts[0]]);
      this.setState({ hwAccounts: newHWAccounts });
    } else {
      const label = this.props.t('Please use the last not-initialized account before creating a new one!');
      this.props.errorToastDisplayed({ label });
    }
  }

  render() {
    const { t, prevStep } = this.props;
    const { accountOnEditMode, hwAccounts } = this.state;

    return <React.Fragment>
      <h1>{t('Lisk accounts on {{WalletModel}}', { WalletModel: 'Trezor Model T' })}</h1>
      <p>
        {t('Please select the account you’d like to sign in to or')}
        <TertiaryButtonV2
          className={styles.createAccountBtn}
          onClick={this.onAddNewAccount}
        >
          {t('Create account')}
        </TertiaryButtonV2>
      </p>

      <div className={`${styles.deviceContainer} hw-container`}>
        {
          hwAccounts.length
          ? hwAccounts.map((account, index) =>
            <AccountCard
              key={index}
              account={account}
              accountOnEditMode={accountOnEditMode}
              index={index}
              onChangeAccountTitle={this.onChangeAccountTitle}
              onEditAccount={this.onEditAccount}
              onSaveNameAccounts={this.onSaveNameAccounts}
              t={t}
            />)
          : null
        }
      </div>

      <TertiaryButtonV2 onClick={() => prevStep({ jump: 2 })}>
        {t('Go Back')}
      </TertiaryButtonV2>
    </React.Fragment>;
  }
}

export default SelectAccount;
