import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import { activePeerSet } from '../../actions/peers';
import Register from './register';

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  activePeerSet: data => dispatch(activePeerSet(data)),
});

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Register));
