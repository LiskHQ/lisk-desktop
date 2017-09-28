import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import { activePeerSet } from '../../actions/peers';
import Register from './register';

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  activePeerSet: data => dispatch(activePeerSet(data)),
});

export default connect(
  null,
  mapDispatchToProps,
)(translate()(Register));
