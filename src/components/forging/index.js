import { connect } from 'react-redux';
import { updateForgedBlocks, updateForgingStats } from '../../actions/forging';
import ForgingComponent from './forgingComponent';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  statistics: state.forging.statistics,
  forgedBlocks: state.forging.forgedBlocks,
});

const mapDispatchToProps = dispatch => ({
  onForgedBlocksLoaded: (blocks) => {
    dispatch(updateForgedBlocks(blocks));
  },
  onForgingStatsUpdate: (stats) => {
    dispatch(updateForgingStats(stats));
  },
});

const Forging = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgingComponent);

export default Forging;
