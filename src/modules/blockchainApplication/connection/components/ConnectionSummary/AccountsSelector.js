import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@account/hooks';
import AccountRow from '@account/components/AccountRow';
import CheckBox from '@theme/CheckBox';
import styles from './connectionSummary.css';

const AccountsSelector = ({ setAddresses, addresses }) => {
  const [selectAll, setSelectAll] = useState(false);
  const { accounts } = useAccounts();
  const { t } = useTranslation();

  const onSelect = (e) => {
    setSelectAll(false);
    if (e.target.checked) {
      setAddresses([...addresses, e.target.name]);
    } else {
      setAddresses(addresses.filter(item => item !== e.target.name));
    }
  };

  const onSelectAll = (e) => {
    if (e.target.checked) {
      setAddresses(accounts.map(item => item.metadata.address));
    } else {
      setAddresses([]);
    }
    setSelectAll(e.target.checked);
  };

  return (
    <div className={styles.accountSelector}>
      <label className={styles.accountWrapper}>
        <CheckBox
          onChange={onSelectAll}
          checked={selectAll}
          name="selectAll"
          value={selectAll}
          className={`${styles.checkbox} select-all`}
        />
        <span className={styles.label}>{t('Select all')}</span>
      </label>
      <div className={`${styles.accountsList} ${styles.twoColumn} accounts-list`}>
        {
          accounts.map(account => (
            <label
              className={styles.accountWrapper}
              key={account.metadata.address}
            >
              <CheckBox
                onChange={onSelect}
                checked={addresses.includes(account.metadata.address)}
                name={account.metadata.address}
                value={account.metadata.address}
                className={styles.checkbox}
              />
              <AccountRow
                key={account.metadata.address}
                account={account}
                truncate
                onSelect={() => {}}
                showRemove={false}
              />
            </label>
          ))
        }
      </div>
    </div>
  );
};

export default AccountsSelector;
