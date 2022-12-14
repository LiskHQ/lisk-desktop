import { to } from 'await-to-js';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getAccountsFromDevice,
  getNewAccountByIndex,
} from '@wallet/utils/hwManager';
import { useCurrentAccount } from '@account/hooks';
// import routes from 'src/routes/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import { TertiaryButton } from '@theme/buttons';
import CheckBox from '@theme/CheckBox';
import AccountCard from './accountCard';
import LoadingIcon from '../loadingIcon';
import styles from './selectAccount.css';

// eslint-disable-next-line max-statements
const SelectAccount = ({
  device,
  prevStep,
  devices,
  // history,
  settings,
  network,
  settingsUpdated,
  t,
}) => {
  const [hwAccounts, setHWAccounts] = useState([]);
  const [hideEmptyAccounts, setHideEmptyAccounts] = useState(false);
  const [currentAccount, setCurrentAccount] = useCurrentAccount();


  const getNameFromAccount = (address) => {
    // istanbul ignore else
    if (Array.isArray(settings.hardwareAccounts[device.model])) {
      const storedAccount = settings.hardwareAccounts[device.model].filter(
        (account) => account.address === address,
      );
      return storedAccount.length ? storedAccount[0].name : null;
    }

    return null;
  };

  const getAccountsFromDeviceM = async () => {
    const [error, accounts] = await to(
      getAccountsFromDevice({ device, network }),
    );
    if (error) {
      toast.error(`Error retrieving accounts from device: ${error}`);
    } else {
      const newAccounts = accounts.map((account) => ({
        ...account,
        name: getNameFromAccount(account.address),
      }));
      setHWAccounts(newAccounts);
    }
  };

  const onSaveNameAccounts = (name, address) => {
    const newAccounts = hwAccounts.map((account) => {
      if (account.summary.address === address) {
        account.name = name;
      }
      return account;
    });
    const accountNames = newAccounts.map((account) => ({
      address: account.summary.address,
      name: account.name,
    }));
    settingsUpdated({
      hardwareAccounts: {
        ...settings.hardwareAccounts,
        [device.model]: accountNames,
      },
    });
    setHWAccounts(newAccounts);
  };

  const onAddNewAccount = async () => {
    const newAccount = await getNewAccountByIndex({
      device,
      index: hwAccounts.length,
    });

    setHWAccounts([...hwAccounts, newAccount]);
  };

  const onSelectAccount = (account, index) => {
    settingsUpdated({
      token: {
        active: tokenMap.LSK.key,
        list: { LSK: true },
      },
    });

    setCurrentAccount({
      metadata: {
        ...account,
        name: 'hwaccount',
        pubkey: account.publicKey,
        creationTime: '2022-11-14T09:50:06.305Z',
        path: "m/44'/134'/0'",
        hwInfo: {
          deviceId: device.deviceId,
          derivationIndex: index,
          deviceModel: device.model,
        }
      },
    });
  };

  useEffect(() => {
    getAccountsFromDeviceM();
  }, []);

  useEffect(() => {
    // istanbul ignore else
    // if (currentAccount.metadata?.address) {
    //   history.push(`${routes.dashboard.path}`);
    // }
    const activeDevice = devices.find((d) => d.deviceId === device.deviceId);
    if (!activeDevice) prevStep({ reset: true });
  }, [currentAccount, devices, device]);

  return (
    <div className={styles.selectAccountWrapper}>
      <h1>
        {t('Lisk accounts on {{WalletModel}}', { WalletModel: device.model })}
      </h1>
      <p>
        {t('Please select the account you’d like to sign in to or')}
        <TertiaryButton
          className={`${styles.createAccountBtn} create-account`}
          onClick={onAddNewAccount}
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
                setHideEmptyAccounts(!hideEmptyAccounts);
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
                  onSaveNameAccounts={onSaveNameAccounts}
                  onSelectAccount={onSelectAccount}
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

export default SelectAccount;
