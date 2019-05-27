/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import SignInTooltipWrapper from './signInTooltipWrapper';

const mapStateToProps = state => ({
  account: state.account,
});

export default withRouter(connect(mapStateToProps)(translate()(SignInTooltipWrapper)));
