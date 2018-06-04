import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import Choose from './choose';

const mapStateToProps = state => ({
  account: state.account,
  delegate: state.delegate,
});

export default withRouter(connect(mapStateToProps)(translate()(Choose)));
