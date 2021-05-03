import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { transactionBroadcasted } from '@actions';
import Status from './status';

const mapStateToProps = state => ({
  transactions: state.transactions,
  network: state.network,
});

const mapDispatchToProps = {
  transactionBroadcasted,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Status));
