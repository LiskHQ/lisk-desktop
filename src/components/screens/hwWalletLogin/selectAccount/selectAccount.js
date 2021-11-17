import { to } from 'await-to-js';
import React from 'react';
import { toast } from 'react-toastify';
import { getAccountsFromDevice } from '@utils/hwManager';
import { tokenMap, routes } from '@constants';
import { TertiaryButton } from '@toolbox/buttons';
import TabsContainer from '@toolbox/tabsContainer/tabsContainer';
import AccountCard from './accountCard';
import LoadingIcon from '../loadingIcon';
import styles from './selectAccount.css';

const Tab = ({
  tabName, tabId, accountsList,
  accountOnEditMode, onChangeAccountTitle, onEditAccount,
  onSaveNameAccounts, onSelectAccount, onInputBlur,
}) => (
  <div tabName={tabName} tabId={tabId} className={`${styles.deviceContainer} ${`tab-${tabId}`} hw-container`}>
    {accountsList.map((account, index) => (
      <AccountCard
        key={`hw-account-tabId-${index}`}
        account={account}
        index={index}
        accountOnEditMode={accountOnEditMode}
        onChangeAccountTitle={onChangeAccountTitle}
        onEditAccount={onEditAccount}
        onSaveNameAccounts={onSaveNameAccounts}
        onSelectAccount={onSelectAccount}
        onInputBlur={onInputBlur}
      />
    ))}
  </div>
);

class SelectAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accountOnEditMode: '',
      hwAccounts: [],
    };

    this.onEditAccount = this.onEditAccount.bind(this);
    this.onChangeAccountTitle = this.onChangeAccountTitle.bind(this);
    this.onAccountCardBlur = this.onAccountCardBlur.bind(this);
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
    const activeDevice = devices.find(d => d.deviceId === device.deviceId);
    if (!activeDevice) this.props.prevStep({ reset: true });
  }

  getNameFromAccount(address) {
    const { settings, device } = this.props;
    // istanbul ignore else
    if (Array.isArray(settings.hardwareAccounts[device.model])) {
      const storedAccount = settings.hardwareAccounts[device.model].filter(account =>
        account.address === address);
      return storedAccount.length ? storedAccount[0].name : null;
    }

    return null;
  }

  async getAccountsFromDevice() {
    const { device, network } = this.props;
    const [error, accounts] = await to(getAccountsFromDevice({ device, network }));
    if (error) {
      toast.error(`Error retrieving accounts from device: ${error}`);
    } else {
      const hwAccounts = accounts.map((account) => ({
        ...account,
        name: this.getNameFromAccount(account.summary.address),
      }));
      this.setState({ hwAccounts });
    }
  }

  onEditAccount(address) {
    this.onSaveNameAccounts();
    this.setState({ accountOnEditMode: address });
  }

  onChangeAccountTitle(value, address) {
    const newAccounts = this.state.hwAccounts.map((account) => {
      if (account.summary.address === address) {
        account.name = value;
      }
      return account;
    });
    this.setState({ hwAccounts: newAccounts });
  }

  onAccountCardBlur() {
    this.setState({ accountOnEditMode: '' });
  }

  onSaveNameAccounts() {
    const accountNames = this.state.hwAccounts.map(account =>
      ({ address: account.summary.address, name: account.name }));
    this.props.settingsUpdated({
      hardwareAccounts: {
        ...this.props.settings.hardwareAccounts,
        [this.props.device.model]: accountNames,
      },
    });
    this.setState({ accountOnEditMode: '' });
  }

  onAddNewAccount() {
    const { t } = this.props;
    const { hwAccounts } = this.state;
    const lastAccount = hwAccounts[hwAccounts.length - 1];
    if (lastAccount && lastAccount.shouldShow === false) {
      hwAccounts[hwAccounts.length - 1] = {
        ...lastAccount,
        shouldShow: true,
      };
      this.setState({ hwAccounts });
    } else {
      const label = t('Please use the last not-initialized account before creating a new one!');
      toast.error(label);
    }
  }

  onSelectAccount(account, index) {
    const { login, device, settingsUpdated } = this.props;

    settingsUpdated({
      token: {
        active: tokenMap.LSK.key,
        list: { BTC: false, LSK: true },
      },
    });

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
    const { accountOnEditMode, hwAccounts } = this.state;

    const {
      nonEmptyAccounts,
      emptyAccounts,
      reclaimAccounts,
    } = hwAccounts.reduce((acc, account) => {
      if (account.legacy) {
        acc.reclaimAccounts = [...acc.reclaimAccounts, account];
        return acc;
      }
      if (account.summary?.balance > 0) {
        acc.nonEmptyAccounts = [...acc.nonEmptyAccounts, account];
        return acc;
      }
      acc.emptyAccounts = [...acc.emptyAccounts, account];
      return acc;
    }, { nonEmptyAccounts: [], emptyAccounts: [], reclaimAccounts: [] });

    return (
      <div>
        <h1>{t('Lisk accounts on {{WalletModel}}', { WalletModel: device.model })}</h1>
        <p>
          {t('Please select the account you’d like to sign in to or')}
          <TertiaryButton
            className={`${styles.createAccountBtn} create-account`}
            onClick={this.onAddNewAccount}
          >
            {t('Create an account')}
          </TertiaryButton>
        </p>
        {
          hwAccounts.length
            ? (
              <TabsContainer name="main-tabs">
                <Tab
                  tabName={t('Active')}
                  tabId="active"
                  accountsList={nonEmptyAccounts}
                  accountOnEditMode={accountOnEditMode}
                  onChangeAccountTitle={this.onChangeAccountTitle}
                  onEditAccount={this.onEditAccount}
                  onSaveNameAccounts={this.onSaveNameAccounts}
                  onSelectAccount={this.onSelectAccount}
                  onInputBlur={this.onAccountCardBlur}
                />
                <Tab
                  tabName={t('Empty')}
                  tabId="empty"
                  accountsList={emptyAccounts}
                  accountOnEditMode={accountOnEditMode}
                  onChangeAccountTitle={this.onChangeAccountTitle}
                  onEditAccount={this.onEditAccount}
                  onSaveNameAccounts={this.onSaveNameAccounts}
                  onSelectAccount={this.onSelectAccount}
                  onInputBlur={this.onAccountCardBlur}
                />
                <Tab
                  tabName={t('Reclaim ({{numOfAccounts}})', { numOfAccounts: reclaimAccounts.length })}
                  tabId="reclaim"
                  accountsList={reclaimAccounts}
                  accountOnEditMode={accountOnEditMode}
                  onChangeAccountTitle={this.onChangeAccountTitle}
                  onEditAccount={this.onEditAccount}
                  onSaveNameAccounts={this.onSaveNameAccounts}
                  onSelectAccount={this.onSelectAccount}
                  onInputBlur={this.onAccountCardBlur}
                />
              </TabsContainer>
            )
            : <LoadingIcon />
        }
      </div>
    );
  }
}

export default SelectAccount;
