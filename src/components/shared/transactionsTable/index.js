import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../toolbox/box';
import TableRow from '../../toolbox/table/tableRow';
import LiskAmount from '../liskAmount';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import Icon from '../../toolbox/icon';
import AccountVisual from '../../toolbox/accountVisual';
import styles from './transactionsTable.css';
import IconlessTooltip from '../iconlessTooltip';

class TransactionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingColumn: undefined,
      ascendingSorting: true,
    };

    this.toggleSorting = this.toggleSorting.bind(this);
    this.renderCellContent = this.renderCellContent.bind(this);
  }

  componentDidMount() {
    const sortingColumn = this.props.columns.find(column => column.defaultSort);
    this.setState({ sortingColumn: sortingColumn.key });
  }

  renderCellContent(column, transaction) {
    const { t } = this.props;

    switch (column.key) {
      case 'senderId':
      case 'recipientId':
        return (
          <div className={`${styles.address}`}>
            <AccountVisual address={transaction[column.key]} size={32} />
            <span className={`${styles.addressValue}`}>{transaction[column.key]}</span>
          </div>
        );
      case 'id':
        return (
          <Link to={`${column.pathPrefix}/${transaction[column.key]}`}>
            {transaction[column.key]}
          </Link>
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
        return transaction.confirmations > 0 ? <Icon name="approved" /> : <Icon name="pending" />;
      default:
        return transaction[column.key];
    }
  }

  toggleSorting(sortingColumn) {
    if (sortingColumn === this.state.sortingColumn) {
      this.setState({ ascendingSorting: !this.state.ascendingSorting });
    } else {
      this.setState({
        sortingDirection: 'ascending',
        sortingColumn,
      });
    }
  }

  render() {
    const {
      title, transactions, columns, loadMore, t,
    } = this.props;
    const { ascendingSorting } = this.state;

  return (
    <Box width="full">
      <Box.Header>
        <h1>{t(title)}</h1>
      </Box.Header>
      <div>
        {!!transactions.data.data && transactions.data.data.length && (
        <React.Fragment>
          <TableRow isHeader>
            {columns.map(column => (
                  <div
                    onClick={() => (column.isSortingColumn ? this.toggleSorting(column.key) : null)}
                    key={column.key}
                    className={`${column.className} ${column.isSortingColumn ? styles.sortingColumn : ''}`}
                  >
                    {t(column.header)}
                    {column.isSortingColumn && this.state.sortingColumn === column.key && <div className={`${styles.arrow} ${ascendingSorting ? styles.arrowUp : styles.arrowDown}`} />}
                  </div>
            ))}
          </TableRow>
          {transactions.data.data.map(transaction => (
            <TableRow key={transaction.id} className={`${grid.row}`}>
              {columns.map(column => (
                <span key={column.key} className={column.className}>
                      {this.renderCellContent(column, transaction)}
                </span>
              ))}
            </TableRow>
          ))}
        </React.Fragment>
        )}
      </div>
      {loadMore && (
      <Box.FooterButton
        onClick={loadMore}
      >
        {t('Load more')}
      </Box.FooterButton>
      )}
    </Box>
  );
  }
}

export default withTranslation()(TransactionsTable);
