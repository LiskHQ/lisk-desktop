import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import { tokenMap } from '../../../constants/tokens';
import Box from '../../toolbox/box';
import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';
import LiskAmount from '../liskAmount';
import Illustration from '../../toolbox/illustration';
import styles from './transactionsTable.css';
import FilterDropdownButton from '../filterDropdownButton';
import withResizeValues from '../../../utils/withResizeValues';
import withFilters from '../../../utils/withFilters';
import FilterBar from '../filterBar';
import routes from '../../../constants/routes';
import Table from '../../toolbox/table';
import AccountVisualWithAddress from '../accountVisualWithAddress';

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  handleLoadMore() {
    const { transactions, filters, sort } = this.props;

    transactions.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: transactions.data.length,
      sort,
    }));
  }

  render() {
    const {
      title,
      transactions,
      isLoadMoreEnabled,
      t,
      fields,
      filters,
      emptyStateMessage,
      applyFilters,
      clearFilter,
      clearAllFilters,
      changeSort,
      sort,
      isMediumViewPort,
    } = this.props;

    const roundSize = 101;

    const formatters = {
      height: value => `${t('Height')}: ${value}`,
      type: value => `${t('Type')}: ${value}`,
      sender: value => `${t('Sender')}: ${value}`,
      recipient: value => `${t('Recipient')}: ${value}`,
    };

    return (
      <Box main isLoading={transactions.isLoading} className="transactions-box">
        <Box.Header>
          <h1>{title}</h1>
          <FilterDropdownButton
            fields={fields}
            filters={filters}
            applyFilters={applyFilters}
          />
        </Box.Header>
        <FilterBar {...{
          clearFilter, clearAllFilters, filters, formatters, t,
        }}
        />
        {transactions.error ? (
          <Box.Content>
            <Box.EmptyState>
              <Illustration name="emptyWallet" />
              <h3>{emptyStateMessage || `${transactions.error}`}</h3>
            </Box.EmptyState>
          </Box.Content>
        ) : (
          <React.Fragment>
            <Box.Content className={styles.content}>
              <Table
                getRowLink={transaction => `${routes.monitorTransactions.path}/${transaction.id}`}
                onSortChange={changeSort}
                sort={sort}
                data={transactions.data}
                columns={[
                  {
                    header: t('Sender'),
                    className: grid['col-xs-3'],
                    getValue: transaction => (
                      <AccountVisualWithAddress address={transaction.senderId} isMediumViewPort={isMediumViewPort} transactionSubject="senderId" transactionType={transaction.type} showBookmarkedAddress />
                    ),
                  },
                  {
                    header: t('Recipient'),
                    className: grid['col-xs-3'],
                    getValue: transaction => (
                      <AccountVisualWithAddress address={transaction.recipientId} isMediumViewPort={isMediumViewPort} transactionSubject="recipientId" transactionType={transaction.type} showBookmarkedAddress />
                    ),
                  },
                  {
                    header: t('Date'),
                    className: grid['col-xs-2'],
                    id: 'timestamp',
                    isSortable: true,
                    getValue: transaction => (
                      <DateTimeFromTimestamp time={transaction.timestamp * 1000} token="BTC" />
                    ),
                  },
                  {
                    header: t('Amount'),
                    className: grid['col-xs-2'],
                    id: 'amount',
                    isSortable: true,
                    getValue: transaction => (
                      <LiskAmount val={transaction.amount} token={tokenMap.LSK.key} />
                    ),
                  },
                  {
                    header: t('Fee'),
                    className: grid['col-xs-1'],
                    getValue: transaction => (
                      <Tooltip
                        title={t('Transaction')}
                        className="showOnBottom"
                        tooltipClassName={styles.tooltip}
                        content={<LiskAmount val={transaction.fee} token={tokenMap.LSK.key} />}
                      >
                        <p>{`${t('Type')} ${transaction.type}`}</p>
                      </Tooltip>
                    ),
                  },
                  {
                    header: t('Status'),
                    className: grid['col-xs-1'],
                    getValue: transaction => (
                      <Tooltip
                        title={transaction.confirmations > roundSize ? t('Confirmed') : t('Pending')}
                        className="showOnLeft"
                        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
                        content={<Icon name={transaction.confirmations > roundSize ? 'approved' : 'pending'} />}
                      >
                        <p>{`${transaction.confirmations}/${roundSize} ${t('Confirmations')}`}</p>
                      </Tooltip>
                    ),
                  },
                ]}
              />
            </Box.Content>
            {isLoadMoreEnabled && (
              <Box.FooterButton className="load-more" onClick={this.handleLoadMore}>
                {t('Load more')}
              </Box.FooterButton>
            )}
          </React.Fragment>
        )}
      </Box>
    );
  }
}

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
