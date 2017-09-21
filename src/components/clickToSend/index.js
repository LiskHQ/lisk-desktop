import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import ClickToSend from './clickToSend';

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
});

export default connect(
  null,
  mapDispatchToProps,
)(translate()(ClickToSend));
