import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { resetTransactionResult, transactionBroadcasted } from '@actions';
import Status from './status';

const mapStateToProps = state => ({
  isMigrated: state.account.info.LSK.summary.isMigrated,
  transactions: state.transactions,
  network: state.network,
});

const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Status);
