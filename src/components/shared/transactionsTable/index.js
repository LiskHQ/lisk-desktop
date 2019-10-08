import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import AccountVisual from '../../toolbox/accountVisual';
import Box from '../../toolbox/box';
import breakpoints from '../../../constants/breakpoints';
import Icon from '../../toolbox/icon';
import IconlessTooltip from '../iconlessTooltip';
import LiskAmount from '../liskAmount';
import regex from '../../../utils/regex';
import routes from '../../../constants/routes';
import styles from './transactionsTable.css';
import TableRow from '../../toolbox/table/tableRow';

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingColumn: props.columns.find(column => column.defaultSort).key,
      ascendingSorting: true,
      windowSize: 0,
    };

    this.changeSorting = this.changeSorting.bind(this);
    this.renderCellContent = this.renderCellContent.bind(this);
    this.renderTransactions = this.renderTransactions.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    const windowSize = window.innerWidth;
    this.setState(() => ({
      windowSize,
    }));
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  renderCellContent(column, transaction) {
    const { t } = this.props;
    const { windowSize } = this.state;

    switch (column.key) {
      case 'senderId':
      case 'recipientId':
        return (
          <div className={`${styles.address}`}>
            <AccountVisual address={transaction[column.key]} size={32} />
            <span className={`${styles.addressValue}`}>
              {windowSize < breakpoints.m ? transaction[column.key].replace(regex.lskAddressTrunk, '$1...$3') : transaction[column.key]}
            </span>
          </div>
        );
      case 'amount':
        return (
          <React.Fragment>
            <LiskAmount val={transaction[column.key]} />
&nbsp;
            {t('LSK')}
          </React.Fragment>
        );
      case 'fee':
        return (
          <IconlessTooltip
            tooltipContent={<p>{`${t('Type')} ${transaction.type}`}</p>}
            title={t('Transaction')}
            className="showOnBottom"
            tooltipClassName={styles.tooltip}
          >
            <div>
              <LiskAmount val={transaction[column.key]} />
&nbsp;
              {t('LSK')}
            </div>
          </IconlessTooltip>
        );
      case 'timestamp':
        return <DateTimeFromTimestamp time={transaction[column.key]} token="LSK" />;
      case 'confirmations':
        return (
          <IconlessTooltip
            tooltipContent={<p>{`${transaction.confirmations}/101 ${t('Confirmations')}`}</p>}
            title={transaction.confirmations > 0 ? t('Confirmed') : t('Pending')}
            className="showOnLeft"
            tooltipClassName={styles.tooltip}
          >
            {transaction.confirmations > 0 ? <Icon name="approved" /> : <Icon name="pending" />}
          </IconlessTooltip>
        );
      default:
        return transaction[column.key];
    }
  }

  // TODO add test when sorting is enabled
  // istanbul ignore next
  changeSorting(column) {
    if (column.isSortingColumn) {
    // Only changes the caret.
    // TODO: Implementation of sorting functionality to be done in a separate ticket.
      this.setState({
        sortingColumn: column.key,
        ascendingSorting:
        column.key === this.state.sortingColumn ? !this.state.ascendingSorting : true,
      });
    }
  }

  // TODO add test when sorting is enabled
  // istanbul ignore next
  renderTransactions() {
    const { sortingColumn } = this.state;

    return this.props.transactions.data.sort((a, b) =>
      (this.state.ascendingSorting
        ? b[sortingColumn] - a[sortingColumn]
        : a[sortingColumn] - b[sortingColumn]));
  }

  loadMore() {
    const { transactions } = this.props;
    transactions.loadData({ offset: transactions.data.length });
  }


  render() {
    const {
      title, transactions, columns, isLoadMoreEnabled, t,
    } = this.props;
    const { ascendingSorting } = this.state;

    console.log(transactions);

    return (
      <Box width="full" isLoading={transactions.isLoading}>
        <Box.Header>
          <h1>{t(title)}</h1>
        </Box.Header>
        <div>
          {!!transactions.data.length && (
          <React.Fragment>
            <TableRow isHeader>
              {columns.map(column => (
                <div
                  onClick={
                    /* TODO add test when sorting is enabled */
                    /* istanbul ignore next */
                    () => this.changeSorting(column)
                  }
                  key={column.key}
                  className={`${column.className} ${
                    column.isSortingColumn ? styles.sortingColumn : ''
                  }`}
                >
                  {t(column.header)}
                  {column.isSortingColumn && this.state.sortingColumn === column.key && (
                  <div
                    className={[
                      styles.arrow,
                      // TODO add test when sorting is enabled
                      // istanbul ignore next
                      ascendingSorting ? styles.arrowUp : styles.arrowDown,
                    ].join(' ')}
                  />
                  )}
                </div>
              ))}
            </TableRow>
            {transactions.data.map(transaction => (
              <Link
                key={transaction.id}
                to={`${routes.transactions.path}/${transaction.id}`}
                className={styles.rowLink}
              >
                <TableRow className={[grid.row, 'row'].join(' ')}>
                  {columns.map(column => (
                    <span key={column.key} className={column.className}>
                      {this.renderCellContent(column, transaction)}
                    </span>
                  ))}
                </TableRow>
              </Link>
            ))}
          </React.Fragment>
          )}
        </div>
        {isLoadMoreEnabled && (
          <Box.FooterButton
            className="load-more"
            onClick={this.loadMore}
          >
            {t('Load more')}
          </Box.FooterButton>
        )}
      </Box>
    );
  }
}

TransactionsTable.defaultProps = {
  isLoadMoreEnabled: false,
};

export default withTranslation()(TransactionsTable);
