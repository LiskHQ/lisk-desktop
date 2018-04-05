
import { connect } from 'react-redux';
import LoadingBar from './loadingBar';

const mapStateToProps = state => ({
  loading: state.loading,
  peers: state.peers,
});

export default connect(mapStateToProps)(LoadingBar);

