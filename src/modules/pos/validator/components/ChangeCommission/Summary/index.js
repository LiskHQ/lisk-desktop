/* istanbul ignore file */
import { connect } from 'react-redux';
import { validatorRegistered } from 'src/modules/pos/validator/store/actions/validator';
import ChangeCommissionSummary from './ChangeCommissionSummary';

const mapDispatchToProps = {
  validatorRegistered,
};

export default connect(null, mapDispatchToProps)(ChangeCommissionSummary);
