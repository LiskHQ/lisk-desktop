// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { secondPassphraseStored } from '@common/store/actions';
import TransactionSummary from './transactionSummary';

const mapStateToProps = state => ({
  token: state.settings.token.active,
  transactions: state.transactions,
  account: {
    ...state.wallet.info[state.settings.token.active],
    passphrase: state.passphrase,
    hwInfo: state.hwInfo,
  },
});

const mapDispatchToProps = {
  secondPassphraseStored,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(TransactionSummary);
