/* istanbul ignore file */
import { connect } from 'react-redux';
import { login } from '@auth/store/action';
import AddAccountBySecretRecovery from './AddAccountBySecretRecovery';

const mapDispatchToProps = {
  login,
};

export default connect(
  null,
  mapDispatchToProps,
)(AddAccountBySecretRecovery);
