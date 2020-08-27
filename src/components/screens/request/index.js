import { connect } from 'react-redux';
import Request from './request';

export default connect(
  state => ({
    token: state.settings.token.active,
    account: state.account,
  }),
  {},
)(Request);
