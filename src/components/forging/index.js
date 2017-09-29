import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { fetchAndUpdateForgedBlocks, fetchAndUpdateForgedStats } from '../../actions/forging';
import Forging from './forging';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  statistics: state.forging.statistics,
  forgedBlocks: state.forging.forgedBlocks,
});

const mapDispatchToProps = dispatch => ({
  onForgedBlocksLoaded: data => dispatch(fetchAndUpdateForgedBlocks(data)),
  onForgingStatsUpdated: data => dispatch(fetchAndUpdateForgedStats(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Forging));
