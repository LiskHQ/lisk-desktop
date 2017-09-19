import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import { accountLoggedOut } from '../../actions/account';
import Header from './header';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  logOut: () => dispatch(accountLoggedOut()),
});
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Header)));
