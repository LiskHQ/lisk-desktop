import React from 'react';
import { tokenMap } from '@constants';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import AccountVisual from '@toolbox/accountVisual';
import LiskAmount from '@shared/liskAmount';
import { Input } from '@toolbox/inputs';
import Icon from '@toolbox/icon';
import styles from './selectAccount.css';

const AccountCard = ({
  account,
  accountOnEditMode,
  index,
  onChangeAccountTitle,
  onEditAccount,
  onSaveNameAccounts,
  onSelectAccount,
  t,
}) => (
  <div id={account.summary?.address} className={`${styles.account} hw-account`}>
    <header className={styles.header}>
      { accountOnEditMode === index
        ? (
          <>
            <Input
              value={account.name}
              size="xs"
              onChange={event => onChangeAccountTitle(event.target.value, index)}
              className="account-name"
              placeholder={t('Account name')}
            />
            <PrimaryButton
              className={`${styles.saveBtn} save-account`}
              onClick={() => onSaveNameAccounts()}
            >
              {t('Save')}
            </PrimaryButton>
          </>
        )
        : (
          <>
            <span className={`${styles.accountTitle} account-name`}>
              {account.name === null ? t('Unnamed account') : account.name}
            </span>
            <SecondaryButton
              className={`${styles.editBtn} edit-account`}
              onClick={() => onEditAccount(index)}
            >
              {t('Edit')}
              <Icon name="edit" />
            </SecondaryButton>
          </>
        )}
    </header>

    <div className={styles.content}>
      <AccountVisual
        address={account.summary?.address || ''}
        size={55}
      />
      <div className={`${styles.row} row-address`}>
        <p>{account.summary?.address}</p>
        <span>{t('Address')}</span>
      </div>
      <div className={`${styles.row} row-balance`}>
        <p>
          <LiskAmount val={account.token?.balance} token={tokenMap.LSK.key} />
        </p>
        <span>{t('Balance')}</span>
      </div>

      <PrimaryButton
        className="select-account"
        onClick={() => onSelectAccount(account, index)}
      >
        {t('Select this account')}
      </PrimaryButton>
    </div>
  </div>
);

export default AccountCard;
