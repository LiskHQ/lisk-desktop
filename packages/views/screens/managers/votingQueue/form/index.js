/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { containsTransactionType } from '@transaction/utilities/transaction';
import { getActiveTokenAccount } from '@wallet/utilities/account';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
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
