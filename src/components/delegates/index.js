/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getActiveTokenAccount } from '../../utils/account';
import {
  voteToggled,
  loadVotes,
  loadDelegates,
  clearVotes,
} from '../../actions/voting';
import Delegates from './delegates';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  delegates: state.voting.delegates,
  votes: state.voting.votes,
});

const mapDispatchToProps = {
  clearVotes,
  voteToggled,
  loadVotes,
  loadDelegates,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Delegates));
