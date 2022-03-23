import React from 'react';

import TransactionsTable from '@transaction/list/transactionsTable';
import Overview from './overview';

const fields = t => [{
  label: t('Date range'),
  name: 'date',
  type: 'date-range',
}, {
  label: t('Amount range'),
  name: 'amount',
  type: 'number-range',
}, {
  label: t('Sender'),
  placeholder: t('Address or public key'),
  name: 'senderAddress',
  type: 'address',
}, {
  label: t('Recipient'),
  placeholder: t('Address or public key'),
  name: 'recipientAddress',
  type: 'address',
}, {
  label: t('Type'),
  placeholder: t('All types'),
  name: 'moduleAssetId',
  type: 'select',
}, {
  label: t('Height'),
  placeholder: t('e.g. {{value}}', { value: '10180477' }),
  name: 'height',
  type: 'integer',
}];

const Transactions = ({ t, transactions }) => {
  const filters = {
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
    moduleAssetId: '',
    height: '',
    recipientAddress: '',
    senderAddress: '',
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
