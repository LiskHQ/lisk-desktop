// istanbul ignore file
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import Register from './register';

const mapStateToProps = state => ({
  account: state.account,
  token: state.settings.token,
});

export default withRouter(connect(mapStateToProps)(translate()(Register)));
