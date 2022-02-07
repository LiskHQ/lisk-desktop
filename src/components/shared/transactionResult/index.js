// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted, resetTransactionResult, secondPassphraseRemoved } from '@actions';
import TransactionResult from './transactionResult';

const mapStateToProps = state => ({
  activeToken: state.settings.token.active,
  transactions: state.transactions,
  account: {
    ...state.account.info[state.settings.token.active],
    passphrase: state.account.passphrase,
    secondPassphrase: state.account.secondPassphrase,
    hwInfo: state.account.hwInfo,
  },
  network: state.network.networks[state.settings.token.active],
});

const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
  secondPassphraseRemoved,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(TransactionResult);
