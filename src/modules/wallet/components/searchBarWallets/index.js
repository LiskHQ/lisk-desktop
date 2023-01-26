import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import { truncateAddress } from '@wallet/utils/account';
import styles from './walletsAndValidators.css';

const Wallets = ({
  wallets, onSelectedRow, t, rowItemIndex, updateRowItemIndex,
}) => {
  const isValidator = wallets.some(wallet => wallet.isValidator);

  return (
    <div className={`${styles.wrapper} accounts`}>
      <header className={`${styles.header} accounts-header`}>
        <label>{t('Account')}</label>
      </header>
      <div className={`${styles.content} account-content`}>
        {
        wallets.map((wallet, index) => (
          <div
            key={index}
            data-index={index}
            className={`${styles.accountRow} ${rowItemIndex === index ? styles.active : ''} account-row`}
            onClick={() => onSelectedRow(wallet.address)}
            onMouseEnter={updateRowItemIndex}
          >
            <WalletVisual address={wallet.address} />
            <div className={styles.walletInformation}>
              {
                isValidator
                  ? (
                    <>
                      <div>
                        <span className={`${styles.accountTitle} account-title`}>
                          {wallet.name}
                        </span>
                      </div>
                      <span className={`${styles.accountSubtitle} hideOnLargeViewPort`}>
                        {truncateAddress(wallet.address)}
                      </span>
                      <span className={`${styles.accountSubtitle} showOnLargeViewPort`}>
                        {wallet.address}
                      </span>
                    </>
                  )
                  : (
                    <span className={`${styles.accountTitle} account-title`}>
                      {wallet.address}
                    </span>
                  )
              }
            </div>
            <span className={styles.accountBalance}>
              {isValidator
                ? (
                  <span className={`${styles.tag} tag`}>
                    {
                      wallet.rank
                        ? t('Validator #{{rank}}', { rank: wallet.rank })
                        : '-'
                    }
                  </span>
                )
                : null }
            </span>
          </div>
        ))
      }
      </div>
    </div>
  );
};

export default Wallets;
