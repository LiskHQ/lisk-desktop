import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Tooltip from 'src/theme/Tooltip';
import { PrimaryButton } from 'src/theme/buttons';
import DialogLink from 'src/theme/dialog/link';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { useDeprecatedAccount } from '@account/hooks';
import { useGetInitializationFees } from '@token/fungible/hooks/queries';
import { useFees } from '@transaction/hooks/queries/useFees';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import MigrationDetails from '../MigrationDetails';
import styles from './reclaim.css';

const AccountsComparison = ({ t }) => {
  useDeprecatedAccount();
  useSchemas();
  const wallet = useSelector(selectActiveTokenAccount);
  const { data: fees } = useFees();
  const { isAccountInitialized, initializationFees } = useGetInitializationFees({
    address: wallet.summary?.address,
    tokenID: fees?.data?.feeTokenID,
  });
  const additionalByteFee = BigInt(1000000);
  const extraCommandFee = BigInt(initializationFees?.userAccount || 0) + additionalByteFee;
  const amount = convertFromBaseDenom(extraCommandFee, wallet.token?.[0]);
  const isInitializedAndHasEnoughBalance =
    isAccountInitialized &&
    BigInt(wallet.token?.[0]?.availableBalance || 0) >= BigInt(extraCommandFee || 0);

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
          <li
            className={`${styles.step} ${
              isInitializedAndHasEnoughBalance ? styles.check : styles.green
            }`}
          >
            <div>
              {t('Deposit at least {{amount}} LSK to your new account', { amount })}
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
                        'https://lisk.com/blog/posts/reclaiming-a-lisk-account',
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
              <>
                <span>
                  {t(
                    'Transfer {{amount}} LSK to your account {{address}} to initiate the reclaim tokens.',
                    { amount, address: wallet.summary?.address }
                  )}
                </span>
                <br />
              </>
            </div>
          </li>
          <li
            className={`${styles.step} ${
              isInitializedAndHasEnoughBalance ? styles.check : styles.green
            }`}
          >
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
      <DialogLink component="reclaimBalance" data={{ tokenID: fees?.data?.feeTokenID }}>
        <PrimaryButton className={styles.button} disabled={!isInitializedAndHasEnoughBalance}>
          {t('Continue')}
        </PrimaryButton>
      </DialogLink>
    </div>
  );
};

export default withTranslation()(AccountsComparison);
