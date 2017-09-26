import { connect } from 'react-redux';

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
)(SaveAccountButton);
