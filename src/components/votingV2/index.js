/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import VotingV2 from './votingV2';

const mapStateToProps = state => ({
  votes: state.voting.votes,
});


export default connect(mapStateToProps)(translate()(VotingV2));
