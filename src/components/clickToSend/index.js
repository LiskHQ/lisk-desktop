import { connect } from 'react-redux';
import { dialogDisplayed } from '../../actions/dialog';
import ClickToSend from './clickToSend';

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
});

export default connect(
  null,
  mapDispatchToProps,
)(ClickToSend);
