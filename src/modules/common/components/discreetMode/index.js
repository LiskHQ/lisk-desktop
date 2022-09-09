/* istanbul ignore file */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectActiveTokenAccount, selectActiveToken } from 'src/redux/selectors';
import DiscreetMode from './discreetMode';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  isDiscreetMode: state.settings.discreetMode || false,
  token: selectActiveToken(state),
});

export default withRouter(connect(mapStateToProps)(DiscreetMode));
