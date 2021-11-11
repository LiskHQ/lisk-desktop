// istanbul ignore file
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { balanceReclaimed } from '@actions/account';

import Summary from './summary';

const mapStateToProps = state => ({
  account: state.account,
  signedTransaction: state.transactions.signedTransaction,
  txSignatureError: state.transactions.txSignatureError,
});

const mapDispatchToProps = {
  balanceReclaimed,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Summary);
