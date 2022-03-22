/* istanbul ignore file */
import { connect } from 'react-redux';
import { getActiveTokenAccount } from '@common/utilities/account';
import Status from './status';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
});

export default connect(
  mapStateToProps,
)(Status);
