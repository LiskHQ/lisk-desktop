import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import TransactionsTable from '../../../shared/transactionsTable';
import PageLayout from '../../../toolbox/pageLayout';

const Transactions = ({ t, transactions }) => {
  const columns = [
    { header: t('Sender'), className: `${grid['col-xs-3']}`, key: 'senderId' },
    { header: t('Recipient'), className: `${grid['col-xs-3']}`, key: 'recipientId' },
    {
      header: t('Date'), className: `${grid['col-xs-2']}`, key: 'timestamp', isSortingColumn: true, defaultSort: true,
    },
    {
      header: t('Amount'), className: `${grid['col-xs-2']}`, key: 'amount', isSortingColumn: true,
    },
    { header: t('Fee'), className: `${grid['col-xs-1']}  hidden-m`, key: 'fee' },
    { header: t('Status'), className: `${grid['col-xs-1']}`, key: 'confirmations' },
  ];

  return (
    <PageLayout>
      <TransactionsTable isLoadMoreEnabled columns={columns} title={t('All transactions')} transactions={transactions} />
    </PageLayout>
  );
};

export default Transactions;
