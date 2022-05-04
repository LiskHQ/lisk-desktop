/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getActiveTokenAccount } from '@wallet/utils/account';
import {
  resetTransactionResult,
  transactionDoubleSigned,
  transactionCreated,
} from '@common/store/actions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
  token: state.token && state.token.active,
});

const mapDispatchToProps = {
  resetTransactionResult,
  transactionDoubleSigned,
  transactionCreated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary));
