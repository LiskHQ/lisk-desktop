/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getAccount } from '../../../../utils/api/account';
import { getActiveTokenAccount } from '../../../../utils/account';
import { transactionBroadcasted, resetTransactionResult } from '../../../../actions/transactions';
import TransactionStatus from './transactionStatus';
import withData from '../../../../utils/withData';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  transactions: state.transactions,
  token: state.settings.token,
});

const mapDispatchToProps = {
  resetTransactionResult,
  transactionBroadcasted,
};

const apis = {
  recipientAccount: {
    apiUtil: (network, { token, ...params }) => getAccount({ network, params }, token),
    getApiParams: state => ({
      token: state.settings.token.active,
    }),
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withData(apis)(withTranslation()(TransactionStatus)),
);
