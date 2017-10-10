import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import { votePlaced, voteToggled } from '../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  votePlaced: data => dispatch(votePlaced(data)),
  voteToggled: data => dispatch(voteToggled(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    translate()(VoteUrlProcessor),
  ),
);

