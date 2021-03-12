/* istanbul ignore file */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getActiveTokenAccount } from 'utils/account';
import DiscreetMode from './discreetMode';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  isDiscreetMode: state.settings.discreetMode || false,
});

export default withRouter(connect(mapStateToProps)(DiscreetMode));
