import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import TransactionsTable from '../../../shared/transactionsTable';
import PageLayout from '../../../toolbox/pageLayout';
import routes from '../../../../constants/routes';

const Transactions = ({ t, transactions }) => {
  const columns = [
    {
      header: 'ID', className: `${grid['col-md-2']} ${grid['col-xs-2']}`, key: 'id', isLink: true, pathPrefix: routes.transactions.path,
    },
    { header: 'Date', className: `${grid['col-md-2']} ${grid['col-xs-2']}`, key: 'timestamp' },
    { header: 'Sender', className: `${grid['col-md-2']} ${grid['col-xs-2']}`, key: 'senderId' },
    { header: 'Recipient', className: `${grid['col-md-2']} ${grid['col-xs-2']}`, key: 'recipientId' },
    { header: 'Amount', className: `${grid['col-md-2']} ${grid['col-xs-2']}`, key: 'amount' },
    { header: 'Fee', className: `${grid['col-md-1']} ${grid['col-xs-1']}`, key: 'fee' },
    { header: 'Status', className: `${grid['col-md-1']} ${grid['col-xs-1']}`, key: 'type' },
  ];

  return (
    <PageLayout>
      <TransactionsTable columns={columns} title={t('All transactions')} transactions={transactions} />
    </PageLayout>
  );
};

export default Transactions;
