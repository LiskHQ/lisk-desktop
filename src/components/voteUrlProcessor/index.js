import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';

import { votePlaced, voteToggled, votesAdded } from '../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  votePlaced: data => dispatch(votePlaced(data)),
  voteToggled: data => dispatch(voteToggled(data)),
  votesAdded: data => dispatch(votesAdded(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    translate()(VoteUrlProcessor),
  ),
);
