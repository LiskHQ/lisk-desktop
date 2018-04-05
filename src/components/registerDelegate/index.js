import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { delegateRegistered, accountUpdated } from '../../actions/account';
import RegisterDelegate from './registerDelegate';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  delegateRegistered: data => dispatch(delegateRegistered(data)),
  accountUpdated: data => dispatch(accountUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(RegisterDelegate));
