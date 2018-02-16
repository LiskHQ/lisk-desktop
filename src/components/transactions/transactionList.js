import React from 'react';
import Waypoint from 'react-waypoint';
import { connect } from 'react-redux';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
import { transactionsRequestInit } from '../../actions/transactions';
import txFilters from './../../constants/transactionFilters';
import styles from './transactions.css';

class TransactionsList extends React.Component {
  constructor(props) {
    super(props);
    if (props.peers.data) {
      this.props.transactionsRequestInit({ address: this.props.address });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.peers.data !== this.props.peers.data) {
      this.props.transactionsRequestInit({ address: this.props.address });
    }
  }
  // eslint-disable-next-line class-methods-use-this
  isLargeScreen() {
    return window.innerWidth > 768;
  }

  render() {
    const isNonSendAndFilterIncoming = transactionType =>
      (this.props.filter && this.props.filter.value === 1 && transactionType !== 0);

    if (this.props.transactions.length > 0) {
      return <div className={`${styles.results} transaction-results`}>
        <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
        {this.props.transactions.map((transaction, i) => (
          !isNonSendAndFilterIncoming(transaction.type)
            ? <TransactionRow address={this.props.address}
              key={i}
              t={this.props.t}
              value={transaction}
              nextStep={this.props.nextStep}
            />
            : null))}
        {
          // the transaction list should be scrollable on a large screen
          // otherwise (XS) the whole transaction box will be scrollable
          // (see transactionOverview.js)
          this.isLargeScreen()
            ? <Waypoint bottomOffset='-80%'
              key={this.props.transactions.length}
              onEnter={() => {
                if (this.props.loadMore) {
                  this.props.loadMore();
                }
              }}></Waypoint>
            : null
        }
      </div>;
    } else if (!this.props.filter || this.props.filter.value !== txFilters.all) {
      return <p className={`${styles.empty} hasPaddingRow empty-message`}>
        {this.props.t('There are no {{filterName}} transactions.', {
          filterName: this.props.filter && this.props.filter.name ? this.props.filter.name.toLowerCase() : '',
        })}
      </p>;
    }
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  transactionsRequestInit: data => dispatch(transactionsRequestInit(data)),
});

const mapStateToProps = state => ({
  peers: state.peers,
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsList);
