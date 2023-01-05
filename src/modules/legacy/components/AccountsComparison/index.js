import React, { useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Tooltip from 'src/theme/Tooltip';
import { PrimaryButton } from 'src/theme/buttons';
import DialogLink from 'src/theme/dialog/link';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { useDeprecatedAccount } from '@account/hooks';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { dustThreshold } from '@wallet/configuration/constants';
import MigrationDetails from '../MigrationDetails';
import styles from './reclaim.css';

const AccountsComparison = ({ t }) => {
  useDeprecatedAccount();
  useSchemas();
  const wallet = useSelector(selectActiveTokenAccount);
  const nonce = wallet.sequence?.nonce;
  const hasEnoughBalance = Number(wallet.token?.[0]?.availableBalance) >= dustThreshold;
  const hasDepositedTokens = useMemo(
    () => hasEnoughBalance && nonce >= 0,
    [nonce, hasEnoughBalance]
  );

  return (
    <div className={`${styles.container} ${styles.reclaim}`}>
      <h4>{t('Reclaim LSK tokens')}</h4>
      <p>
        {t('Your tokens and passphrase are safe.')}
        <br />
        {t('We kindly ask you to transfer your balance to the new account.')}
      </p>
      <section className={styles.box}>
        <div className={styles.migrationDetailsContainer}>
          <MigrationDetails wallet={wallet} showBalance />
        </div>
        <div>
          <h5 className={styles.listHeading}>{t('You will be able to:')}</h5>
          <ul className={styles.list}>
            <li>{t('Use your old secret recovery phrase')}</li>
            <li>{t('Access your old address')}</li>
          </ul>
        </div>
      </section>
      <section className={styles.box}>
        <h5 className={styles.listHeading}>
          {t('All you need to do before your balance transfer can be complete:')}
        </h5>
        <ul className={styles.list}>
          {!hasDepositedTokens && (
            <li className={`${styles.step} ${styles.green}`}>
              <div>
                {t('Deposit at least {{amount}} LSK to your new account', {
                  amount: fromRawLsk(dustThreshold),
                })}
                <Tooltip position="right" size="m">
                  <>
                    <p>
                      {t(
                        'Since you want to reclaim your LSK on the new blockchain, you need to pay the network fee from your new account.'
                      )}
                    </p>
                    <br />
                    <p>{t('Hence your LSK in your old account can not be used to pay the fee.')}</p>
                    <br />
                    <p
                      className={`${styles.link} link`}
                      onClick={() => {
                        window.open(
                          'https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration#MigrateanunitiliazedAccount',
                          '_blank',
                          'rel=noopener noreferrer'
                        );
                      }}
                    >
                      {t('Read more')}
                    </p>
                  </>
                </Tooltip>
                <br />
                {/* {!hasEnoughBalance && ( */}
                <>
                  <span>
                    {t('An initial one-time transfer fee will be deducted from the new account.')}
                  </span>
                  <br />
                  <span>
                    {t('Please use ')}
                    <span
                      className={`${styles.link} link`}
                      onClick={() => {
                        window.open(
                          'https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration#MigrateanunitiliazedAccount',
                          '_blank',
                          'rel=noopener noreferrer'
                        );
                      }}
                    >
                      {t('external services')}
                    </span>
                    {t(' to deposit LSK.')}
                  </span>
                </>
                {/* )} */}
              </div>
            </li>
          )}
          <li className={`${styles.step} ${hasDepositedTokens && styles.green}`}>
            <div>
              {t('Send a reclaim transaction')}
              <br />
              <span>
                {t(
                  'Now that you have enough tokens on your new account, please continue to send the reclaim transaction.'
                )}
              </span>
            </div>
          </li>
        </ul>
      </section>
      <DialogLink component="reclaimBalance" data={{ tokenID: wallet.token?.[0]?.tokenID }}>
        <PrimaryButton className={styles.button} disabled={!hasEnoughBalance}>
          {t('Continue')}
        </PrimaryButton>
      </DialogLink>
    </div>
  );
};

export default withTranslation()(AccountsComparison);
