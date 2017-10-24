import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import buttonStyle from 'react-toolbox/lib/button/theme.css';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import RelativeLink from '../relativeLink';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
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

  componentDidUpdate() {
    const { count, transactions } = this.props;
    this.canLoadMore = count === null || count > transactions.length;
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
          <p className={`${styles.empty} hasPaddingRow empty-message`}>
            {this.props.t('There are no transactions, yet.')} &nbsp;
            <RelativeLink className={`${styles.button} ${buttonStyle.button} ${buttonStyle.primary} ${buttonStyle.raised} receive-lsk-button ${offlineStyle.disableWhenOffline}`}
              to='receive'>{this.props.t('Receive LSK')}</RelativeLink>
          </p>
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
