import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TransactionTypeFigure from './typeFigure/TransactionTypeFigure';
import TransactionAddress from './address/TransactionAddress';
import TransactionAmount from './amount/TransactionAmount';
import TransactionDetail from './transactionDetail';
import styles from './transactionRow.css';
import Spinner from '../spinner/spinner';
import LiskAmount from '../liskAmount';
import { DateTimeFromTimestamp } from '../timestamp/index';
import TableRow from '../toolbox/table/tableRow';
import Icon from '../toolbox/icon';

class TransactionRow extends React.Component {
  constructor() {
    super();

    this.state = {
      isConfirmed: false,
    };

    this.setIsConfirmed = this.setIsConfirmed.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.state.isConfirmed && nextProps.value.confirmations) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.setIsConfirmed, 2000);
    }

    return (!this.state.isConfirmed && nextState.isConfirmed)
      || nextProps.value.id !== this.props.value.id
      || nextProps.value.confirmations <= 1000;
  }

  componentDidMount() {
    if (this.props.value.confirmations && this.props.value.confirmations > 0) {
      this.setIsConfirmed();
    }
  }

  setIsConfirmed() {
    this.setState({
      isConfirmed: true,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const {
      address,
      bookmarks,
      onClick,
      t,
      token,
      value,
      columnClassNames,
    } = this.props;

    const { isConfirmed } = this.state;
    const hasConfirmations = value.confirmations && value.confirmations > 0;

    return (
      <TableRow className={`${grid.row} ${styles.row} ${!hasConfirmations ? styles.pending : ''} transactions-row`} onClick={() => onClick(this.props)}>
        <div className={`${columnClassNames.transaction} transactions-cell`}>
          <Icon name={address === value.recipientId ? 'incoming' : 'outgoing'} className={styles.inOutIcon} />
          <TransactionTypeFigure
            address={address === value.recipientId ? value.senderId : value.recipientId}
            transactionType={value.type}
          />
          <TransactionAddress
            address={address === value.recipientId ? value.senderId : value.recipientId}
            bookmarks={bookmarks}
            t={t}
            token={token}
            transactionType={value.type}
          />
        </div>
        <div className={`${columnClassNames.date} transactions-cell`}>
          <div className={`${styles.status} ${!isConfirmed ? styles.showSpinner : styles.showDate}`}>
            <Spinner completed={hasConfirmations} label={t('Pending...')} />
            <DateTimeFromTimestamp time={value.timestamp} token={token} />
          </div>
        </div>
        <div className={`${columnClassNames.fee} transactions-cell`}>
          <LiskAmount val={value.fee} />
          &nbsp;
          {token}
        </div>
        <div className={`${columnClassNames.details} transactions-cell`}>
          <TransactionDetail
            t={t}
            transaction={value}
          />
        </div>
        <div className={`${columnClassNames.amount} transactions-cell`}>
          <TransactionAmount
            address={address}
            token={token}
            transaction={value}
          />
        </div>
      </TableRow>
    );
  }
}

/* istanbul ignore next */
TransactionRow.defaultProps = {
  onClick: () => {},
  columnClassNames: {},
};

export default translate()(TransactionRow);
