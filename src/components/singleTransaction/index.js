/* istanbul ignore file */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadSingleTransaction } from '../../actions/transactions';
import SingleTransaction from './singleTransaction';

const mapStateToProps = state => ({
  address: state.account.address,
  transaction: state.transaction,
  peers: state.peers,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const mapDispatchToProps = {
  loadSingleTransaction,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleTransaction));
