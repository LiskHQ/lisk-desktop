import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Tooltip from '@views/basics/tooltip/tooltip';
import { PrimaryButton } from '@views/basics/buttons';
import DialogLink from '@views/basics/dialog/link';
import AccountMigration from '@shared/accountMigration';
import { hasEnoughBalanceForReclaim } from '@utils/account';
import { fromRawLsk } from '@utils/lsk';
import { balanceNeededForReclaim } from '@constants';
import { selectActiveTokenAccount } from '@store/selectors';
import styles from './index.css';

const Reclaim = ({ t }) => {
  const account = useSelector(selectActiveTokenAccount);
  const hasEnoughBalance = hasEnoughBalanceForReclaim(Number(account.token?.balance));

  return (
    <div className={`${styles.container} ${styles.reclaim}`}>
      <h4>{t('Update to your new account')}</h4>
      <p>
        {t('Your tokens and passphrase are safe.')}
        <br />
        {t('We kindly ask you to transfer your balance to the new account.')}
      </p>
      <section className={styles.box}>
        <div className={styles.accountMigrationContainer}>
          <AccountMigration account={account} showBalance />
        </div>
        <div>
          <h5 className={styles.listHeading}>{t('You will be able to:')}</h5>
          <ul className={styles.list}>
            <li>{t('Use your old passphrase ')}</li>
            <li>{t('Access your old address and transaction history')}</li>
          </ul>
        </div>
      </section>
      <section className={styles.box}>
        <h5 className={styles.listHeading}>{t('All you need to do:')}</h5>
        <ul className={styles.list}>
          <li className={`${styles.step} ${hasEnoughBalance ? styles.check : styles.green}`}>
            <div>
              {t('Deposit at least {{amount}} LSK to your new account', { amount: fromRawLsk(balanceNeededForReclaim) })}
              <Tooltip position="right" size="m">
                <>
                  <p>
                    {t('Since you want to reclaim your LSK on the new blockchain, you need to pay the fee from your new account.')}
                  </p>
                  <br />
                  <p>
                    {t('Hence your LSK in your old account can not be used to pay the fee. Read more')}
                  </p>
                  <br />
                  <p
                    className={styles.link}
                    onClick={() => {
                      window.open('https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration#MigrateanunitiliazedAccount', '_blank', 'rel=noopener noreferrer');
                    }}
                  >
                    {t('Read more')}
                  </p>
                </>
              </Tooltip>
              <br />
              {!hasEnoughBalance && (
                <>
                  <span>
                    {t('An initial one-time transfer fee will be deducted from the new account.')}
                  </span>
                  <br />
                  <span>
                    {t('Please use ')}
                    <span
                      className={styles.link}
                      onClick={() => {
                        window.open('https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration#MigrateanunitiliazedAccount', '_blank', 'rel=noopener noreferrer');
                      }}
                    >
                      {t('external services')}
                    </span>
                    {t(' to deposit LSK.')}
                  </span>
                </>
              )}
            </div>
          </li>
          <li className={`${styles.step} ${hasEnoughBalance && styles.green}`}>
            <div>
              {t('Send a reclaim transaction')}
              <br />
              <span>
                {t('Once you have enough tokens on your new account you will be able to send a transaction.')}
              </span>
            </div>
          </li>
        </ul>
      </section>
      <DialogLink component="reclaimBalance">
        <PrimaryButton
          className={styles.button}
          disabled={!hasEnoughBalance}
        >
          {t('Continue')}
        </PrimaryButton>
      </DialogLink>
    </div>
  );
};

export default withTranslation()(Reclaim);
