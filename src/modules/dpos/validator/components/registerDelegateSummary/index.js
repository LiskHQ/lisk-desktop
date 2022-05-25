/* istanbul ignore file */
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from '@common/store';
import { delegateRegistered } from '@dpos/validator/store/actions/delegate';
import Summary from './summary';

const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
});

const mapDispatchToProps = {
  delegateRegistered,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Summary);
