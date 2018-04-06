import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import MenuBar from './menuBar';

const mapStateToProps = state => ({
  isDelegate: state.account.isDelegate,
});

export default withRouter(connect(mapStateToProps)(translate()(MenuBar)));

