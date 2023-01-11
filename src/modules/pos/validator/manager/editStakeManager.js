import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { stakeEdited, stakesRetrieved } from 'src/redux/actions';
import { selectNetwork, selectStaking } from 'src/redux/selectors';
import EditStake from '../components/EditStake';

const mapStateToProps = (state) => ({
  network: selectNetwork(state),
  staking: selectStaking(state),
});

const mapDispatchToProps = {
  stakeEdited,
  stakesRetrieved,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(EditStake);
