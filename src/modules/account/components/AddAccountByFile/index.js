/* istanbul ignore file */
import { connect } from 'react-redux';
import { login } from '@auth/store/action';
import AddAccountByFile from './AddAccountByFile';

const mapDispatchToProps = {
  login,
};

export default connect(
  null,
  mapDispatchToProps,
)(AddAccountByFile);
