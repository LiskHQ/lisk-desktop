import React from 'react';
// import tableStyle from 'react-toolbox/lib/table/theme.css';
import Rows from './rows';

import txFilters from '../../constants/transactionFilters';
import txTypes from '../../constants/transactionTypes';
import styles from './transactionsList.css';
import { parseSearchParams } from '../../utils/searchParams';

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

  render() { // eslint-disable-line
    const {
      transactions,
      dashboard,
      address,
      onClick,
      showMore,
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

    return <div className={`${styles.results} ${this.props.isBarEnabledTransactions ? styles.onBarEnabled : ''} ${showMore && styles.onShowMore} transaction-results`}>
      {
        transactions
        .filter(fixIncomingFilter)
        .map((transaction, i) =>
          <Rows address={address}
            key={i}
            t={t}
            value={transaction}
            onClick={onClick}
          />)
      }
    </div>;
  }
}

export default TransactionsList;
