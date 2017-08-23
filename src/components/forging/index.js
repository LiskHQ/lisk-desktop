import { connect } from 'react-redux';
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
)(Forging);
