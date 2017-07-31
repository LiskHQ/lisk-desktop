import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Tabs from './tabs';

const mapStateToProps = state => ({
  isDelegate: state.account.isDelegate,
});

export default withRouter(connect(mapStateToProps)(Tabs));

