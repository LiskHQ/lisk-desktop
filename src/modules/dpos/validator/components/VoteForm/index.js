/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { containsTransactionType } from '@transaction/utils/transaction';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import VoteForm from './VoteForm';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  votes: state.voting,
  isVotingTxPending: containsTransactionType(
    state.transactions.pending,
    MODULE_COMMANDS_NAME_ID_MAP.voteDelegate
  ),
});

export default connect(mapStateToProps)(withTranslation()(VoteForm));
