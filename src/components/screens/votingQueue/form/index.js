/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { containsTransactionType } from '@utils/transaction';
import { getActiveTokenAccount } from '@utils/account';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import Form from './form';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  network: state.network,
  votes: state.voting,
  isVotingTxPending: containsTransactionType(
    state.transactions.pending,
    MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
  ),
});

export default connect(
  mapStateToProps,
)(withTranslation()(Form));
