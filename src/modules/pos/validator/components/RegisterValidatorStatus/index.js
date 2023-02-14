/* istanbul ignore file */
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { transactionBroadcasted, resetTransactionResult } from 'src/redux/actions';
import Status from './Status';

const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
  transactions: state.transactions,
});
const mapDispatchToProps = {
  transactionBroadcasted,
  resetTransactionResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
