/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import DelegatesV2 from './delegatesV2';
import { clearVotes } from '../../actions/voting';

const mapStateToProps = state => ({
  votes: state.voting.votes,
});

const mapDispatchToProps = {
  clearVotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(DelegatesV2));
