/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Delegates from './delegates';
import {
  voteToggled,
  votesFetched,
  delegatesFetched,
  clearVotes,
} from '../../actions/voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  delegates: state.voting.delegates,
});

const mapDispatchToProps = {
  clearVotes,
  voteToggled,
  votesFetched,
  delegatesFetched,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Delegates));
