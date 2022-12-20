// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { containsTransactionType } from '@transaction/utils/transaction';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import TopBar from './topBar';

const mapStateToProps = state => ({
  stakeCount: containsTransactionType(
    state.transactions.pending,
    MODULE_COMMANDS_NAME_MAP.voteDelegate,
  ) ? 0
    : Object.values(state.voting)
      .filter(vote => (vote.confirmed !== vote.unconfirmed))
      .length,
});

export default
  connect(mapStateToProps)(
    withTranslation()(TopBar),
  )
