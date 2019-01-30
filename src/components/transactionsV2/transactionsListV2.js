import React from 'react';
import { translate } from 'react-i18next';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionsHeaderV2 from './transactionsHeaderV2';
import TransactionRowV2 from './transactionRowV2';
import txFilters from '../../constants/transactionFilters';
import txTypes from '../../constants/transactionTypes';
import styles from './transactionsListV2.css';
import { parseSearchParams } from '../../utils/searchParams';

class TransactionsListV2 extends React.Component {
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
      address,
      followedAccounts,
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

    return <div className={`${styles.results} transaction-results`}>
      <TransactionsHeaderV2 tableStyle={tableStyle} />
      {transactions.length
        ? transactions.filter(fixIncomingFilter)
            .map((transaction, i) =>
              <TransactionRowV2 key={i}
                followedAccounts={followedAccounts}
                address={address}
                value={transaction} />)
        : <p className={`${styles.empty} empty-message`}>
          {t('There are no transactions.')}
        </p>
      }
    </div>;
  }
}

export default translate()(TransactionsListV2);
