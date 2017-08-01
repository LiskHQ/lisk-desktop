import { connect } from 'react-redux';
import { dialogDisplayed } from '../../actions/dialog';
import { accountLoggedOut } from '../../actions/account';
import HeaderElement from './headerElement';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  logOut: () => dispatch(accountLoggedOut()),
});

const Header = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderElement);

export default Header;
