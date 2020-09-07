/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getAccount } from '../../../../utils/api/lsk/account';
import { getActiveTokenAccount } from '../../../../utils/account';
import { transactionBroadcasted, resetTransactionResult } from '../../../../actions/transactions';
import TransactionStatus from './transactionStatus';
import withData from '../../../../utils/withData';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  resetTransactionResult,
  transactionBroadcasted,
};

const apis = {
  recipientAccount: {
    apiUtil: (network, params) => getAccount({ network, ...params }),
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withData(apis)(withTranslation()(TransactionStatus)),
);
