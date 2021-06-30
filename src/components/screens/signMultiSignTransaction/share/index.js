import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { transactionBroadcasted } from '@actions';
import Share from './share';

const mapStateToProps = state => ({
  state: state.account,
  txBroadcastError: state.transactions.txBroadcastError,
  networkIdentifier: state.network.networks.LSK.networkIdentifier,
});

const mapDispatchToProps = {
  transactionBroadcasted,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withTranslation(),
)(Share);
