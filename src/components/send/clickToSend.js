import { connect } from 'react-redux';
import { dialogDisplayed } from '../../actions/dialog';
import ClickToSendComponent from './clickToSendComponent';


const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
});

const ClickToSend = connect(
  null,
  mapDispatchToProps,
)(ClickToSendComponent);

export default ClickToSend;
