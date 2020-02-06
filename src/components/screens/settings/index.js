/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Settings from './settings';
import { settingsUpdated } from '../../../actions/settings';
import { accountUpdated } from '../../../actions/account';
import { networkSet } from '../../../actions/network';
import { getActiveTokenAccount } from '../../../utils/account';

const mapStateToProps = state => ({
  settings: state.settings,
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
});

const mapDispatchToProps = {
  accountUpdated,
  networkSet,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Settings));
