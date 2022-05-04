// istanbul ignore file
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { containsTransactionType } from '@transaction/utils/transaction';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { accountLoggedOut, timerReset } from '@common/store/actions';
import TopBar from './topBar';

const mapStateToProps = state => ({
  account: state.wallet,
  network: state.network,
  token: state.token,
  settings: state.settings,
  noOfVotes: containsTransactionType(
    state.transactions.pending,
    MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
  ) ? 0
    : Object.values(state.voting)
      .filter(vote => (vote.confirmed !== vote.unconfirmed))
      .length,
});

const mapDispatchToProps = {
  logOut: accountLoggedOut,
  resetTimer: () => timerReset(),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withTranslation()(TopBar),
  ),
);
