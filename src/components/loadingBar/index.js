/* istanbul ignore file */
import { connect } from 'react-redux';
import { getAPIClient } from '../../utils/api/network';
import LoadingBar from './loadingBar';

const mapStateToProps = state => ({
  loading: state.loading,
  liskAPIClient: getAPIClient(state.settings.token.active, state),
});

export default connect(mapStateToProps)(LoadingBar);
