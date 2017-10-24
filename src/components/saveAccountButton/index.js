import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { accountRemoved } from '../../actions/savedAccounts';
import SaveAccountButton from './saveAccountButton';

const mapStateToProps = state => ({
  account: state.account,
  savedAccounts: state.savedAccounts,
});

const mapDispatchToProps = dispatch => ({
  accountRemoved: data => dispatch(accountRemoved(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(SaveAccountButton));
