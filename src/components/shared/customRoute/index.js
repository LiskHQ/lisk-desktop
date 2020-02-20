/* istanbul ignore file */
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import CustomRoute from './customRoute';

const mapStateToProps = state => ({
  isAuthenticated: state.account && !!state.account.info,
  settings: state.settings,
  networkIsSet: !!state.network.name,
  accountLoading: state.account && state.account.loading,
});

export default withRouter(connect(mapStateToProps)(withTranslation()(CustomRoute)));
