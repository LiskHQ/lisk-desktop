import React, { useEffect } from 'react';
import { compose } from 'redux';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Table from '../../../toolbox/table';
import styles from './transactions.css';
import header from './tableHeader';
import FilterBar from '../../../shared/filterBar';
import withFilters from '../../../../utils/withFilters';
import withData from '../../../../utils/withData';
import { getDelegates } from '../../../../utils/api/delegate';
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
  host,
  t,
  isWallet,
  votedDelegates,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    transactions.loadData({ offset: transactions.data.length, sort });
  };

  const canLoadMore = transactions.meta
    ? transactions.meta.count > transactions.data.length
    : false;

  const formatters = {
    dateFrom: value => `${t('From')}: ${value}`,
    dateTo: value => `${t('To')}: ${value}`,
    amountFrom: value => `> ${value} ${activeToken}`,
    amountTo: value => `< ${value} ${activeToken}`,
    message: value => `${t('Message')}: ${value}`,
  };

  useEffect(() => {
    // This will automatically load the new data too.
    clearAllFilters();
  }, [activeToken]);

  useEffect(() => {
    if (isWallet) {
      transactions.loadData({ offset: 0, sort, ...filters });
    }
  }, [sort]);

  useEffect(() => {
    const addressList = transactions.data && transactions.data.reduce((acc, data) => {
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
  }, [transactions.data]);

  return (
    <Box main isLoading={transactions.isLoading} className={`${styles.wrapper} transactions-box`}>
      <BoxHeader>
        {
          activeToken === 'LSK' ? (
            <FilterDropdown filters={filters} applyFilters={applyFilters} />
          ) : null
        }
      </BoxHeader>
      <FilterBar {...{
        clearFilter, clearAllFilters, filters, formatters, t,
      }}
      />
      <BoxContent className={`${styles.content} transaction-results`}>
        <Table
          data={pending.concat(transactions.data)}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          additionalRowProps={{
            t,
            activeToken,
            host,
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

export default compose(
  withData({
    votedDelegates: {
      apiUtil: ({ networks }, params) => getDelegates({ network: networks.LSK, params }),
      defaultData: {},
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
)(Transactions);
