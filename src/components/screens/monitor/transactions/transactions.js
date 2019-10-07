import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import TransactionsTable from '../../../shared/transactionsTable';
import PageLayout from '../../../toolbox/pageLayout';

const Transactions = ({ t, transactions }) => {
  const columns = [
    { header: 'Sender', className: `${grid['col-md-3']} ${grid['col-xs-3']}`, key: 'senderId' },
    { header: 'Recipient', className: `${grid['col-md-3']} ${grid['col-xs-3']}`, key: 'recipientId' },
    {
      header: 'Date', className: `${grid['col-md-2']} ${grid['col-xs-2']}`, key: 'timestamp', isSortingColumn: true, defaultSort: true,
    },
    {
      header: 'Amount', className: `${grid['col-md-2']} ${grid['col-xs-2']}`, key: 'amount', isSortingColumn: true,
    },
    { header: 'Fee', className: `${grid['col-md-1']} ${grid['col-xs-1']}`, key: 'fee' },
    { header: 'Status', className: `${grid['col-md-1']} ${grid['col-xs-1']}`, key: 'confirmations' },
  ];

  return (
    <PageLayout>
      <TransactionsTable loadMore={() => transactions.loadData({ offset: transactions.data.data.length })} columns={columns} title={t('All transactions')} transactions={transactions} />
    </PageLayout>
  );
};

export default Transactions;
