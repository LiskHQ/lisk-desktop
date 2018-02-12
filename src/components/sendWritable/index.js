import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import { sent } from '../../actions/account';
import Send from './send';

const mapStateToProps = state => ({
  account: state.account,
  activePeer: state.peers.data,
  pendingTransactions: state.transactions.pending,
});

const mapDispatchToProps = dispatch => ({
  sent: data => dispatch(sent(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(Send)));
