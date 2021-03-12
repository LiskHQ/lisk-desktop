// istanbul ignore file
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { accountLoggedOut, passphraseUsed } from 'actions';
import TopBar from './topBar';

const mapStateToProps = state => ({
  account: state.account,
  network: state.network,
  token: state.settings.token,
  settings: state.settings,
  noOfVotes: Object.values(state.voting)
    .filter(vote => (vote.confirmed !== vote.unconfirmed))
    .length,
});

const mapDispatchToProps = {
  logOut: accountLoggedOut,
  resetTimer: () => passphraseUsed(new Date()),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withTranslation()(TopBar),
  ),
);
