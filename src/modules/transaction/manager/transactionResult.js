// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted, resetTransactionResult } from '@common/store/actions';
import TransactionResult from '../components/TransactionResult/TransactionResult';

const mapStateToProps = state => ({
  activeToken: state.token.active,
  transactions: state.transactions,
  account: {
    ...state.wallet.info[state.token.active],
    passphrase: state.wallet.passphrase,
    hwInfo: state.wallet.hwInfo,
  },
  network: state.network.networks[state.token.active],
});

const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(TransactionResult);
