/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getAccount } from '../../../utils/api/lsk/account';
import { transactionBroadcasted, resetTransactionResult } from '../../../actions/transactions';
import TransactionStatus from './transactionStatus';
import withData from '../../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  detailAccount: state.search.accounts[ownProps.fields.recipient.address] || {},
  bookmarks: state.bookmarks,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  resetTransactionResult,
  transactionBroadcasted,
};

const apis = {
  recipientAccount: {
    apiUtil: (liskAPIClient, params) => getAccount({ liskAPIClient, ...params }),
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withData(apis)(translate()(TransactionStatus)),
);
