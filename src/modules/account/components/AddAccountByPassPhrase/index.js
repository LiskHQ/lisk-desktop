/* istanbul ignore file */
import { connect } from 'react-redux';
import { login } from '@auth/store/action';
import AddAccountByPassPhrase from './AddAccountByPassPhrase';

const mapDispatchToProps = {
  login,
};

export default connect(
  null,
  mapDispatchToProps,
)(AddAccountByPassPhrase);
