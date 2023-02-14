/* istanbul ignore file */
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { validatorRegistered } from 'src/modules/pos/validator/store/actions/validator';
import RegisterValidatorSummary from './RegisterValidatorSummary';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
});

const mapDispatchToProps = {
  validatorRegistered,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterValidatorSummary);
