/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import SignInTooltipWrapper from './signInTooltipWrapper';

const mapStateToProps = (state) => ({
  account: state.wallet,
});

export default withRouter(connect(mapStateToProps)(withTranslation()(SignInTooltipWrapper)));
