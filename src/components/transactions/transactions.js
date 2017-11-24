import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import buttonStyle from 'react-toolbox/lib/button/theme.css';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import RelativeLink from '../relativeLink';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
import LiskAmount from '../liskAmount';
import styles from './transactions.css';
import copy from './../../assets/images/icons/copy.svg';

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

  copyAddress() {
    this.props.copyToClipboard(this.props.address);
  }

  componentDidUpdate() {
    const { count, transactions } = this.props;
    this.canLoadMore = count === null || count > transactions.length;
  }

  render() {
    return (
      <div className={`${styles.noPadding} box`}>
        <div className={styles.header__wrapper}>
          <div className={styles.header__mainSection}>Transactions</div>
          <div className={styles.header__accountSection}>
            <span className={styles.header__balance}><LiskAmount val={this.props.balance} /> </span>
            <span className={styles.header__balanceUnit}>LSK</span>
            <div onClick={this.copyAddress.bind(this)} className={styles.header__address}>
              <img src={copy} /> {this.props.address}</div>
          </div>
        </div>

        <ul className={styles.transaction_list}>
          <li className={`${styles.transaction_list_item} ${styles.active}`}>All</li>
          <li className={styles.transaction_list_item}>Incoming</li>
          <li className={styles.transaction_list_item}>Outgoing</li>
          <li className={styles.transaction_list_item}>Other</li>
        </ul>

        {this.props.transactions.length > 0 ?
          <div>
            <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
            {this.props.transactions.map(transaction => (
              <TransactionRow address={this.props.address}
                key={transaction.id}
                t={this.props.t}
                value={transaction}
                copy={this.props.copyToClipboard}>
              </TransactionRow>
            ))}
          </div> :
          <p className={`${styles.empty} hasPaddingRow empty-message`}>
            {this.props.t('There are no transactions, yet.')} &nbsp;
            <RelativeLink className={`${styles.button} ${buttonStyle.button} ${buttonStyle.primary} ${buttonStyle.raised} receive-lsk-button ${offlineStyle.disableWhenOffline}`}
              to='receive'>{this.props.t('Receive LSK')}</RelativeLink>
          </p>
        }
        <Waypoint bottomOffset='-80%'
          key={this.props.transactions.length}
          onEnter={this.loadMore.bind(this)}></Waypoint>
      </div>
    );
  }
}

export default Transactions;
