import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { voteEdited } from 'src/redux/actions';
import { selectNetwork, selectVoting } from 'src/redux/selectors';
import EditVote from '../components/EditVote';

const mapStateToProps = (state) => ({
  network: selectNetwork(state),
  voting: selectVoting(state),
});

const mapDispatchToProps = {
  voteEdited,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(EditVote);
