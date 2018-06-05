import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';

import Send from './send';

const mapStateToProps = state => ({
  account: state.account,
  activePeer: state.peers.data,
  pendingTransactions: state.transactions.pending,
});

const mapDispatchToProps = dispatch => ({
  settingsUpdated: data => dispatch(settingsUpdated(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Send));
