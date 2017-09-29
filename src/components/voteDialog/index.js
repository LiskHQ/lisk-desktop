import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { votePlaced, voteToggled } from '../../actions/voting';
import VoteDialog from './voteDialog';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  delegates: state.voting.delegates,
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  votePlaced: data => dispatch(votePlaced(data)),
  voteToggled: data => dispatch(voteToggled(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(VoteDialog));
