import { withTranslation } from 'react-i18next';
import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import { tokenMap } from '../../../constants/tokens';
import { transactionNames } from '../../../constants/transactionTypes';
import AccountVisualWithAddress from '../accountVisualWithAddress';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxHeader from '../../toolbox/box/header';
import FilterBar from '../filterBar';
import FilterDropdownButton from '../filterDropdownButton';
import Icon from '../../toolbox/icon';
import LiskAmount from '../liskAmount';
import LoadLatestButton from '../loadLatestButton';
import Table from '../../toolbox/list';
import Tooltip from '../../toolbox/tooltip/tooltip';
import routes from '../../../constants/routes';
import styles from './transactionsTable.css';
import withFilters from '../../../utils/withFilters';
import withResizeValues from '../../../utils/withResizeValues';

const roundSize = 101;

const TransactionRow = React.memo(({ data, className, t }) => (
  <Link
    key={data.id}
    className={`${grid.row} ${className}`}
    to={`${routes.transactions.path}/${data.id}`}
  >
    <span className={grid['col-xs-3']}>
      <AccountVisualWithAddress
        address={data.senderId}
        transactionSubject="senderId"
        transactionType={data.type}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-md-3']}>
      <AccountVisualWithAddress
        address={data.recipientId}
        transactionSubject="recipientId"
        transactionType={data.type}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-md-2']}>
      <DateTimeFromTimestamp time={data.timestamp * 1000} token="BTC" />
    </span>
    <span className={grid['col-md-2']}>
      <LiskAmount val={data.amount} token={tokenMap.LSK.key} />
    </span>
    <span className={grid['col-md-1']}>
      <Tooltip
        title={t('Transaction')}
        className="showOnBottom"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<LiskAmount val={data.fee} token={tokenMap.LSK.key} />}
        size="s"
      >
        <p>{`${data.type} - ${transactionNames(t)[data.type]}`}</p>
      </Tooltip>
    </span>
    <span className={grid['col-md-1']}>
      <Tooltip
        title={data.confirmations > roundSize ? t('Confirmed') : t('Pending')}
        className="showOnLeft"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<Icon name={data.confirmations > roundSize ? 'approved' : 'pending'} />}
        size="s"
      >
        <p>{`${data.confirmations}/${roundSize} ${t('Confirmations')}`}</p>
      </Tooltip>
    </span>
  </Link>
));

const header = changeSort => ([
  {
    title: 'Sender',
    classList: grid['col-xs-3'],
  },
  {
    title: 'Recipient',
    classList: grid['col-xs-3'],
  },
  {
    title: 'Date',
    classList: grid['col-xs-2'],
    sort: () => changeSort('timestamp'),
  },
  {
    title: 'Amount',
    classList: grid['col-xs-2'],
    sort: () => changeSort('amount'),
  },
  {
    title: 'Fee',
    classList: grid['col-xs-1'],
  },
  {
    title: 'Status',
    classList: grid['col-xs-1'],
  },
]);

const TransactionsTable = ({
  title,
  transactions,
  isLoadMoreEnabled,
  t,
  fields,
  filters,
  applyFilters,
  clearFilter,
  clearAllFilters,
  changeSort,
  sort,
}) => {
  const handleLoadMore = () => {
    transactions.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: transactions.data.length,
      sort,
    }));
  };

  const formatters = {
    height: value => `${t('Height')}: ${value}`,
    type: value => `${t('Type')}: ${value}`,
    sender: value => `${t('Sender')}: ${value}`,
    recipient: value => `${t('Recipient')}: ${value}`,
  };

  return (
    <Box main isLoading={transactions.isLoading} className="transactions-box">
      <BoxHeader>
        <h1>{title}</h1>
        <FilterDropdownButton
          fields={fields}
          filters={filters}
          applyFilters={applyFilters}
        />
      </BoxHeader>
      {isLoadMoreEnabled
        && (
        <LoadLatestButton
          event="update.transactions.confirmed"
          onClick={transactions.loadData}
        >
          {t('New transactions')}
        </LoadLatestButton>
        )
      }
      <FilterBar {...{
        clearFilter, clearAllFilters, filters, formatters, t,
      }}
      />
      <BoxContent className={styles.content}>
        <Table
          data={transactions.data}
          isLoading={transactions.isLoading}
          row={props => <TransactionRow t={t} {...props} />}
          loadData={handleLoadMore}
          header={header(changeSort)}
          currentSort={sort}
        />
      </BoxContent>
    </Box>
  );
};

TransactionsTable.defaultProps = {
  isLoadMoreEnabled: false,
  filters: {},
  fields: [],
};

const defaultFilters = {
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

const defaultSort = 'timestamp:desc';

export default withFilters('transactions', defaultFilters, defaultSort)(
  withResizeValues(withTranslation()(TransactionsTable)),
);
