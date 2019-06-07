/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Delegates from './delegates';
import { clearVotes } from '../../actions/voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  account: state.account,
});

const mapDispatchToProps = {
  clearVotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Delegates));
