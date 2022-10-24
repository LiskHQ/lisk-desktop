import { connect } from 'react-redux';
import { voteEdited } from 'src/redux/actions';
import SentVotesRow from './SentVotesRow';

const mapDispatchToProps = {
  voteEdited,
};

export default connect(null, mapDispatchToProps)(SentVotesRow);
