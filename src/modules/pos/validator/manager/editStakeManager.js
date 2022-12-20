import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { stakeEdited, stakesRetrieved } from 'src/redux/actions';
import { selectNetwork, selectVoting } from 'src/redux/selectors';
import EditStake from '../components/EditStake';

const mapStateToProps = (state) => ({
  network: selectNetwork(state),
  voting: selectVoting(state),
});

const mapDispatchToProps = {
  stakeEdited,
  stakesRetrieved,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(EditStake);
