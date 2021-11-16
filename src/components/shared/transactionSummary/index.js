// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { transactionDoubleSigned } from '@actions';
import TransactionSummary from './transactionSummary';

const mapStateToProps = state => ({
  token: state.settings.token.active,
  transactions: state.transactions,
  account: {
    ...state.account.info[state.settings.token.active],
    passphrase: state.passphrase,
    hwInfo: state.hwInfo,
  },
});

const mapDispatchToProps = {
  transactionDoubleSigned,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(TransactionSummary);
