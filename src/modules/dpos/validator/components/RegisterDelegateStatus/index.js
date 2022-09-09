/* istanbul ignore file */
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import Status from './Status';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  transactions: state.transactions,
});

export default connect(mapStateToProps)(Status);
