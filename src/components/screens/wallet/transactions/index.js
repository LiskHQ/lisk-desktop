import React, { useEffect } from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withFilters from 'utils/withFilters';
import withData from 'utils/withData';
import { getDelegates } from 'utils/api/delegate';
import { toRawLsk } from 'utils/lsk';
import { transformStringDateToUnixTimestamp } from 'utils/datetime';
import { getTransactions } from 'utils/api/transaction';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Table from '../../../toolbox/table';
import styles from './transactions.css';
import header from './tableHeader';
import FilterBar from '../../../shared/filterBar';
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
}) => {
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
  }, [pending.length]);

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
    message: value => `${t('Message')}: ${value}`,
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
            delegates: votedDelegates,
          }}
          header={header(t, activeToken, changeSort)}
          currentSort={sort}
          canLoadMore={canLoadMore}
          error={transactions.error}
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
  message: '',
};
const defaultSort = 'timestamp:desc';

/**
 * The implementation of this API endpoint and the ones implemented for Lisk Service
 * are different. this transformer adapts params temporarily before all the APIs
 * are unified. then we can remove this.
 *
 * @param {Object} params - All params and filters provided by WithFilters HOC
 */
const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    if (item === 'dateFrom' || item === 'dateTo') {
      acc[item] = transformStringDateToUnixTimestamp(params[item]);
    } else if (item === 'amountFrom' || item === 'amountTo') {
      acc[item] = toRawLsk(params[item]);
    } else {
      acc[item] = params[item];
    }

    return acc;
  }, {});

export default compose(
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params: transformParams(params) }, token),
      getApiParams: (state, { address, sort }) => ({
        token: state.settings.token.active,
        address,
        sort,
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
