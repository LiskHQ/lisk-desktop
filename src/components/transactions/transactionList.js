import React from 'react';
import Waypoint from 'react-waypoint';
import { connect } from 'react-redux';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
import { transactionsRequestInit } from '../../actions/transactions';
import txFilters from './../../constants/transactionFilters';
import txTypes from './../../constants/transactionTypes';
import styles from './transactions.css';
import { parseSearchParams } from './../../utils/searchParams';

class TransactionsList extends React.Component {
  constructor(props) {
    super(props);
    this.props.transactionsRequestInit({ address: this.props.address });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.transactions && this.props.nextStep) this.showDetails(nextProps.transactions);
  }

  showDetails(transactions) {
    const paramsId = parseSearchParams(this.props.history.location.search).id;

    if (paramsId) {
      const value = transactions.filter(transaction => transaction.id === paramsId)[0];
      if (value) this.props.nextStep({ value, t: this.props.t });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isLargeScreen() {
    return window.innerWidth > 768;
  }

  render() {
    const {
      filter,
      transactions,
      loading,
      dashboard,
      address,
      onClick,
      loadMore,
      t,
    } = this.props;

    const fixIncomingFilter = (transaction) => {
      const isTypeNonSend = transaction.type !== txTypes.send;
      const isFilterIncoming = filter && filter.value === txFilters.incoming;
      const isAccountInit = transaction.type === txTypes.send
        && transaction.senderId === transaction.recipientId;

      return !(isFilterIncoming && (isTypeNonSend || isAccountInit));
    };

    if (loading) return null;
    if (transactions.length === 0) {
      if (dashboard || (filter && filter.value !== txFilters.all)) {
        return <p className={`${styles.empty} hasPaddingRow empty-message`}>
          {t('There are no {{filterName}} transactions.', {
            filterName: filter && filter.name ? filter.name.toLowerCase() : '',
          })}
        </p>;
      }
      return null;
    }

    return <div className={`${styles.results} transaction-results`}>
      <TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>
      {transactions
        .filter(fixIncomingFilter)
        .map((transaction, i) => (
          <TransactionRow address={address}
            key={i}
            t={t}
            value={transaction}
            onClick={onClick}
          />))}
      {
        // the transaction list should be scrollable on a large screen
        // otherwise (XS) the whole transaction box will be scrollable
        // (see transactionOverview.js)
        this.isLargeScreen()
          ? <Waypoint bottomOffset='-80%'
            key={transactions.length}
            onEnter={() => {
              if (!dashboard) {
                loadMore();
              }
            }}></Waypoint>
          : null
      }
    </div>;
  }
}

const mapDispatchToProps = dispatch => ({
  transactionsRequestInit: data => dispatch(transactionsRequestInit(data)),
});

export default connect(null, mapDispatchToProps)(TransactionsList);
