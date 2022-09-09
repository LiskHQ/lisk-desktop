// istanbul ignore file
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Register from '../components/Signup/register';

const mapStateToProps = (state) => ({
  account: state.wallet,
  token: state.token,
});

export default withRouter(connect(mapStateToProps)(withTranslation()(Register)));
