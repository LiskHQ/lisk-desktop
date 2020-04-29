/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getActiveTokenAccount } from '../../../../utils/account';
import { transactionCreated, resetTransactionResult } from '../../../../actions/transactions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
  token: state.settings.token && state.settings.token.active,
});

const mapDispatchToProps = {
  transactionCreated,
  resetTransactionResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary));
