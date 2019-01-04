import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import CustomRoute from './customRoute';

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
  settings: state.settings,
});

export default withRouter(connect(mapStateToProps)(translate()(CustomRoute)));
