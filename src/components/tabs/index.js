import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import Tabs from './tabs';

const mapStateToProps = state => ({
  isDelegate: state.account.isDelegate,
  peers: state.peers,
});

export default withRouter(connect(mapStateToProps)(translate()(Tabs)));

