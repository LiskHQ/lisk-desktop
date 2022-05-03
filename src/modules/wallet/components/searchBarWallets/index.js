import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import { truncateAddress } from '@wallet/utils/account';
import styles from './walletsAndDeletegates.css';

const Wallets = ({
  wallets, onSelectedRow, t, rowItemIndex, updateRowItemIndex,
}) => {
  const isDelegate = wallets.some(wallet => wallet.summary?.isDelegate);

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
            onClick={() => onSelectedRow(wallet.summary?.address)}
            onMouseEnter={updateRowItemIndex}
          >
            <WalletVisual address={wallet.summary?.address} />
            <div className={styles.walletInformation}>
              {
                isDelegate
                  ? (
                    <>
                      <div>
                        <span className={`${styles.accountTitle} account-title`}>
                          {wallet.dpos.delegate.username}
                        </span>
                      </div>
                      <span className={`${styles.accountSubtitle} hideOnLargeViewPort`}>
                        {truncateAddress(wallet.summary?.address)}
                      </span>
                      <span className={`${styles.accountSubtitle} showOnLargeViewPort`}>
                        {wallet.summary?.address}
                      </span>
                    </>
                  )
                  : (
                    <span className={`${styles.accountTitle} account-title`}>
                      {wallet.summary?.address}
                    </span>
                  )
              }
            </div>
            <span className={styles.accountBalance}>
              {isDelegate
                ? (
                  <span className={`${styles.tag} tag`}>
                    {
                      wallet.dpos
                        ? t('Delegate #{{rank}}', { rank: wallet.dpos.delegate.rank })
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
