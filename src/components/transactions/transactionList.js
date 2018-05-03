import React from 'react';
import Waypoint from 'react-waypoint';
import { connect } from 'react-redux';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';
import { transactionsRequestInit } from '../../actions/transactions';
import txFilters from './../../constants/transactionFilters';
import txTypes from './../../constants/transactionTypes';
import styles from './transactionList.css';
import { parseSearchParams } from './../../utils/searchParams';
import { accountVotersFetched, accountVotesFetched } from '../../actions/account';
import DelegateStatistics from './delegateStatistics';

class TransactionsList extends React.Component {
  constructor(props) {
    super(props);
    this.props.transactionsRequestInit({ address: this.props.address });
  }

  componentWillReceiveProps(nextProps) {
    // istanbul ignore else
    if (nextProps.transactions && this.props.nextStep) this.showDetails(nextProps.transactions);
  }

  showDetails(transactions) {
    const paramsId = parseSearchParams(this.props.history.location.search).id;

    // istanbul ignore else
    if (paramsId) {
      const value = transactions.filter(transaction => transaction.id === paramsId)[0];
      // istanbul ignore else
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
    // istanbul ignore else
    if (transactions.length === 0) {
      // istanbul ignore else
      if (dashboard || (filter && filter.value !== txFilters.all)) {
        return <p className={`${styles.empty} hasPaddingRow empty-message`}>
          {t('There are no {{filterName}} transactions.', {
            filterName: filter && filter.name ? filter.name.toLowerCase() : '',
          })}
        </p>;
      }
      return null;
    }

    const isDelegateStatistics = filter && filter.value === txFilters.statistics;

    if (isDelegateStatistics) {
      return <DelegateStatistics />;
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


const mapStateToProps = state => ({
  delegate: state.account && (state.account.delegate || {}),
  votes: state.account && (state.account.votes || []),
  voters: state.account && (state.account.voters || []),
  publicKey: (state.account && state.account.delegate) ? state.account.delegate.publicKey : null,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  transactionsRequestInit: data => dispatch(transactionsRequestInit(data)),
  accountVotersFetched: data => dispatch(accountVotersFetched(data)),
  accountVotesFetched: data => dispatch(accountVotesFetched(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsList);
