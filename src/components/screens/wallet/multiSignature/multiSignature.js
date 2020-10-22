import React from 'react';
import TransactionsTable from './transactionsTable';
import GroupsTable from './groupsTable';
import styles from './multiSignature.css';

const MultiSignature = ({
  t,
  host,
  multisignGroups,
  transactions,
  setSelectedGroupId,
}) => (
  <section className={styles.tablesContainer}>
    <GroupsTable
      t={t}
      groups={multisignGroups}
      setSelectedGroupId={setSelectedGroupId}
    />
    <TransactionsTable
      t={t}
      host={host}
      transactions={transactions}
    />
  </section>
);

export default MultiSignature;
