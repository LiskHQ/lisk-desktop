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
    placeholder: 'Address or Public key',
    name: 'sender',
    type: 'address',
  }, {
    label: t('Message'),
    // TODO: Replace with "Your message" when API allows message param
    placeholder: t('Filtering by message not yet available'),
    name: 'message',
    type: 'text',
    // TODO: Enable field when API allows message param
    disabled: true,
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
      <TransactionsTable isLoadMoreEnabled filters={filters} fields={fields} title={t('All transactions')} transactions={transactions} />
    </div>
  );
};

export default Transactions;
