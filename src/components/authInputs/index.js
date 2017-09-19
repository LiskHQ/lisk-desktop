import { connect } from 'react-redux';
import AuthInputs from './authInputs';

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(AuthInputs);

