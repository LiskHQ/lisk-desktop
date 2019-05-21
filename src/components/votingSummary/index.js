/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import VotingSummary from './votingSummary';
import { clearVotes } from '../../actions/voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
});

const mapDispatchToProps = {
  clearVotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(VotingSummary));

