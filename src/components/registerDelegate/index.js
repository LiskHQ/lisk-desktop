import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { delegateRegistered } from '../../actions/account';
import { delegatesFetched } from '../../actions/delegate';
import RegisterDelegate from './registerDelegate';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  delegate: state.delegate,
});

const mapDispatchToProps = dispatch => ({
  delegatesFetched: data => dispatch(delegatesFetched(data)),
  delegateRegistered: data => dispatch(delegateRegistered(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(RegisterDelegate));
