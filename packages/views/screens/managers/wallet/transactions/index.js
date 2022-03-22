import React, { useEffect } from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentBlockHeight } from '@store/selectors';
import withFilters from '@utils/withFilters';
import withData from '@utils/withData';
import { getDelegates } from '@common/utilities/api/delegate';
import { normalizeTransactionParams } from '@utils/transaction';
import { getTransactions } from '@common/utilities/api/transaction';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import Table from '@toolbox/table';
import FilterBar from '@shared/filterBar';
import { DEFAULT_LIMIT } from '@constants';
import styles from './transactions.css';
import header from './tableHeader';
import TransactionRow from './transactionRow';
import FilterDropdown from './filterDropdown';

const Transactions = ({
  pending,
  transactions,
  activeToken,
  filters,
  applyFilters,
  changeSort,
  sort,
  clearFilter,
  clearAllFilters,
  t,
  votedDelegates,
  address,
  confirmedLength,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  useEffect(() => {
    // This will automatically load the new data too.
    clearAllFilters();
  }, [activeToken]);

  useEffect(() => {
    const addressList = transactions.data.data && transactions.data.data.reduce((acc, data) => {
      if (data.title === 'vote') {
        const votesList = data.asset.votes || [];
        const dataAddresses = votesList.map(vote => vote.delegateAddress);
        return acc.concat(dataAddresses);
      }
      return acc;
    }, []);
    if (addressList.length > 0) {
      votedDelegates.loadData({ addressList });
    }
  }, [transactions.data.data]);

  useEffect(() => {
    transactions.loadData();
  }, [pending.length, confirmedLength, address]);

  /* istanbul ignore next */
  const handleLoadMore = () => {
    transactions.loadData({
      offset: transactions.data.meta.count + transactions.data.meta.offset,
      sort,
      ...filters,
    });
  };

  const canLoadMore = transactions.data.meta
    ? transactions.data.meta.total > transactions.data.meta.count + transactions.data.meta.offset
    : false;

  const formatters = {
    dateFrom: value => `${t('From')}: ${value}`,
    dateTo: value => `${t('To')}: ${value}`,
    amountFrom: value => `> ${value} ${activeToken}`,
    amountTo: value => `< ${value} ${activeToken}`,
  };

  return (
    <Box main isLoading={transactions.isLoading} className={`${styles.wrapper} transactions-box`}>
      <BoxHeader>
        {
          activeToken === 'LSK' ? (
            <FilterDropdown
              filters={filters}
              applyFilters={f => applyFilters({ ...f, address })}
            />
          ) : null
        }
      </BoxHeader>
      <FilterBar {...{
        clearFilter, clearAllFilters, filters, formatters, t,
      }}
      />
      <BoxContent className={`${styles.content} transaction-results`}>
        <Table
          data={pending.concat(transactions.data.data)}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          additionalRowProps={{
            t,
            activeToken,
            host: address,
            delegates: votedDelegates.data,
            currentBlockHeight,
          }}
          header={header(t, activeToken, changeSort)}
          currentSort={sort}
          canLoadMore={canLoadMore}
          error={transactions.error.code !== 404 ? transactions.error : undefined}
          emptyState={{ message: t('This account does not have any transactions.') }}
        />
      </BoxContent>
    </Box>
  );
};

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  amountFrom: '',
  amountTo: '',
};
const defaultSort = 'timestamp:desc';

export default compose(
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params: normalizeTransactionParams(params) }, token),
      getApiParams: (state, { address, sort }) => ({
        token: state.settings.token.active,
        address,
        sort,
        limit: DEFAULT_LIMIT,
      }),
      defaultData: { data: [], meta: {} },
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? { data: [...oldData.data, ...response.data], meta: response.meta }
          : response
      ),
    },
    votedDelegates: {
      apiUtil: ({ networks }, params) => getDelegates({ network: networks.LSK, params }),
      defaultData: [],
      transformResponse: (response) => {
        const responseMap = response.data.reduce((acc, delegate) => {
          acc[delegate.address] = delegate;
          return acc;
        }, {});
        return responseMap;
      },
    },
  }),
  withFilters('transactions', defaultFilters, defaultSort),
  withTranslation(),
)(Transactions);
