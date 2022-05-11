import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { voteEdited } from '@common/store/actions';
import { selectActiveTokenAccount, selectNetwork, selectVoting } from '@common/store';
import EditVote from '../components/editVote';

const mapStateToProps = (state) => ({
  currentHeight: state.blocks.latestBlocks.length
    ? state.blocks.latestBlocks[0].height
    : 0,
  wallet: selectActiveTokenAccount(state),
  network: selectNetwork(state),
  voting: selectVoting(state),
});

const mapDispatchToProps = {
  voteEdited,
};

export default compose(
  withRouter,
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(EditVote);
