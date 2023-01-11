/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { containsTransactionType } from '@transaction/utils/transaction';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import StakeForm from './StakeForm';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  stakes: state.staking,
  isStakingTxPending: containsTransactionType(
    state.transactions.pending,
    MODULE_COMMANDS_NAME_MAP.stake,
  ),
});

export default connect(mapStateToProps)(withTranslation()(withRouter(StakeForm)));
