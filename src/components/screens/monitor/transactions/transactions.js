import React from 'react';
import MonitorHeader from '../header';
import TransactionsTable from '../../../shared/transactionsTable';

const Transactions = ({ t, transactions }) => {
  const fields = [{
    label: t('Date Range'),
    name: 'date',
    type: 'date-range',
  }, {
    label: t('Amount Range'),
    name: 'amount',
    type: 'number-range',
  }, {
    label: t('Sender'),
    placeholder: t('Address or Public key'),
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
    placeholder: t('All types'),
    name: 'type',
    type: 'select',
  }, {
    label: t('Height'),
    placeholder: t('Eg. {{value}}', { value: '10180477' }),
    name: 'height',
    type: 'integer',
  }];

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
      <TransactionsTable
        isLoadMoreEnabled
        filters={filters}
        fields={fields}
        title={t('All transactions')}
        transactions={transactions}
      />
    </div>
  );
};

export default Transactions;
