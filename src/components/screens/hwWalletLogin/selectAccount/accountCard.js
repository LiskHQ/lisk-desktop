import React from 'react';
import { tokenMap } from '@constants';
import { truncateAddress } from '@utils/account';
import { TertiaryButton } from '@toolbox/buttons';
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
  onInputBlur,
  t,
}) => (
  <div
    id={account.summary?.address}
    className={`${styles.account} hw-account select-account`}
    onClick={() => onSelectAccount(account, index)}
  >
    <div className={styles.content}>
      <div>
        <AccountVisual
          address={account.summary?.address || ''}
          size={40}
        />
      </div>
      <div>
        <header className={styles.header}>
          { accountOnEditMode === index
            ? (
              <div className={styles.editAccountTitle}>
                <Input
                  value={account.name}
                  size="s"
                  onClick={e => e.stopPropagation()}
                  onChange={event => onChangeAccountTitle(event.target.value, index)}
                  onBlur={onInputBlur}
                  className="account-name"
                  placeholder={t('Account name')}
                  autoFocus
                />
                <TertiaryButton
                  className={`${styles.saveBtn} save-account`}
                  onClick={e => {
                    e.stopPropagation();
                    onSaveNameAccounts();
                  }}
                >
                  {t('Save')}
                </TertiaryButton>
              </div>
            )
            : (
              <>
                <p className={`${styles.accountTitle} account-name`}>
                  {account.name === null ? t('Unnamed account') : account.name}
                  <Icon
                    className={`${styles.editBtn} edit-account`}
                    onClick={e => {
                      e.stopPropagation();
                      onEditAccount(index);
                    }}
                    name="edit"
                  />
                </p>
                <p className={`${styles.accountAddress} row-address`}>{truncateAddress(account.summary?.address)}</p>
              </>
            )}
        </header>
        <div className={`${styles.accountBalance} row-balance`}>
          <p>{t('Balance:')}</p>
          <p>
            <LiskAmount val={account.token?.balance} token={tokenMap.LSK.key} />
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AccountCard;
