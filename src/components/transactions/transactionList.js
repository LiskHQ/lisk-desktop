import React from 'react';
import Waypoint from 'react-waypoint';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionRow from './transactionRow';
import TransactionsHeader from './transactionsHeader';

import txFilters from './../../constants/transactionFilters';
import txTypes from './../../constants/transactionTypes';
import styles from './transactionList.css';
import { parseSearchParams } from './../../utils/searchParams';
import DelegateStatistics from './delegateStatistics';
import UserVotes from './userVotes';

class TransactionsList extends React.Component {
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
      transactions,
      dashboard,
      address,
      onClick,
      loadMore,
      t,
    } = this.props;
    // All, incoming, outgoing are filter values. To be more consistance with other possible tabs
    // We can refer to props.filter as tabObj
    const tabObj = this.props.filter;

    const fixIncomingFilter = (transaction) => {
      const isTypeNonSend = transaction.type !== txTypes.send;
      const isFilterIncoming = tabObj && tabObj.value === txFilters.incoming;
      const isAccountInit = transaction.type === txTypes.send
        && transaction.senderId === transaction.recipientId;

      return !(isFilterIncoming && (isTypeNonSend || isAccountInit));
    };

    // istanbul ignore else
    if (transactions.length === 0) {
      // istanbul ignore else
      if (dashboard || (tabObj && tabObj.value !== txFilters.all)) {
        return <p className={`${styles.empty} hasPaddingRow empty-message`}>
          {t('There are no {{filterName}} transactions.', {
            filterName: tabObj && tabObj.name ? tabObj.name.toLowerCase() : '',
          })}
        </p>;
      }
      return null;
    }

    const isDelegateStatistics = tabObj && (tabObj.value === txFilters.statistics);

    if (isDelegateStatistics) {
      return <DelegateStatistics
        delegate={this.props.delegate}
        votes={this.props.votes}
        voters={this.props.voters} />;
    }

    const isAccountInfo = tabObj && (tabObj.value === txFilters.accountInfo);

    if (isAccountInfo) {
      return <UserVotes
        delegate={this.props.delegate}
        votes={this.props.votes}
        voters={this.props.voters} />;
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

export default TransactionsList;
