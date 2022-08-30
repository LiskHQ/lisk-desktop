import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountRow from '@account/components/AccountRow';
import CheckBox from '@theme/CheckBox';
import styles from './connectionSummary.css';

const AccountsSelector = ({ setAddresses, addresses, accounts }) => {
  const [selectAll, setSelectAll] = useState(false);
  const { t } = useTranslation();

  const onSelect = (e) => {
    setSelectAll(false);
    if (e.target.checked) {
      setAddresses([...addresses, e.target.name]);
    } else {
      setAddresses(addresses.filter(item => item !== e.target.name));
    }
  };

  const onSelectAll = () => {
    if (selectAll) {
      setAddresses([]);
    } else {
      setAddresses(accounts.map(item => item.metadata.pubkey));
    }
    setSelectAll(!selectAll);
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
              key={account.metadata.pubkey}
            >
              <CheckBox
                onChange={onSelect}
                checked={addresses.includes(account.metadata.pubkey)}
                name={account.metadata.pubkey}
                value={account.metadata.pubkey}
                className={styles.checkbox}
              />
              <AccountRow
                key={account.metadata.pubkey}
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
