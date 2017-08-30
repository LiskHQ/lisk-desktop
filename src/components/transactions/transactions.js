import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
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
      this.props.transactionsRequested({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 20,
        offset: this.props.transactions.length,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const shouldUpdate = ((nextProps.confirmedCount !== this.props.confirmedCount) ||
    (nextProps.pendingCount !== this.props.pendingCount));
    return shouldUpdate;
  }

  componentDidUpdate() {
    this.canLoadMore = this.props.count > this.props.transactions.length;
  }

  render() {
    return (
      <div className='box noPaddingBox verticalScroll'>
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
          <p className={`${styles.empty} hasPaddingRow empty-message`}>No transactions</p>
        }
        <Waypoint bottomOffset='-80%'
                  scrollableAncestor={window}
                  key={this.props.transactions.length}
                  onEnter={this.loadMore.bind(this)}></Waypoint>
      </div>
    );
  }
}

export default Transactions;
