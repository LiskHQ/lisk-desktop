import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
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
          // the transaction list should be scrollable on a large screen
          // otherwise (XS) the whole transaction box will be scrollable
          // (see transactionOverview.js)
          this.isLargeScreen()
            ? <Waypoint bottomOffset='-80%'
              key={this.props.transactions.length}
              onEnter={() => { this.props.loadMore(); }}></Waypoint>
            : null
        }
      </div> :
      <p className={`${styles.empty} hasPaddingRow empty-message`}>
        {this.props.t('There are no {{filterName}} transactions.', {
          filterName: this.props.filter && this.props.filter.name ? this.props.filter.name.toLowerCase() : '',
        })}
      </p>;
  }
}

export default TransactionsList;

