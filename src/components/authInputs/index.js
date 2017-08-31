import { connect } from 'react-redux';
import AuthInputs from './authInputs';

const mapStateToProps = state => ({
  hasSecondPassphrase: !!state.account.secondSignature,
  hasPassphrase: !!state.account.passphrase,
});

export default connect(mapStateToProps)(AuthInputs);

