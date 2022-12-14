import { to } from 'await-to-js';
import React from 'react';
import { toast } from 'react-toastify';
import {
  getAccountsFromDevice,
  getNewAccountByIndex,
} from '@wallet/utils/hwManager';
import routes from 'src/routes/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import { TertiaryButton } from '@theme/buttons';
import CheckBox from '@theme/CheckBox';
import AccountCard from './accountCard';
import LoadingIcon from '../loadingIcon';
import styles from './selectAccount.css';

class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hwAccounts: [], hideEmptyAccounts: false };

    this.onSaveNameAccounts = this.onSaveNameAccounts.bind(this);
    this.onAddNewAccount = this.onAddNewAccount.bind(this);
    this.onSelectAccount = this.onSelectAccount.bind(this);
    this.getNameFromAccount = this.getNameFromAccount.bind(this);
  }

  componentDidMount() {
    this.getAccountsFromDevice();
  }

  componentDidUpdate() {
    // istanbul ignore else
    if (this.props.account?.summary?.address) {
      this.props.history.push(`${routes.dashboard.path}`);
    }
    const { devices, device } = this.props;
    const activeDevice = devices.find((d) => d.deviceId === device.deviceId);
    if (!activeDevice) this.props.prevStep({ reset: true });
  }

  getNameFromAccount(address) {
    const { settings, device } = this.props;
    // istanbul ignore else
    if (Array.isArray(settings.hardwareAccounts[device.model])) {
      const storedAccount = settings.hardwareAccounts[device.model].filter(
        (account) => account.address === address,
      );
      return storedAccount.length ? storedAccount[0].name : null;
    }

    return null;
  }

  async getAccountsFromDevice() {
    const { device, network } = this.props;
    const [error, accounts] = await to(
      getAccountsFromDevice({ device, network }),
    );
    if (error) {
      toast.error(`Error retrieving accounts from device: ${error}`);
    } else {
      const hwAccounts = accounts.map((account) => ({
        ...account,
        name: this.getNameFromAccount(account.address),
      }));
      this.setState({ hwAccounts });
    }
  }

  onSaveNameAccounts(name, address) {
    const newAccounts = this.state.hwAccounts.map((account) => {
      if (account.summary.address === address) {
        account.name = name;
      }
      return account;
    });
    const accountNames = newAccounts.map((account) => ({
      address: account.summary.address,
      name: account.name,
    }));
    this.props.settingsUpdated({
      hardwareAccounts: {
        ...this.props.settings.hardwareAccounts,
        [this.props.device.model]: accountNames,
      },
    });
    this.setState({ hwAccounts: newAccounts });
  }

  async onAddNewAccount() {
    const { hwAccounts } = this.state;
    const newAccount = await getNewAccountByIndex({
      device: this.props.device,
      index: hwAccounts.length,
    });

    this.setState({
      hwAccounts: [...hwAccounts, newAccount],
    });
  }

  onSelectAccount(account, index) {
    const { login, device, settingsUpdated } = this.props;

    settingsUpdated({
      token: {
        active: tokenMap.LSK.key,
        list: { LSK: true },
      },
    });

    // @todo adopt with add account
    login({
      publicKey: account.summary.publicKey,
      hwInfo: {
        deviceId: device.deviceId,
        derivationIndex: index,
        deviceModel: device.model,
      },
    });
  }

  render() {
    const { t, device } = this.props;
    const { hwAccounts, hideEmptyAccounts } = this.state;

    return (
      <div className={styles.selectAccountWrapper}>
        <h1>
          {t('Lisk accounts on {{WalletModel}}', { WalletModel: device.model })}
        </h1>
        <p>
          {t('Please select the account you’d like to sign in to or')}
          <TertiaryButton
            className={`${styles.createAccountBtn} create-account`}
            onClick={this.onAddNewAccount}
            disabled={hwAccounts.some((account) => !account.token)}
          >
            {t('Create an account')}
          </TertiaryButton>
        </p>
        {hwAccounts.length ? (
          <>
            <label
              className={`${styles.hideAccountsCheckbox} ${styles[hideEmptyAccounts]}`}
            >
              <CheckBox
                name="hideEmptyAccounts"
                className={`${styles.checkbox} hideEmptyAccounts`}
                checked={hideEmptyAccounts}
                onChange={() => {
                  this.setState({ hideEmptyAccounts: !hideEmptyAccounts });
                }}
              />
              <span>{t('Hide empty accounts')}</span>
            </label>
            <div className={`${styles.deviceContainer} hw-container`}>
              {hwAccounts
                .filter((account) => {
                  if (hideEmptyAccounts) {
                    return account?.availableBalance > 0;
                  }
                  return true;
                })
                .map((account, index) => (
                  <AccountCard
                    key={`hw-account-${index}`}
                    account={account}
                    index={index}
                    onSaveNameAccounts={this.onSaveNameAccounts}
                    onSelectAccount={this.onSelectAccount}
                  />
                ))}
            </div>
          </>
        ) : (
          <LoadingIcon />
        )}
      </div>
    );
  }
}

export default SelectAccount;
