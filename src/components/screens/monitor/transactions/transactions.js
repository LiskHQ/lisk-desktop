import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import TransactionsTable from '../../../shared/transactionsTable';
import PageLayout from '../../../toolbox/pageLayout';

const Transactions = ({ t, transactions }) => {
  const columns = [
    { header: 'ID', className: `${grid['col-md-2']} ${grid['col-xs-2']}` },
    { header: 'Date', className: `${grid['col-md-2']} ${grid['col-xs-2']}` },
    { header: 'Sender', className: `${grid['col-md-2']} ${grid['col-xs-2']}` },
    { header: 'Recipient', className: `${grid['col-md-2']} ${grid['col-xs-2']}` },
    { header: 'Amount', className: `${grid['col-md-2']} ${grid['col-xs-2']}` },
    { header: 'Fee', className: `${grid['col-md-1']} ${grid['col-xs-1']}` },
    { header: 'Status', className: `${grid['col-md-1']} ${grid['col-xs-1']}` },
  ];

  return (
    <PageLayout>
      <TransactionsTable columns={columns} title={t('All transactions')} transactions={transactions} />
    </PageLayout>
  );
};

export default Transactions;
