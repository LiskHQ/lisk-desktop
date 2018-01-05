import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import buttonStyle from 'react-toolbox/lib/button/theme.css';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import RelativeLink from '../relativeLink';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
import styles from './transactions.css';

class TransactionsList extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  isLargeScreen() {
    return window.innerWidth > 768;
  }

  render() {
    return this.props.transactions.length > 0 ?
      <div className={`${styles.results} transaction-results`}>
        <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
        {this.props.transactions.map((transaction, i) => (
          <TransactionRow address={this.props.address}
            key={i}
            t={this.props.t}
            value={transaction}
            nextStep={this.props.nextStep}
          />
        ))}
        {
          this.isLargeScreen()
            ? <Waypoint bottomOffset='-80%'
              key={this.props.transactions.length}
              onEnter={() => { this.props.loadMore(); }}></Waypoint>
            : null
        }
      </div> :
      <p className={`${styles.empty} hasPaddingRow empty-message`}>
        {this.props.t('There are no transactions, yet.')} &nbsp;
        <RelativeLink className={`${styles.button} ${buttonStyle.button} ${buttonStyle.primary} ${buttonStyle.raised} receive-lsk-button ${offlineStyle.disableWhenOffline}`}
          to='receive'>{this.props.t('Receive LSK')}</RelativeLink>
      </p>;
  }
}

export default TransactionsList;

