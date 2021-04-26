import React from 'react';

import TransactionsTable from '@shared/transactionsTable';
import Overview from './overview';

const fields = t => [{
  label: t('Date Range'),
  name: 'date',
  type: 'date-range',
}, {
  label: t('Amount Range'),
  name: 'amount',
  type: 'number-range',
}, {
  label: t('Address'),
  placeholder: t('Address or Public key'),
  name: 'address',
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
  name: 'moduleAssetId',
  type: 'select',
}, {
  label: t('Height'),
  placeholder: t('Eg. {{value}}', { value: '10180477' }),
  name: 'height',
  type: 'integer',
}];

const Transactions = ({ t, transactions }) => {
  const filters = {
    dateFrom: '',
    dateTo: '',
    message: '',
    amountFrom: '',
    amountTo: '',
    moduleAssetId: '',
    height: '',
    recipient: '',
    address: '',
  };
  const canLoadMore = transactions.meta
    ? transactions.data.length < transactions.meta.total
    : false;

  return (
    <div>
      <Overview />
      <TransactionsTable
        isLoadMoreEnabled
        filters={filters}
        fields={fields(t)}
        title={t('All transactions')}
        transactions={transactions}
        canLoadMore={canLoadMore}
      />
    </div>
  );
};

export default Transactions;
