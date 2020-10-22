import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TransactionsTable from './transactionsTable';
import GroupsTable from './groupsTable';
import styles from './multiSignature.css';

const MultiSignature = ({
  t,
  host,
  multisignGroups,
  transactions,
  selectedGroupId,
  setSelectedGroupId,
}) => (
  <section className={`${grid.row} ${styles.tablesContainer}`}>
    <div className={`${grid['col-xs-12']} ${grid['col-md-4']}`}>
      <GroupsTable
        t={t}
        groups={multisignGroups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
      />
    </div>
    <div className={`${grid['col-xs-12']} ${grid['col-md-8']}`}>
      <TransactionsTable
        t={t}
        host={host}
        transactions={transactions}
      />
    </div>
  </section>
);

export default MultiSignature;
