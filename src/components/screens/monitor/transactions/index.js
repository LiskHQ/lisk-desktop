import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Overview from './overview';
import TransactionsTable from '../../../shared/transactionsTable';
import withData from '../../../../utils/withData';
import liskServiceApi from '../../../../utils/api/lsk/liskService';

const fields = t => [{
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

export const TransactionsPure = ({ t, transactions }) => {
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

export default compose(
  withData({
    transactions: {
      apiUtil: liskServiceApi.getTransactions,
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(TransactionsPure);
