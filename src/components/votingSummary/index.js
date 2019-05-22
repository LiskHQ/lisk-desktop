/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import VotingSummary from './votingSummary';
import { clearVotes } from '../../actions/voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  account: state.account,
});

const mapDispatchToProps = {
  clearVotes,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(VotingSummary)));

