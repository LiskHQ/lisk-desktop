import React from 'react';
import MigrationDetails from '@legacy/components/MigrationDetails';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { tokenMap } from '@token/fungible/consts/tokens';
import styles from './Reclaim.css';

const Reclaim = ({ account, t, transactionJSON }) => (
  <>
    <section>
      <MigrationDetails wallet={account} showBalance={false} />
    </section>
    <section className={styles.section}>
      <label>{t('Balance to reclaim')}</label>
      <TokenAmount
        val={Number(account.legacy.balance)}
        token={tokenMap.LSK.key}
      />
    </section>
    <section className={`${styles.section} tx-fee-section`}>
      <label>{t('Transaction fee')}</label>
      <TokenAmount
        val={Number(transactionJSON.fee)}
        token={tokenMap.LSK.key}
      />
    </section>
  </>
);

export default Reclaim;
