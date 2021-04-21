import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { transactionBroadcasted } from '@actions';
import { getActiveTokenAccount } from '@utils/account';
import Status from './status';


const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
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
