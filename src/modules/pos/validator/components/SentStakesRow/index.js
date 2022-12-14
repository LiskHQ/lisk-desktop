import { connect } from 'react-redux';
import { voteEdited } from 'src/redux/actions';
import SentStakesRow from './SentStakesRow';

const mapDispatchToProps = {
  voteEdited,
};

export default connect(null, mapDispatchToProps)(SentStakesRow);
