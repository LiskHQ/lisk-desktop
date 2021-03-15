// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import InitializationMessage from './initializationMessage';

const mapStateToProps = state => ({
  pendingTransactions: state.transactions.pending,
  account: getActiveTokenAccount(state),
  settings: state.settings,
});

export default connect(mapStateToProps)(withTranslation()(InitializationMessage));
