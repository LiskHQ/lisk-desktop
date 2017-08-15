import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import { transactions } from '../../utils/api/account';
import TransactionsHeader from './transactionsHeader';
import TransactionRow from './transactionRow';
import styles from './transactions.css';

class Transactions extends React.Component {
  constructor() {
    super();
    this.canLoadMore = true;
  }

  loadMore() {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      transactions(this.props.activePeer, this.props.address, 20, this.props.transactions.length)
      .then((res) => {
        this.canLoadMore = parseInt(res.count, 10) > this.props.transactions.length;
        this.props.transactionsLoaded(res.transactions);
      })
      .catch(error => console.error(error.message)); // eslint-disable-line no-console
    }
  }

  render() {
    return (
      <div className='box noPaddingBox'>
        {this.props.transactions.length > 0 ?
          <table className={tableStyle.table}>
          <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
          <tbody>
            {this.props.transactions.map(transaction => (
              <TransactionRow address={this.props.address}
                key={transaction.id}
                tableStyle={tableStyle}
                value={transaction}>
              </TransactionRow>
            ))}
          </tbody>
        </table> :
          <p className={`${styles.empty} hasPaddingRow`}>No transactions</p>
        }
        <Waypoint onEnter={() => { this.loadMore(); } }></Waypoint>
      </div>
    );
  }
}

export default Transactions;
