import { connect } from 'react-redux';
import { stakeEdited } from 'src/redux/actions';
import SentStakesRow from './SentStakesRow';

const mapDispatchToProps = {
  stakeEdited,
};

export default connect(null, mapDispatchToProps)(SentStakesRow);
