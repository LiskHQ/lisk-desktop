import { connect } from 'react-redux';
import PrivateWrapper from './privateWrapper';

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
});

export default connect(mapStateToProps)(PrivateWrapper);
