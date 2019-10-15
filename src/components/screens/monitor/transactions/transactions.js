import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MonitorHeader from '../header';
import TransactionsTable from '../../../shared/transactionsTable';

const Transactions = ({ t, transactions }) => {
  const fields = [{
    label: t('Date'),
    name: 'date',
    type: 'date-range',
  }, {
    label: t('Amount Range'),
    name: 'amount',
    type: 'number-range',
  }, {
    label: t('Sender'),
    placeholder: 'Address or Public key',
    name: 'sender',
    type: 'address',
  }, {
    label: t('Message'),
    placeholder: t('Your message'),
    name: 'message',
    type: 'text',
  }, {
    label: t('Recipient'),
    placeholder: t('Address or Public key'),
    name: 'recipient',
    type: 'address',
  }, {
    label: t('Type'),
    placeholder: t('Eg. {{value}}', { value: '1,5' }),
    name: 'type',
    type: 'text',
  }, {
    label: t('Height'),
    placeholder: t('Eg. {{value}}', { value: '10180477' }),
    name: 'height',
    type: 'integer',
  }];

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

  const filters = {
    dateFrom: '',
    dateTo: '',
    message: '',
    amountFrom: '',
    amountTo: '',
    type: '',
    height: '',
    recipient: '',
    sender: '',
  };

  return (
    <div>
      <MonitorHeader />
      <TransactionsTable isLoadMoreEnabled filters={filters} fields={fields} columns={columns} title={t('All transactions')} transactions={transactions} />
    </div>
  );
};

export default Transactions;
