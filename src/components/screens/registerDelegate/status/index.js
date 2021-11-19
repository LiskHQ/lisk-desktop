/* istanbul ignore file */
import { connect } from 'react-redux';
import { getActiveTokenAccount } from '@utils/account';
import Status from './status';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
  network: state.network,
});

export default connect(
  mapStateToProps,
)(Status);
