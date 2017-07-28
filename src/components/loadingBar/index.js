
import { connect } from 'react-redux';
import LoadingBar from './loadingBar';

const mapStateToProps = state => ({
  loadingBar: state.loadingBar,
});

export default connect(mapStateToProps)(LoadingBar);

