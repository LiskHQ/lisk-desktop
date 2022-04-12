// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted, resetTransactionResult } from '@common/store/actions';
import TransactionResult from '../../info/transactionResult/transactionResult';

const mapStateToProps = state => ({
  activeToken: state.settings.token.active,
  transactions: state.transactions,
  account: {
    ...state.wallet.info[state.settings.token.active],
    passphrase: state.wallet.passphrase,
    hwInfo: state.wallet.hwInfo,
  },
  network: state.network.networks[state.settings.token.active],
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
