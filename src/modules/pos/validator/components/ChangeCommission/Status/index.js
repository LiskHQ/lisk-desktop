/* istanbul ignore file */
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import Status from './ChangeCommissionStatus';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  transactions: state.transactions,
});

export default connect(mapStateToProps)(Status);
