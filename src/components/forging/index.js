import { connect } from 'react-redux';
import { fetchAndUpdateForgedBlocks, fetchAndUpdateForgedStats } from '../../actions/forging';
import ForgingComponent from './forgingComponent';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  statistics: state.forging.statistics,
  forgedBlocks: state.forging.forgedBlocks,
});

const mapDispatchToProps = dispatch => ({
  onForgedBlocksLoaded: (...params) => {
    dispatch(fetchAndUpdateForgedBlocks(...params));
  },
  onForgingStatsUpdate: (...params) => {
    dispatch(fetchAndUpdateForgedStats(...params));
  },
});

const Forging = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgingComponent);

export default Forging;
