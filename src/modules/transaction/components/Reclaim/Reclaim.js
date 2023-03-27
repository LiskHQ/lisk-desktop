import React from 'react';
import MigrationDetails from '@legacy/components/MigrationDetails';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './Reclaim.css';

const Reclaim = ({ account, t, transactionJSON }) => {
  const { data: tokens } = useTokensBalance();
  const token = tokens?.data?.[0];

  return (
    <>
      <section>
        <MigrationDetails wallet={account} showBalance={false} />
      </section>
      <section className={styles.section}>
        <label>{t('Balance to reclaim')}</label>
        <TokenAmount val={BigInt(account.legacy.balance).toString()} token={token} />
      </section>
      <section className={`${styles.section} tx-fee-section`}>
        <label>{t('Transaction fee')}</label>
        <TokenAmount val={BigInt(transactionJSON.fee).toString()} token={token} />
      </section>
    </>
  );
};

export default Reclaim;
