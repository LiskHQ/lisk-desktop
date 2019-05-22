/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import VotingV2 from './votingV2';
import { clearVotes, votePlaced } from '../../actions/voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  account: state.account,
});

const mapDispatchToProps = {
  clearVotes,
  votePlaced,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(VotingV2)));
