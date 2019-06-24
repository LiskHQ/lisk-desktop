/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { delegateRegistered } from '../../actions/account';
import DelegateRegistration from './delegateRegistration';

const mapStateToProps = state => ({
  account: state.account,
  delegate: state.delegate,
  liskAPIClient: state.peers.liskAPIClient || {},
});

const mapDispatchToProps = {
  delegateRegistered,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(DelegateRegistration)));
