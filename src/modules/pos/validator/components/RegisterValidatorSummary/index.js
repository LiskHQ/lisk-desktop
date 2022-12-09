/* istanbul ignore file */
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { delegateRegistered } from '@pos/validator/store/actions/delegate';
import RegisterDelegateSummary from './RegisterDelegateSummary';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
});

const mapDispatchToProps = {
  delegateRegistered,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDelegateSummary);
