import { connect } from 'react-redux';
import { updateForgedBlocks, updateForgingStats } from '../../actions/forging';
import ForgingComponent from './forgingComponent';
import { getForgedBlocks, getForgedStats } from '../../utils/api/forging';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  statistics: state.forging.statistics,
  forgedBlocks: state.forging.forgedBlocks,
});

const mapDispatchToProps = dispatch => ({
  loadForgedBlocks: (activePeer, limit, offset, generatorPublicKey) => {
    getForgedBlocks(activePeer, limit, offset, generatorPublicKey).then((data) => {
      dispatch(updateForgedBlocks(data.blocks));
    });
  },
  loadStats: (activePeer, key, startMoment, generatorPublicKey) => {
    getForgedStats(activePeer, startMoment, generatorPublicKey).then((data) => {
      dispatch(updateForgingStats({ [key]: data.forged }));
    });
  },
});

const Forging = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgingComponent);

export default Forging;
