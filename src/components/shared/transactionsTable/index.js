import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { connect } from 'react-redux';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import AccountVisual from '../../toolbox/accountVisual';
import Box from '../../toolbox/box';
import Icon from '../../toolbox/icon';
import IconlessTooltip from '../iconlessTooltip';
import LiskAmount from '../liskAmount';
import regex from '../../../utils/regex';
import Illustration from '../../toolbox/illustration';
import styles from './transactionsTable.css';
import FilterDropdownButton from '../filterDropdownButton';
import withResizeValues from '../../../utils/withResizeValues';
import withFilters from '../../../utils/withFilters';
import FilterBar from '../filterBar';
import routes from '../../../constants/routes';
import Table from '../../toolbox/table';
import transactionTypeIcons from '../../../constants/transactionTypeIcons';
import { transactionNames } from '../../../constants/transactionTypes';

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingColumn: props.columns.find(column => column.defaultSort).key,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  handleLoadMore() {
    const { transactions, filters } = this.props;

    transactions.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: transactions.data.length,
    }));
  }

  getTransformedAddress(address) {
    const { isMediumViewPort, bookmarks } = this.props;
    const bookmarkedAddress = bookmarks.LSK.find(element => element.address === address);

    if (bookmarkedAddress) return bookmarkedAddress.title;
    if (isMediumViewPort) return address.replace(regex.lskAddressTrunk, '$1...$3');
    return address;
  }

  renderAddressField(transaction, key) {
    const { t } = this.props;

    if (transaction.type !== 0 && key === 'recipientId') {
      return (
        <div className={`${styles.address}`}>
          <Icon
            className={styles.txIcon}
            name={transactionTypeIcons[transaction.type] || transactionTypeIcons.default}
          />
          <span className={styles.addressValue}>{t(transactionNames[transaction.type])}</span>
        </div>
      );
    }
    return (
      <div className={`${styles.address}`}>
        <AccountVisual address={transaction[key]} size={32} />
        <span className={styles.addressValue}>
          {this.getTransformedAddress(transaction[key])}
        </span>
      </div>
    );
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
    } = this.props;

    return (
      <Box width="full" isLoading={transactions.isLoading} className="transactions-box">
        <Box.Header className={styles.boxHeader}>
          <h1>{title}</h1>
          <FilterDropdownButton
            fields={fields}
            filters={filters}
            applyFilters={applyFilters}
          />
        </Box.Header>
        <FilterBar {...{
          clearFilter, clearAllFilters, filters, t,
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
                    getValue: transaction => this.renderAddressField(transaction, 'senderId'),
                  },
                  {
                    header: t('Recipient'),
                    className: grid['col-xs-3'],
                    getValue: transaction => this.renderAddressField(transaction, 'recipientId'),
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
                      <React.Fragment>
                        <LiskAmount val={transaction.amount} />
                        &nbsp;
                        {t('LSK')}
                      </React.Fragment>
                    ),
                  },
                  {
                    header: t('Fee'),
                    className: grid['col-xs-1'],
                    getValue: transaction => (
                      <IconlessTooltip
                        tooltipContent={<p>{`${t('Type')} ${transaction.type}`}</p>}
                        title={t('Transaction')}
                        className="showOnBottom"
                        tooltipClassName={styles.tooltip}
                      >
                        <div>
                          <LiskAmount val={transaction.fee} />
                          &nbsp;
                          {t('LSK')}
                        </div>
                      </IconlessTooltip>
                    ),
                  },
                  {
                    header: t('Status'),
                    className: grid['col-xs-1'],
                    getValue: transaction => (
                      <IconlessTooltip
                        tooltipContent={
                          <p>{`${transaction.confirmations}/101 ${t('Confirmations')}`}</p>
                        }
                        title={transaction.confirmations > 0 ? t('Confirmed') : t('Pending')}
                        className="showOnLeft"
                        tooltipClassName={styles.tooltip}
                      >
                        {transaction.confirmations > 0 ? (
                          <Icon name="approved" />
                        ) : (
                          <Icon name="pending" />
                        )}
                      </IconlessTooltip>
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

const defaultSort = 'timestamp:asc';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
});

export default connect(mapStateToProps)(withFilters('transactions', defaultFilters, defaultSort)(
  withResizeValues(withTranslation()(TransactionsTable)),
));
