import { connect } from 'react-redux';
import { dialogDisplayed } from '../../actions/dialog';
import HeaderElement from './headerElement';

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
});

const Header = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderElement);

export default Header;
