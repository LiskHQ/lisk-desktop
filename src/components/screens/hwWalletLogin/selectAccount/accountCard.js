import React from 'react';
import { withTranslation } from 'react-i18next';
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
          { accountOnEditMode === account.summary?.address
            ? (
              <div className={styles.editAccountTitle}>
                <Input
                  value={account.name}
                  size="s"
                  onClick={e => e.stopPropagation()}
                  onChange={
                    event => onChangeAccountTitle(event.target.value, account.summary?.address)
                  }
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
                      onEditAccount(account.summary?.address);
                    }}
                    name="edit"
                  />
                </p>
                <p className={`${styles.accountAddress} row-address`}>{truncateAddress(account.summary?.address)}</p>
              </>
            )}
        </header>
        {account.legacy ? (
          <>
            <div className={`${styles.accountBalance} ${styles.legacyBalance} row-balance`}>
              <p>{t('Old account:')}</p>
              <p>
                <LiskAmount val={account.legacy.balance} token={tokenMap.LSK.key} />
              </p>
            </div>
            <div className={`${styles.accountBalance} ${styles.legacyBalance} row-balance`}>
              <p>{t('New account:')}</p>
              <p>
                <LiskAmount val={account.token?.balance} token={tokenMap.LSK.key} />
              </p>
            </div>
          </>
        ) : (
          <div className={`${styles.accountBalance} row-balance`}>
            <p>{t('Balance:')}</p>
            <p>
              <LiskAmount val={account.token?.balance} token={tokenMap.LSK.key} />
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default withTranslation()(AccountCard);
