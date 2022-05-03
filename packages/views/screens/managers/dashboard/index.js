// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getActiveTokenAccount } from '@wallet/utils/account';
import Dashboard from './dashboard';

const removeDuplicateTransactions = (pendingTransactions, confirmedTransactions) =>
  [...pendingTransactions, ...confirmedTransactions]
    .filter((transactionA, index, self) =>
      index === self.findIndex(transactionB => (
        transactionB.id === transactionA.id
      )));

const mapStateToProps = state => ({
  transactions: removeDuplicateTransactions(
    state.transactions.pending,
    state.transactions.confirmed,
  ),
  pendingTransactions: state.transactions.pending,
  wallet: getActiveTokenAccount(state),
  loading: state.loading.length > 0,
  settings: state.settings,
});

export default connect(mapStateToProps)(withTranslation()(Dashboard));
