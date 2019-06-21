/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { delegateRegistered } from '../../actions/account';
import { delegatesFetched } from '../../actions/delegate';
import DelegateRegistration from './delegateRegistration';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  delegate: state.delegate,
});

const mapDispatchToProps = {
  delegatesFetched,
  delegateRegistered,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(DelegateRegistration));
