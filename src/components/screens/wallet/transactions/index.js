import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import txFilters from '../../../../constants/transactionFilters';
import BoxTabs from '../../../toolbox/tabs';
import Table from '../../../toolbox/table';
import styles from './transactions.css';
import header from './tableHeader';
import FilterBar from '../../../shared/filterBar';
import withFilters from '../../../../utils/withFilters';
import TransactionRow from './transactionRow';
import FilterDropdown from './filterDropdown';

const tabsData = (t, activeToken) => {
  const all = {
    name: t('All transactions'),
    value: txFilters.all,
    className: 'filter-all',
  };
  const filtered = [
    {
      name: t('Incoming transactions'),
      value: txFilters.incoming,
      className: 'filter-in',
    },
    {
      name: t('Outgoing transactions'),
      value: txFilters.outgoing,
      className: 'filter-out',
    },
  ];

  if (activeToken === 'LSK') return [all, ...filtered];
  return [all];
};

const Tabs = ({ t, onTabChange }) => {
  const activeToken = useSelector(state => state.settings.token.active);
  const tabs = tabsData(t, activeToken);
  const [active, setActive] = useState(tabs[0].value);

  return (
    <BoxTabs
      tabs={tabs}
      active={active}
      onClick={({ value }) => {
        setActive(value);
        onTabChange({ tab: value });
      }}
    />
  );
};

const Transactions = ({
  transactions,
  activeToken,
  filters,
  applyFilters,
  clearFilter,
  clearAllFilters,
  host,
  t,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    transactions.loadData({ offset: transactions.data.length });
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

  return (
    <Box main isLoading={transactions.isLoading} className="transactions-box">
      <BoxHeader>
        <Tabs t={t} onTabChange={applyFilters} />
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
      <BoxContent className={styles.content}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={TransactionRow}
          loadData={handleLoadMore}
          header={header(t, activeToken)}
          error={transactions.error}
          canLoadMore={canLoadMore}
          additionalRowProps={{ t, activeToken, host }}
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

export default withFilters('transactions', defaultFilters, defaultSort)(Transactions);
