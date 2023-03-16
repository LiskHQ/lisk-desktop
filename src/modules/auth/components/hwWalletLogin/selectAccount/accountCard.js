import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { truncateAddress } from '@wallet/utils/account';
import { TertiaryButton } from '@theme/buttons';
import WalletVisual from '@wallet/components/walletVisual';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { Input } from 'src/theme';
import Icon from '@theme/Icon';
import Tooltip from '@theme/Tooltip';
import styles from './selectAccount.css';

const AccountCard = ({
  account,
  index,
  onSaveNameAccounts,
  onSelectAccount,
  t,
}) => {
  const [inputTitle, setInputTitle] = useState(account.name);
  const [accountOnEditMode, setAccountOnEditMode] = useState(false);
  const token = account.token?.[0] || {}

  useEffect(() => {
    if (!accountOnEditMode) {
      setInputTitle(account.name);
    }
  }, [accountOnEditMode]);

  return (
    <div
      id={account?.address}
      className={`${styles.account} hw-account select-account`}
      onClick={() => onSelectAccount(account, index)}
      onMouseLeave={() => setAccountOnEditMode(false)}
    >
      <div className={styles.content}>
        <div>
          <WalletVisual address={account?.address || ''} size={40} />
        </div>
        <div>
          <header className={styles.header}>
            {accountOnEditMode ? (
              <div className={styles.editAccountTitle}>
                <Input
                  value={inputTitle}
                  size="s"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setInputTitle(e.target.value)}
                  className="account-name"
                  placeholder={t('Account name')}
                  autoFocus
                />
                <TertiaryButton
                  className={`${styles.saveBtn} save-account`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveNameAccounts(inputTitle, account?.address);
                    setAccountOnEditMode(false);
                  }}
                >
                  {t('Save')}
                </TertiaryButton>
              </div>
            ) : (
              <>
                <p className={`${styles.accountTitle} account-name`}>
                  {!account.name ? t('Unnamed account') : account.name}
                  <Icon
                    className={`${styles.editBtn} edit-account`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountOnEditMode(true);
                    }}
                    name="edit"
                  />
                </p>
                <p className={`${styles.accountAddress} row-address`}>
                  {truncateAddress(account?.address)}
                </p>
              </>
            )}
          </header>
          <div className={`${styles.accountBalance} row-balance`}>
            <p>{t('Balance:')}</p>
            <p>
              <TokenAmount
                val={account?.availableBalance}
                token={token}
              />
            </p>
          </div>
          {account.legacy && (
            <Tooltip
              className={styles.legacyWarning}
              tooltipClassName={styles.tooltip}
              size="m"
              position="bottom"
              content={<Icon name="warningIconBlue" />}
            >
              <>
                <p>{t('This account needs to be reclaimed')}</p>
                <br />
                <p>{t('Balance after reclaiming:')}</p>
                <p className={styles.reclaimBalance}>
                  <TokenAmount
                    val={account.legacy.balance}
                    token={token}
                  />
                </p>
              </>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(AccountCard);
