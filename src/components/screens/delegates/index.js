/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '../../../utils/account';
import {
  voteToggled,
  loadDelegates,
  clearVotes,
} from '../../../actions/voting';
import Delegates from './delegates';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  delegates: state.voting.delegates,
  votes: state.voting.votes,
});

const mapDispatchToProps = {
  clearVotes,
  voteToggled,
  loadDelegates,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Delegates));
