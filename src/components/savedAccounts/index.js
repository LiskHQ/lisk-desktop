import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { accountRemoved, accountSwitched } from '../../actions/savedAccounts';
import SavedAccounts from './savedAccounts';

const mapStateToProps = state => ({
  activeAccount: state.account,
  savedAccounts: state.savedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  accountRemoved: data => dispatch(accountRemoved(data)),
  accountSwitched: data => dispatch(accountSwitched(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(SavedAccounts));
