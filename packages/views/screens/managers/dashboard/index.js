// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { selectActiveTokenAccount } from '@common/store';
import { removeDuplicateTransactions } from '@transaction/utils';
import Dashboard from './dashboard';

const mapStateToProps = state => ({
  transactions: removeDuplicateTransactions(
    state.transactions.pending,
    state.transactions.confirmed,
  ),
  pendingTransactions: state.transactions.pending,
  wallet: selectActiveTokenAccount(state),
  loading: state.loading.length > 0,
  settings: state.settings,
});

export default connect(mapStateToProps)(withTranslation()(Dashboard));
